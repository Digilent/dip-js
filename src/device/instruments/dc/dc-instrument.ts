import { Observable } from 'rxjs/Observable';
import { GenericInstrument } from '../generic-instrument';
import { DcChannel } from './dc-channel';
import { TransportContainer } from '../../../transport/transport-container'

export class DcInstrument extends GenericInstrument {

    readonly chans: DcChannel[] = [];
    readonly numChans: number;

    constructor(_transport: TransportContainer, _dcInstrumentDescriptor: any) {
        super(_transport, '/');

        //Populate DC supply parameters
        this.numChans = _dcInstrumentDescriptor.numChans;

        //Populate channels        
        for (let key in _dcInstrumentDescriptor) {
            if (key !== 'numChans') {
                this.chans.push(new DcChannel(_dcInstrumentDescriptor[key]));
            }
        }
    }

    //Get the output voltage(s) of the specified DC power supply channel(s).
    getVoltagesJson(chans) {
        let command = {
            "dc": {}
        }
        chans.forEach((element, index, array) => {
            command.dc[chans[index]] =
                [
                    {
                        "command": "getVoltage"
                    }
                ]
        });
        return command;
    }

    getVoltageParse(chan, responseObject) {
        return 'Channel ' + chan + ' ' + responseObject.command + ' successful';
    }

    setVoltagesJson(chans, voltages) {
        let scaledVoltages = [];
        let command = {
            "dc": {}
        }
        voltages.forEach((element, index, array) => {
            scaledVoltages.push(element * 1000);
            command.dc[chans[index]] =
                [
                    {
                        "command": "setVoltage",
                        "voltage": Math.round(element * 1000)
                    }
                ]
        });
        return command;
    }

    setVoltageParse(chan, responseObject) {
        return 'Channel ' + chan + ' ' + responseObject.command + ' successful';
    }

    getVoltages(chans: Array<number>): Observable<any> {
        let command = this.getVoltagesJson(chans);
        return Observable.create((observer) => {
            super._genericResponseHandler(command).subscribe(
                (data) => {
                    for (let i = 0; i < chans.length; i++) {
                        if (data.dc == undefined || data.dc[chans[i]][0].statusCode > 0 || data.agent != undefined) {
                            observer.error(data);
                            return;
                        }
                        data.dc[chans[i]][0].voltage = data.dc[chans[i]][0].voltage / 1000;
                    }

                    //Return voltages and complete observer
                    observer.next(data);
                    observer.complete();
                },
                (err) => {
                    observer.error(err);
                },
                () => { }
            );
        });
    }

    //Set the output voltage of the specified DC power supply channel.
    setVoltages(chans: Array<number>, voltages: Array<number>) {
        let command = this.setVoltagesJson(chans, voltages);
        return super._genericResponseHandler(command);
    }

    //Streaming read voltages from the specified channel(s)
    private streamReadVoltages(chans: Array<number>, delay = 0): Observable<Array<number>> {
        let command = {
            command: "dcGetVoltages",
            chans: chans
        }

        return Observable.create((observer) => {
            this.transport.streamFrom(this.endpoint, JSON.stringify(command), 'json', delay).subscribe(
                (arrayBuffer) => {
                    let data = JSON.parse(String.fromCharCode.apply(null, new Int8Array(arrayBuffer.slice(0))));
                    //Handle device errors and warnings
                    for (let i = 0; i < chans.length; i++) {
                        if (data.dc == undefined || data.dc[chans[i]][0].statusCode > 0 || data.agent != undefined) {
                            observer.error(data);
                            return;
                        }
                    }
                    //Scale from mV to V                            
                    data.voltages.forEach((element, index, array) => {
                        array[index] = element / 1000;
                    });
                    observer.next(data.voltages);

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

    //Stop the current stream
    private stopStream() {
        this.transport.stopStream();
    }
}