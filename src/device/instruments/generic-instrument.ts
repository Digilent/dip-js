import { Observable } from 'rxjs/Observable';
import { TransportContainer } from '../../transport/transport-container';

export abstract class GenericInstrument {

    readonly transport: TransportContainer;

    readonly endpoint: string = '';
    abstract numChans: number;

    constructor(_transport: TransportContainer, _endpoint: string) {
        this.transport = _transport;
        this.endpoint = _endpoint;
    }

    _genericResponseHandler(commandObject: Object): Observable<any> {
        return Observable.create((observer) => {
            this.transport.writeRead('/', JSON.stringify(commandObject), 'json').subscribe(
                (arrayBuffer) => {
                    let data;
                    try {
                        let stringify = String.fromCharCode.apply(null, new Int8Array(arrayBuffer.slice(0)));
                        console.log(stringify);
                        data = JSON.parse(stringify);
                    }
                    catch (e) {
                        observer.error(e);
                        return;
                    }
                    if (data == undefined || data.agent != undefined) {
                        observer.error(data);
                        return;
                    }
                    for (let instrument in data) {
                        if (instrument === 'log') {
                            for (let chanType in data[instrument]) {
                                for (let channel in data[instrument][chanType]) {
                                    if (data[instrument][chanType][channel][0].statusCode > 0) {
                                        observer.error(data);
                                        return;
                                    }
                                }
                            } 
                        }
                        else {
                            for (let channel in data[instrument]) {
                                if (data[instrument][channel][0].statusCode > 0) {
                                    observer.error(data);
                                    return;
                                }
                            }
                        }
                    }
                    observer.next(data);
                    //Handle device errors and warnings
                    observer.complete();
                },
                (err) => {
                    observer.error(err);
                },
                () => {
                    observer.complete();
                }
            )
        });
    }
}