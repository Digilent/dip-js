import { Observable } from 'rxjs/Observable';
import { LaChannel } from './la-channel';
import { GenericInstrument } from '../generic-instrument';
import { Waveform } from '../../../data-types/waveform';
import { TransportContainer } from '../../../transport/transport-container';
import { CommandUtility } from '../../../utilities/command-utility';

export class LaInstrument extends GenericInstrument {

    readonly numChans: number;
    readonly chans: Array<LaChannel> = [];

    readonly numDataBuffers = 8;
    readonly dataBuffer: Array<Waveform[]> = [];
    private dataBufferWriteIndex: number = 0;
    public dataBufferReadIndex: number = 0;
    private commandUtility: CommandUtility;
    public rawPacket: ArrayBuffer;

    constructor(_transport: TransportContainer, _laInstrumentDescriptor: any) {
        super(_transport, '/')

        //Populate LA supply parameters
        this.numChans = _laInstrumentDescriptor.numChans;
        this.commandUtility = new CommandUtility();

        //Populate channels  
        for (let channel in _laInstrumentDescriptor) {
            if (channel !== 'numChans') {
                this.chans.push(new LaChannel(_laInstrumentDescriptor[channel]));
            }
        }

        for (let i = 0; i < this.numDataBuffers; i++) {
            this.dataBuffer.push([]);
        }
    }

    getCurrentStateJson(chans: number[]) {
        let command = {
            la: {}
        };
        chans.forEach((element, index, array) => {
            command.la[chans[index]] =
                [
                    {
                        command: "getCurrentState"
                    }
                ]
        });
        return command;
    }

    getCurrentState(chans: number[]) {
        let command = this.getCurrentStateJson(chans);
        return super._genericResponseHandler(command);
    }

    setParametersJson(chans: number[], bitmasks: number[], sampleFreqs: number[], bufferSizes: number[], triggerDelays: number[]) {
        let command = {
            "la": {}
        }
        chans.forEach((element, index, array) => {
            command.la[chans[index]] =
                [
                    {
                        command: "setParameters",
                        bitmask: bitmasks[index],
                        triggerDelay: Math.round(triggerDelays[index] * Math.pow(10, 12)),
                        sampleFreq: Math.round(sampleFreqs[index] * 1000),
                        bufferSize: bufferSizes[index]
                    }
                ]
        });
        return command;
    }

    setParametersParse(chan, responseObject) {
        return 'Channel ' + chan + ' ' + responseObject.command + ' successful';
    }

    //Tell OpenScope to run once and return a buffer
    setParameters(chans: number[], bitmasks: number[], sampleFreqs: number[], bufferSizes: number[], triggerDelays: number[]): Observable<any> {
        if (chans.length == 0) {
            return Observable.create((observer) => {
                observer.complete();
            });
        }

        let command = this.setParametersJson(chans, bitmasks, sampleFreqs, bufferSizes, triggerDelays);
        return super._genericResponseHandler(command);
    }

    //Tell OpenScope to run once and return a buffer
    read(chans: number[]): Observable<any> {
        if (chans.length == 0) {
            return Observable.create((observer) => {
                observer.complete();
            });
        }

        let command = {
            "la": {}
        }
        chans.forEach((element, index, array) => {
            command.la[chans[index]] =
                [
                    {
                        "command": "read"
                    }
                ]
        });
        console.log('READREADREADREAD');
        return Observable.create((observer) => {
            this.transport.writeRead('/', JSON.stringify(command), 'json').subscribe(
                (data) => {
                    this.rawPacket = data;
                    let start = performance.now();
                    this.commandUtility.observableParseChunkedTransfer(data).subscribe(
                        (data) => {
                            let command = data.json;
                            let channelsObject = {};
                            let binaryData;
                            console.log('la response received');
                            console.log(command);
                            try {
                                binaryData = new Int16Array(data.typedArray.slice(command.la[chans[0].toString()][0].binaryOffset, command.la[chans[0].toString()][0].binaryOffset + command.la[chans[0].toString()][0].binaryLength));
                            }
                            catch(e) {
                                console.log(e);
                                observer.error(e);
                                return;
                            }
                            let untypedArray = Array.prototype.slice.call(binaryData);
                            this.dataBuffer[this.dataBufferWriteIndex] = [];
                            for (let group in command.la) {
                                if (command.la[group][0].statusCode > 0) {
                                    observer.error(command);
                                    return;
                                }
                                let binaryString = command.la[group][0].bitmask.toString(2);
                                console.log(binaryString);
                                for (let i = 0; i < binaryString.length; i++) {
                                    console.log(binaryString[i]);
                                    if (binaryString[i] === '1') {
                                        let channel = binaryString.length - i;
                                        channelsObject[channel] = [];

                                        let andVal = Math.pow(2, channel - 1);
                                        let dt = 1 / (command.la[group][0].actualSampleFreq / 1000);
                                        let pointContainer = [];
                                        let triggerPosition = command.la[group][0].triggerIndex * dt;
                                        if (triggerPosition < 0) {
                                            console.log('trigger not in la buffer!');
                                            triggerPosition = command.la[group][0].triggerDelay;
                                        }
                                        for (let j = 0; j < untypedArray.length; j++) {
                                            channelsObject[channel].push((andVal & untypedArray[j]) > 0 ? 1 : 0);
                                            pointContainer.push([j * dt - triggerPosition, (andVal & untypedArray[j]) > 0 ? 1 : 0]);
                                        }

                                        this.dataBuffer[this.dataBufferWriteIndex][channel - 1] = new Waveform({
                                            dt: 1 / (command.la[group][0].actualSampleFreq / 1000),
                                            t0: 0,
                                            y: channelsObject[channel],
                                            data: pointContainer,
                                            pointOfInterest: command.la[group][0].pointOfInterest,
                                            triggerPosition: triggerPosition,
                                            seriesOffset: 0.5,
                                            triggerDelay: (command.la[group][0].triggerDelay == undefined ? command.la[group][0].actualTriggerDelay : command.la[group][0].triggerDelay)
                                        });
                                    }
                                }
                            }

                            this.dataBufferReadIndex = this.dataBufferWriteIndex;
                            this.dataBufferWriteIndex = (this.dataBufferWriteIndex + 1) % this.numDataBuffers;
                            let finish = performance.now();
                            console.log('Time: ' + (finish - start));
                            console.log(channelsObject);

                            observer.next(command);
                            //Handle device errors and warnings
                            observer.complete();
                        },
                        (err) => {
                            observer.error(data);
                        },
                        () => { }
                    );
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
