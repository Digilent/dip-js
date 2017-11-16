import { Observable } from 'rxjs/Observable';
import { GenericInstrument } from '../generic-instrument';
import { TriggerChannel } from './trigger-channel';
import { Waveform } from '../../../data-types/waveform';
import { TransportContainer } from '../../../transport/transport-container';

export class TriggerInstrument extends GenericInstrument {

    readonly numChans: number;
    readonly chans: TriggerChannel[] = [];


    constructor(_transport: TransportContainer, _triggerInstrumentDescriptor: any) {
        super(_transport, '/');
    }

    setParametersJson(chans: number[], sources: Object[], targetsArray: Object[]) {
        let command = {
            "trigger": {}
        }
        chans.forEach((element, index, array) => {
            command.trigger[chans[index]] =
                [
                    {
                        "command": "setParameters",
                        "source": sources[index],
                        "targets": targetsArray[index]
                    }
                ]
        });
        return command;
    }

    setParametersParse(chan, command) {
        return 'set Parameters channel ' + chan + ' is done!';
    }

    //Tell OpenScope to run once and return a buffer
    setParameters(chans: number[], sources: Object[], targetsArray: Object[]): Observable<any> {
        if (chans.length == 0) {
            return Observable.create((observer) => {
                observer.complete();
            });
        }

        let command = this.setParametersJson(chans, sources, targetsArray);
        return super._genericResponseHandler(command);
    }

    getCurrentState(chans: number[]) {
        let command = this.getCurrentStateJson(chans);
        return super._genericResponseHandler(command);
    }

    getCurrentStateJson(chans: number[]) {
        let command = {
            trigger: {}
        };
        chans.forEach((element, index, array) => {
            command.trigger[chans[index]] =
                [
                    {
                        command: 'getCurrentState'
                    }
                ]
        });
        return command;
    }

    getCurrentStateParse(chan, responseObject) {
        return 'Success';
    }

    singleJson(chans: number[]) {
        let command = {
            "trigger": {}
        }
        chans.forEach((element, index, array) => {
            command.trigger[chans[index]] =
                [
                    {
                        "command": "single"
                    }
                ]
        });
        return command;
    }

    singleParse(chan, command) {
        return 'single channel ' + chan + ' is done';
    }

    single(chans: number[]): Observable<any> {
        //If no channels are active no need to talk to hardware
        if (chans.length == 0) {
            return Observable.create((observer) => {
                observer.complete();
            });
        }

        let command = this.singleJson(chans);
        return super._genericResponseHandler(command);
    }

    stopJson(chans: number[]) {
        let command = {
            trigger: {}
        }
        chans.forEach((element, index, array) => {
            command.trigger[chans[index]] = [{
                command: "stop"
            }]
        });
        return command;
    }

    stopParse(chan, command) {
        return 'stop done';
    }

    stop(chans: number[]): Observable<any> {
        if (chans.length == 0) {
            return Observable.create((observer) => {
                observer.complete();
            });
        }

        let command = this.stopJson(chans);
        return super._genericResponseHandler(command);
    }

    forceTriggerJson(chans: number[]) {
        let command = {
            "trigger": {}
        }
        chans.forEach((element, index, array) => {
            command.trigger[chans[index]] =
                [
                    {
                        "command": "forceTrigger"
                    }
                ]
        });
        return command;
    }

    forceTriggerParse(chan, command) {
        return 'force trigger done';
    }

    forceTrigger(chans: number[]): Observable<any> {
        //If no channels are active no need to talk to hardware
        if (chans.length == 0) {
            return Observable.create((observer) => {
                observer.complete();
            });
        }

        let command = this.forceTriggerJson(chans);
        return super._genericResponseHandler(command);
    }

}