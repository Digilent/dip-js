import { Observable } from 'rxjs/Observable';
import { GenericInstrument } from '../generic-instrument';
import { AwgChannel } from './awg-channel';
import { TransportContainer } from '../../../transport/transport-container';

//Interfaces
import { SettingsObject } from './awg-instrument';

export class AwgInstrument extends GenericInstrument {

    readonly numChans: number;
    readonly chans: Array<AwgChannel> = [];

    constructor(_transport: TransportContainer, _awgInstrumentDescriptor: any) {
        super(_transport, '/');

        //Populate AWG supply parameters
        this.numChans = _awgInstrumentDescriptor.numChans;
        //Populate channels  
        for (let key in _awgInstrumentDescriptor) {
            if (key !== 'numChans') {
                this.chans.push(new AwgChannel(_awgInstrumentDescriptor[key]));
            }
        }
    }

    private setArbitraryWaveform(chans: number[], waveforms: Array<any>, dataTypes: string[]): Observable<any> {
        let command = {
            "awg": {}
        }
        let binaryOffset = 0;
        let binaryLength = 0;
        chans.forEach((element, index, array) => {
            //Hard code 2 bytes per value
            //TODO read data types and generate length from that instead of hard code
            binaryLength = waveforms[index].y.length * 2;
            command.awg[chans[index]] =
                [
                    {
                        command: "setArbitraryWaveform",
                        binaryOffset: binaryOffset,
                        binaryLength: binaryLength,
                        binaryType: dataTypes[index],
                        vpp: 3,
                        vOffset: 0,
                        dt: waveforms[index].dt
                    }
                ]
            binaryOffset += binaryLength;
        });
        let stringCommand = JSON.stringify(command) + '\r\n';
        let jsonChars = stringCommand.length;
        let fullString = jsonChars + '\r\n' + stringCommand;
        let binaryBufferToSend = new ArrayBuffer(fullString.length + binaryOffset);
        for (let i = 0; i < fullString.length; i++) {
            binaryBufferToSend[i] = fullString.charCodeAt(i);
        }
        for (let i = 0; i < chans.length; i++) {
            let typedArray = new Int16Array(waveforms[i].y);
            let byteConvert = new Uint8Array(typedArray.buffer);
            for (let i = fullString.length, j = 0; i < binaryOffset + fullString.length; i = i + 2, j = j + 2) {
                binaryBufferToSend[i] = byteConvert[j];
                binaryBufferToSend[i + 1] = byteConvert[j + 1];
            }
        }

        return Observable.create((observer) => {
            this.transport.writeRead(this.endpoint, binaryBufferToSend, 'binary').subscribe(
                (arrayBuffer) => {
                    let data = JSON.parse(String.fromCharCode.apply(null, new Int8Array(arrayBuffer.slice(0))));
                    for (let i = 0; i < chans.length; i++) {
                        if (data.awg == undefined || data.awg[chans[i]][0].statusCode > 0 || data.agent != undefined) {
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

    getCurrentState(chans: number[]): Observable<any> {
        let command = {
            awg: {}
        }
        chans.forEach((element, index, array) => {
            command.awg[chans[index]] =
                [{
                    command: "getCurrentState"
                }]
        });

        return super._genericResponseHandler(command);
    }

    setRegularWaveform(chans: number[], settings: SettingsObject[]): Observable<any> {
        let command = {
            "awg": {}
        }
        chans.forEach((element, index, array) => {
            command.awg[chans[index]] =
                [
                    {
                        command: "setRegularWaveform",
                        signalType: settings[index].signalType,
                        signalFreq: Math.floor(settings[index].signalFreq * 1000),
                        vpp: Math.floor(settings[index].vpp * 1000),
                        vOffset: Math.floor(settings[index].vOffset * 1000)
                    }
                ]
        });

        return super._genericResponseHandler(command);
    }

    setRegularWaveformJson(chans: number[], settings: SettingsObject[]) {
        let command = {
            "awg": {}
        }
        chans.forEach((element, index, array) => {
            command.awg[chans[index]] =
                [
                    {
                        command: "setRegularWaveform",
                        signalType: settings[index].signalType,
                        signalFreq: Math.floor(settings[index].signalFreq * 1000),
                        vpp: Math.floor(settings[index].vpp * 1000),
                        vOffset: Math.floor(settings[index].vOffset * 1000)
                    }
                ]
        });

        return command;
    }

    setRegularWaveformParse(chan, responseObject) {
        return responseObject;
    }

    runJson(chans: number[]) {
        let command = {
            "awg": {}
        }
        chans.forEach((element, index, array) => {
            command.awg[chans[index]] =
                [
                    {
                        command: "run"
                    }
                ]
        });
        return command;
    }

    runParse(chan, responseObject) {
        return responseObject;
    }

    run(chans: number[]): Observable<any> {
        let command = {
            "awg": {}
        }
        chans.forEach((element, index, array) => {
            command.awg[chans[index]] =
                [
                    {
                        command: "run"
                    }
                ]
        });

        return super._genericResponseHandler(command);
    }

    stop(chans: number[]): Observable<any> {
        let command = {
            "awg": {}
        }
        chans.forEach((element, index, array) => {
            command.awg[chans[index]] =
                [
                    {
                        command: "stop"
                    }
                ]
        });

        return super._genericResponseHandler(command);
    }
}

export interface SettingsObject {
    signalType: string,
    signalFreq: number,
    vpp: number,
    vOffset: number
}
