import { Observable } from 'rxjs/Observable';
import { GenericTransport } from './generic-transport';

export class HttpTransport extends GenericTransport {

    private streamState: {
        mode: string,
        remainingSamples: number
    };

    private start;
    private finish;
    private timeout: number;
    private timeoutMinMs: number = 500;
    private timeoutMaxMs: number = 86400000; //One day should be enough...

    constructor(_rootUri: string, timeout: number) {
        super();
        console.log('Transport HTTP Contructor');
        this.rootUri = _rootUri;
        this.streamState = {
            mode: 'off',
            remainingSamples: 0
        }
        this.timeout = this.forceRange(timeout, this.timeoutMinMs, this.timeoutMaxMs);
    }

    getUri() {
        return this.rootUri;
    }

    setTimeout(newTimeout: number): void {
        this.timeout = this.forceRange(newTimeout, this.timeoutMinMs, this.timeoutMaxMs);
    }

    private forceRange(val: number, min: number, max: number) {
        return Math.min(Math.max(min, val), max);
    }

    getRequest(requestUrl: string, timeout?: number): Observable<any> {
        timeout = timeout == undefined ? this.timeout : this.forceRange(timeout, this.timeoutMinMs, this.timeoutMaxMs);
        return Observable.create((observer) => {
            let XHR = new XMLHttpRequest();

            XHR.addEventListener("load", (event: any) => {
                this.finish = performance.now();
                console.log('from start to fin');
                console.log(this.finish - this.start);
                observer.next(event.currentTarget.response);
                observer.complete();
            });

            XHR.addEventListener("error", (event) => {
                observer.error('Get Request Error', event);
            });

            XHR.addEventListener("timeout", (event) => {
                observer.error('Timeout', event);
            });

            try {
                XHR.open("GET", requestUrl);

                XHR.timeout = timeout;

                XHR.send();
                this.start = performance.now();
                console.log('command sent');
            }
            catch (err) {
                observer.error('TX Error: ', event);
            }
        });
    }

    //Data transmission wrapper to avoid duplicate code. 
    writeRead(endpoint: string, sendData: any, dataType: 'json' | 'binary', timeoutOverride?: number): Observable<any> {
        return this.writeReadHelper(this.rootUri, endpoint, sendData, dataType, timeoutOverride);
    }

    writeReadHelper(rootUri: string, endpoint: string, sendData: any, dataType: 'json' | 'binary', timeout?: number): Observable<any> {
        let uri = rootUri + endpoint;
        let body = sendData;
        timeout = timeout == undefined ? this.timeout : this.forceRange(timeout, this.timeoutMinMs, this.timeoutMaxMs);
        console.log(body);
        return Observable.create((observer) => {
            let XHR = new XMLHttpRequest();


            // We define what will happen if the data are successfully sent
            XHR.addEventListener("load", (event: any) => {
                this.finish = performance.now();
                console.log('from start to fin');
                console.log(this.finish - this.start);
                observer.next(event.currentTarget.response);
                observer.complete();
            });

            // We define what will happen in case of error
            XHR.addEventListener("error", (event) => {
                observer.error('TX Error: ', event);
            });

            XHR.addEventListener("timeout", (event) => {
                observer.error('HTTP Timeout: ', event);
            });


            // We set up our request
            try {
                XHR.open("POST", uri);
                if (dataType === 'json') {
                    XHR.setRequestHeader("Content-Type", "application/json");
                }
                else if (dataType === 'binary') {
                    XHR.setRequestHeader("Content-Type", "application/octet-stream");
                }

                XHR.timeout = timeout;

                //Set resposne type as arraybuffer to receive response as bytes
                XHR.responseType = 'arraybuffer';

                XHR.send(body);
                this.start = performance.now();
                console.log('command sent');
            }
            catch (err) {
                observer.error('TX Error: ', event);
            }
        });
    }

    //Stream via back to back xhr calls
    streamFrom(endpoint: string, sendData: any, dataType: string, delay = 0): Observable<any> {
        this.streamState.mode = 'continuous';

        return Observable.create((observer) => {
            let i = 0;

            let getData = function (writeReadHelper, streamState: any, rootUri: string, endpoint: string, sendData: Object, delay: number) {
                writeReadHelper(rootUri, endpoint, sendData).subscribe(
                    (data: any) => {
                        //console.log('Inner Read ', i, ' >> ', data);
                        observer.next(data)
                    },
                    (err) => {
                        console.log(err);
                    },
                    () => {
                        i++;
                        if (streamState.mode == 'continuous') {
                            //Wrap getData in anaonymous function to allow passing parameters to setTimeout handler
                            setTimeout(() => {
                                getData(writeReadHelper, streamState, rootUri, endpoint, sendData, delay)
                            }, delay);
                        } else {
                            observer.complete();
                        }
                    });
            };
            getData(this.writeReadHelper, this.streamState, this.rootUri, endpoint, sendData, delay);
        });
    }

    //Sets stream to off
    stopStream() {
        this.streamState.mode = 'off';
    }

    //Get transport type
    getType() {
        return 'http';
    }
}