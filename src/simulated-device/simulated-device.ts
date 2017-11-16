import { Observable } from 'rxjs/Observable';
import { SimulatedAwg } from './instruments/simulated-awg';
import { SimulatedDc } from './instruments/simulated-dc';
import { SimulatedOsc } from './instruments/simulated-osc';
import { SimulatedTrigger } from './instruments/simulated-trigger';
import { SimulatedLa } from './instruments/simulated-la';
import { SimulatedGpio } from './instruments/simulated-gpio';
import { SimulatedDeviceHelper } from './simulated-device-helper';
import { CommandUtility } from '../utilities/command-utility';

export class SimulatedDevice {

    public streamState: {
        mode: string,
        remainingSamples: number
    };
    public descriptor: any;
    public awg: SimulatedAwg;
    public dc: SimulatedDc;
    public la: SimulatedLa;
    public osc: SimulatedOsc;
    public trigger: SimulatedTrigger;
    public gpio: SimulatedGpio;
    public simDev: SimulatedDeviceHelper;
    public commandUtility: CommandUtility;

    constructor(enumeration) {
        this.descriptor = enumeration;
        this.commandUtility = new CommandUtility();
        this.simDev = new SimulatedDeviceHelper();
        this.simDev.setEnumeration(this.descriptor);
        this.awg = new SimulatedAwg(this.simDev);
        this.dc = new SimulatedDc(this.simDev);
        this.osc = new SimulatedOsc(this.simDev);
        this.trigger = new SimulatedTrigger(this.simDev);
        this.la = new SimulatedLa(this.simDev);
        this.gpio = new SimulatedGpio(this.simDev);
    }

    send(command: any): Observable<any> {
        return Observable.create((observer) => {
            observer.next(this.parseCommand(JSON.parse(command)));
            observer.complete();
        })
    }

    parseCommand(event) {
        let responseObject: any = {};
        let sumStatusCode = 0;
        let binaryDataFlag = 0;
        for (let instrument in event) {
            //create property on response object
            responseObject[instrument] = {};
            if (event[instrument][0] !== undefined && event[instrument][0].command !== undefined) {
                if (instrument === 'device') {
                    responseObject[instrument] = [];
                    let activeIndex = responseObject[instrument].push(this.processCommands(instrument, event[instrument][0], [])) - 1;
                    sumStatusCode += responseObject[instrument][activeIndex].statusCode;
                }
                else {
                    responseObject[instrument] = this.processCommands(instrument, event[instrument][0], []);
                    sumStatusCode += responseObject[instrument].statusCode;
                }

            }

            for (let channel in event[instrument]) {
                if (event[instrument][channel][0] !== undefined) {
                    //create property on response object 
                    responseObject[instrument][channel] = [];
                    event[instrument][channel].forEach((element, index, array) => {
                        responseObject[instrument][channel].push(this.processCommands(instrument, event[instrument][channel][index], [channel])) - 1;
                        if (element.command === 'read' && instrument !== 'gpio') {
                            binaryDataFlag = 1;
                        }
                    });

                }

            }
        }
        if (binaryDataFlag) {
            return this.processBinaryDataAndSend(responseObject);
        }
        else {
            let response = JSON.stringify(responseObject);
            let buf = new ArrayBuffer(response.length);
            let bufView = new Uint8Array(buf);
            for (let i = 0; i < response.length; i++) {
                bufView[i] = response.charCodeAt(i);
            }
            return bufView.buffer;
        }
    }

    processCommands(instrument: any, commandObject: any, params: any) {
        let command = instrument + commandObject.command;
        switch (command) {
            //---------- Device ----------
            case 'deviceenumerate':
                return this.descriptor;

            //---------- AWG ----------            
            case 'awgsetArbitraryWaveform':
                return this.awg.setArbitraryWaveform(params[0]);
            case 'awgsetRegularWaveform':
                return this.awg.setRegularWaveform(params[0], commandObject);
            case 'awgrun':
                return this.awg.run(params[0]);
            case 'awgstop':
                return this.awg.stop(params[0]);

            //---------- DC ----------        
            case 'dcsetVoltage':
                return this.dc.setVoltage(params[0], commandObject.voltage);
            case 'dcgetVoltage':
                return this.dc.getVoltage(params[0]);

            //---------- GPIO ----------        
            case 'gpiowrite':
                return this.gpio.write(params[0], commandObject.value);
            case 'gpioread':
                return this.gpio.read(params[0]);
            case 'gpiosetParameters':
                return this.gpio.setParameters(params[0], commandObject.direction);

            //-------- TRIGGER --------
            case 'triggersetParameters':
                return this.trigger.setParameters(params[0], commandObject.source, commandObject.targets);
            case 'triggersingle':
                return this.trigger.single();
            case 'triggerforceTrigger':
                return this.trigger.forceTrigger();
            case 'triggerstop': 
                return this.trigger.stop();

            //---------- OSC ----------            
            case 'oscsetParameters':
                return this.osc.setParameters(params[0], commandObject);
            case 'oscread':
                return this.osc.read(params[0]);

            //---------- LA ----------            
            case 'lasetParameters':
                return this.la.setParameters(params[0], commandObject);
            case 'laread':
                return this.la.read(params[0]);

            default:
                return {
                    statusCode: 1,
                    errorMessage: 'Not a recognized command'
                };
        }
    }

    processBinaryDataAndSend(commandObject: any) {
        let binaryDataContainer: any = {};
        let binaryOffset = 0;
        for (let instrument in this.trigger.targets) {
            if (instrument === 'osc' && commandObject[instrument] != undefined) {
                binaryDataContainer['osc'] = {};
                for (let channel in commandObject[instrument]) {
                    binaryDataContainer.osc[channel] = commandObject[instrument][channel][0].y;
                    commandObject[instrument][channel][0].binaryOffset = binaryOffset;
                    binaryOffset += commandObject[instrument][channel][0].binaryLength;
                    delete commandObject[instrument][channel][0].y;
                }
            }
            if (instrument === 'la' && commandObject[instrument] != undefined) {
                binaryDataContainer['la'] = {};
                let initialIteration = true;
                for (let channel in commandObject[instrument]) {
                    commandObject[instrument][channel][0].binaryOffset = binaryOffset;
                    if (initialIteration) {
                        initialIteration = false;
                        binaryDataContainer.la[channel] = commandObject[instrument][channel][0].y;
                        binaryOffset += commandObject[instrument][channel][0].binaryLength;
                    }
                    delete commandObject[instrument][channel][0].y;
                }
            }

        }
        let buf = new ArrayBuffer(binaryOffset);
        let bufView = new Uint8Array(buf);
        let binaryInjectorIndex = 0;
        let prevLength = 0;
        for (let instrument in binaryDataContainer) {
            for (let channel in binaryDataContainer[instrument]) {
                let unsignedConversion = new Uint8Array(binaryDataContainer[instrument][channel].buffer);
                binaryInjectorIndex += prevLength + unsignedConversion.length;
                for (let i = prevLength, j = 0; i < binaryInjectorIndex; i = i + 2, j = j + 2) {
                    bufView[i] = unsignedConversion[j];
                    bufView[i + 1] = unsignedConversion[j + 1];
                }
                prevLength = unsignedConversion.length;
                if (instrument === 'la') { break; }
            }
        }
        return this.commandUtility.createChunkedArrayBuffer(commandObject, bufView.buffer).buffer;
    }
}