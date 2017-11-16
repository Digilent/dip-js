import { Observable } from 'rxjs/Observable';
import { GenericInstrument } from '../generic-instrument';
import { TransportContainer } from '../../../transport/transport-container';

export class GpioInstrument extends GenericInstrument {

    readonly numChans: number;
    readonly sinkCurrentMax: number;
    readonly sourceCurrentMax: number;

    constructor(_transport: TransportContainer, _gpioInstrumentDescriptor: any) {
        super(_transport, '/');

        //Populate LA supply parameters
        this.numChans = _gpioInstrumentDescriptor.numChans;
        this.sinkCurrentMax = _gpioInstrumentDescriptor.sinkCurrentMax;
        this.sourceCurrentMax = _gpioInstrumentDescriptor.sourceCurrentMax;
    }

    setParameters(chans: Array<number>, directions: string[]): Observable<any> {
        let command = {
            "gpio": {}
        }
        chans.forEach((element, index, array) => {
            command.gpio[chans[index]] =
                [
                    {
                        "command": "setParameters",
                        "direction": directions[index]
                    }
                ]
        });
        return super._genericResponseHandler(command);
    }

    //Set the output voltage of the specified DC power supply channel.
    write(chans: Array<number>, values: Array<number>) {
        let command = {
            "gpio": {}
        }
        values.forEach((element, index, array) => {
            command.gpio[chans[index]] =
                [
                    {
                        "command": "write",
                        "value": values[index]
                    }
                ]
        });
        return super._genericResponseHandler(command);
    }

    //Set the output voltage of the specified DC power supply channel.
    read(chans: Array<number>) {
        let command = {
            "gpio": {}
        }
        chans.forEach((element, index, array) => {
            command.gpio[chans[index]] =
                [
                    {
                        "command": "read"
                    }
                ]
        });
        return Observable.create((observer) => {
            if (chans.length < 1) { observer.error('No Channels Specified') }
            this.transport.writeRead(this.endpoint, JSON.stringify(command), 'json').subscribe(
                (arrayBuffer) => {
                    //Handle device errors and warnings
                    let data;
                    try {
                        data = JSON.parse(String.fromCharCode.apply(null, new Int8Array(arrayBuffer.slice(0))));
                    }
                    catch (e) {
                        observer.error(e);
                        return;
                    }

                    for (let i = 0; i < chans.length; i++) {
                        if (data.gpio == undefined || data.gpio[chans[i]][0].statusCode > 0 || data.agent != undefined) {
                            observer.error(data);
                            return;
                        }
                    }
                    observer.next(data);
                    observer.complete();

                },
                (err) => {
                    observer.error(err);
                },
                () => {
                    observer.complete();
                }
            );
        });
    }

}
