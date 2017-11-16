import { Observable } from 'rxjs/Observable';
import { AwgInstrument } from './instruments/awg/awg-instrument';
import { DcInstrument } from './instruments/dc/dc-instrument';
import { LaInstrument } from './instruments/la/la-instrument';
import { OscInstrument } from './instruments/osc/osc-instrument';
import { TriggerInstrument } from './instruments/trigger/trigger-instrument';
import { GpioInstrument } from './instruments/gpio/gpio-instrument';
import { LoggerInstrument } from './instruments/logger/logger-instrument';
import { File } from './file';
import { TransportContainer } from '../transport/transport-container';

export class Device {

    public transport: TransportContainer;
    public descriptorObject: any;
    public rootUri: string;
    public deviceMake: string;
    public deviceModel: string;
    public firmwareVersion;
    public calibrationSource: 'UNCALIBRATED' | 'CALIBRATED' | 'FACTORY' | 'USER';
    public macAddress: string;
    public instruments: {
        awg: AwgInstrument,
        dc: DcInstrument,
        la: LaInstrument,
        osc: OscInstrument,
        trigger: TriggerInstrument,
        gpio: GpioInstrument,
        logger: LoggerInstrument
    } = {
        awg: null,
        dc: null,
        la: null,
        osc: null,
        trigger: null,
        gpio: null,
        logger: null
    };
    public file: File;

    public firmwareRepositoryUrl: string = 'https://s3-us-west-2.amazonaws.com/digilent/Software/OpenScope+MZ/release/without-bootloader';
    public listFirmwareUrl: string = 'https://s3-us-west-2.amazonaws.com/digilent?prefix=Software/OpenScope+MZ/release/without-bootloader';

    private httpTimeout: number;

    constructor(_rootUri: string, deviceDescriptor: any, httpTimeout: number) {

        this.descriptorObject = deviceDescriptor;
        this.httpTimeout = httpTimeout;
        this.rootUri = _rootUri;
        this.transport = new TransportContainer(this.rootUri, httpTimeout);
        if (_rootUri === 'local') {
            this.transport.setLocalTransport(deviceDescriptor);
        }
        this.deviceMake = deviceDescriptor.deviceMake;
        this.deviceModel = deviceDescriptor.deviceModel;
        this.firmwareVersion = deviceDescriptor.firmwareVersion;
        this.calibrationSource = deviceDescriptor.calibrationSource;
        this.macAddress = deviceDescriptor.macAddress;
        this.instruments.awg = new AwgInstrument(this.transport, deviceDescriptor.awg);
        this.instruments.dc = new DcInstrument(this.transport, deviceDescriptor.dc);
        this.instruments.la = new LaInstrument(this.transport, deviceDescriptor.la);
        this.instruments.osc = new OscInstrument(this.transport, deviceDescriptor.osc);
        this.instruments.trigger = new TriggerInstrument(this.transport, 'deviceDescriptor.trigger');
        this.instruments.gpio = new GpioInstrument(this.transport, deviceDescriptor.gpio);
        this.instruments.logger = new LoggerInstrument(this.transport, deviceDescriptor.log);
        this.file = new File(this.transport);
    }

    multiCommand(commandObject: any): Observable<any> {
        let commandToBeSent = {

        }
        return Observable.create((observer) => {
            for (let instrument in commandObject) {
                commandToBeSent[instrument] = {};
                let functionNames = Object.keys(commandObject[instrument]);
                let flag = false;
                for (let element of functionNames) {
                    let responseJson;
                    try {
                        responseJson = this.instruments[instrument][element + 'Json'](...commandObject[instrument][element]);
                    }
                    catch (e) {
                        console.log(e);
                        flag = true;
                        observer.error('Error in multiCommand().\nThis is most likely due to an undefined function.\nUnknown function name is: ' + element + 'Json.\nAuto-generated error: ' + e);
                    }
                    if (flag) {
                        return;
                    }
                    for (let channel in responseJson[instrument]) {
                        if (commandToBeSent[instrument][channel] === undefined) {
                            commandToBeSent[instrument][channel] = [];
                            commandToBeSent[instrument][channel] = responseJson[instrument][channel];
                        }
                        else {
                            commandToBeSent[instrument][channel].push(responseJson[instrument][channel][0]);
                        }
                    }
                }
            }
            //MultiCommand packet is complete. Now to send
            let multiCommandResponse;
            console.log('multicommand: ');
            console.log(commandToBeSent);
            this.transport.writeRead('/', JSON.stringify(commandToBeSent), 'json').subscribe(
                (arrayBuffer) => {
                    let firstChar = String.fromCharCode.apply(null, new Int8Array(arrayBuffer.slice(0, 1)));
                    if (!isNaN(parseInt(firstChar))) {
                        //TODO switch to chunked transfer

                        let count = 0;
                        let i = 0;
                        let stringBuffer = '';
                        while (count < 2 && i < 10000) {
                            let char = '';
                            char += String.fromCharCode.apply(null, new Int8Array(arrayBuffer.slice(i, i + 1)));
                            if (char === '\n') {
                                count++;
                            }
                            stringBuffer += char;
                            i++;
                        }
                        let binaryIndexStringLength = stringBuffer.indexOf('\r\n');
                        let binaryIndex = parseFloat(stringBuffer.substring(0, binaryIndexStringLength));
                        let command;
                        let binaryData;
                        try {
                            command = JSON.parse(stringBuffer.substring(binaryIndexStringLength + 2, binaryIndexStringLength + binaryIndex + 2));
                            binaryData = arrayBuffer.slice(binaryIndexStringLength + 2 + binaryIndex);
                        }
                        catch (error) {
                            console.log('Error parsing OSJB response. Printing entire response');
                            console.log(String.fromCharCode.apply(null, new Int8Array(arrayBuffer.slice(0))));
                            observer.error(error);
                            return;
                        }
                        //Command parsed. Now calling individual parsing functions
                        let flag = false;
                        for (let instrument in command) {
                            for (let channel in command[instrument]) {
                                for (let responseObject of command[instrument][channel]) {
                                    try {
                                        if (responseObject.command === 'read') {
                                            console.log(responseObject);
                                            observer.next(this.instruments[instrument][responseObject.command + 'Parse'](channel, command, binaryData));
                                        }
                                        else {
                                            observer.next(this.instruments[instrument][responseObject.command + 'Parse'](channel, responseObject));
                                        }
                                    }
                                    catch (e) {
                                        console.log(e);
                                        flag = true;
                                        observer.error('Error in multiCommand().\nThis is most likely due to an undefined function.\nUnknown function name is: ' + responseObject.command + 'Parse.\nAuto-generated error: ' + e);
                                    }
                                    if (flag) return;
                                }
                            }
                        }
                        observer.next('OSJB whaddup');
                        observer.complete();
                    }
                    else if (firstChar === '{') {
                        //JSON
                        try {
                            console.log(String.fromCharCode.apply(null, new Int8Array(arrayBuffer.slice(0))));
                            multiCommandResponse = JSON.parse(String.fromCharCode.apply(null, new Int8Array(arrayBuffer.slice(0))));
                        }
                        catch (e) {
                            console.log(e);
                            observer.error('Error in multiCommand().\nThis is most likely due to an unparseable response.\nAuto-generated error: ' + e);
                        }
                        //Response Received! Now to reparse and call observer.next for each command
                        let flag = false;
                        for (let instrument in multiCommandResponse) {
                            for (let channel in multiCommandResponse[instrument]) {
                                for (let responseObject of multiCommandResponse[instrument][channel]) {
                                    try {
                                        if (responseObject.statusCode > 0) {
                                            console.log('StatusCode Error!');
                                            observer.error(responseObject);
                                            flag = true;
                                        }
                                        observer.next(this.instruments[instrument][responseObject.command + 'Parse'](channel, responseObject));
                                    }
                                    catch (e) {
                                        console.log(e);
                                        flag = true;
                                        observer.error('Error in multiCommand().\nThis is most likely due to an undefined function.\nUnknown function name is: ' + responseObject.command + 'Parse.\nAuto-generated error: ' + e);
                                    }
                                    if (flag) { return; }
                                }
                            }
                        }
                        observer.complete();
                    }
                    else {
                        observer.error('Error in multiCommand().\nThis is most likely due to an unrecognized response format. Exiting');
                    }
                },
                (err) => {
                    console.log(err);
                    observer.error('Error in multiCommand().\nThis is most likely due to no device being detected.');
                },
                () => {

                }
            );

        });

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
                    catch(e) {
                        observer.error(e);
                        return;
                    }
                    if (data.device == undefined || data.device[0].statusCode > 0 || data.agent != undefined) {
                        observer.error(data);
                        return;
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

    resetInstruments(): Observable<any> {
        let command = {
            device: [{
                command: 'resetInstruments'
            }]
        };
        return this._genericResponseHandler(command);
    }

    storageGetLocations(): Observable<any> {
        let command = {
            "device": [{
                command: "storageGetLocations"
            }]
        }
        return this._genericResponseHandler(command);
    }

    calibrationGetStorageTypes(): Observable<any> {
        let command = {
            "device": [{
                command: "calibrationGetStorageTypes"
            }]
        };
        return this._genericResponseHandler(command);
    }

    calibrationGetInstructions(): Observable<any> {
        let command = {
            "device": [{
                command: "calibrationGetInstructions"
            }]
        }
        return this._genericResponseHandler(command);
    }

    calibrationStart(): Observable<any> {
        let command = {
            "device": [{
                command: "calibrationStart"
            }]
        }
        return this._genericResponseHandler(command);
    }

    calibrationLoad(type: string): Observable<any> {
        let command = {
            "device": [{
                "command": "calibrationLoad",
                "type": type
            }]
        }
        return this._genericResponseHandler(command);
    }

    calibrationRead(): Observable<any> {
        let command = {
            "device": [{
                command: "calibrationRead"
            }]
        }
        return this._genericResponseHandler(command);
    }

    calibrationSave(type: string): Observable<any> {
        let command = {
            "device": [{
                "command": "calibrationSave",
                "type": type
            }]
        }
        return this._genericResponseHandler(command);
    }

    calibrationGetStatus(): Observable<any> {
        let command = {
            "device": [{
                "command": "calibrationGetStatus"
            }]
        }
        return this._genericResponseHandler(command);
    }

    nicList(): Observable<any> {
        let command = {
            "device": [{
                command: "nicList"
            }]
        }
        return this._genericResponseHandler(command);
    }

    nicGetStatus(adapter: string): Observable<any> {
        let command = {
            "device": [{
                command: "nicGetStatus",
                adapter: adapter
            }]
        }
        return this._genericResponseHandler(command);
    }

    nicConnect(adapter: string, parameterSet: 'activeParameterSet'|'workingParameterSet', force: boolean): Observable<any> {
        let command = {
            "device": [{
                command: "nicConnect",
                adapter: adapter,
                parameterSet: parameterSet,
                force: force
            }]
        }
        return this._genericResponseHandler(command);
    }

    nicDisconnect(adapter: string): Observable<any> {
        let command = {
            "device": [{
                command: "nicDisconnect",
                adapter: adapter
            }]
        }
        return this._genericResponseHandler(command);
    }

    wifiScan(adapter: string): Observable<any> {
        let command = {
            "device": [{
                command: "wifiScan",
                adapter: adapter
            }]
        }
        return this._genericResponseHandler(command);
    }

    wifiReadScannedNetworks(adapter: string): Observable<any> {
        let command = {
            "device": [{
                command: "wifiReadScannedNetworks",
                adapter: adapter
            }]
        }
        return this._genericResponseHandler(command);
    }

    wifiSetParameters(adapter: string, ssid: string, securityType: 'wep40'|'wep104'|'wpa'|'wpa2'|'open', autoConnect: boolean, passphrase?: string, keys?: string, keyIndex?: number): Observable<any> {
        let command = {
            "device": [{
                "command": "wifiSetParameters",
                "ssid": ssid,
                "securityType": securityType,
                "autoConnect": autoConnect
            }]
        }
        if (securityType === 'wep40' || securityType === 'wep104') {
            command.device[0]['keys'] = keys;
            command.device[0]['keyIndex'] = keyIndex;
        }
        else if (securityType === 'wpa' || securityType === 'wpa2') {
            if (passphrase) {
                command.device[0]['passphrase'] = passphrase;
            }
            else {
                command.device[0]['keys'] = keys;
            }
        }
        else if (securityType === 'open') {
            command.device[0]['passphrase'] = '';
        }
        return this._genericResponseHandler(command);
    }

    wifiListSavedParameters(storageLocation: string): Observable<any> {
        let command = {
            "device": [{
                command: "wifiListSavedParameters",
                storageLocation: storageLocation
            }]
        }
        return this._genericResponseHandler(command);
    }

    wifiDeleteParameters(storageLocation: string, ssid: string): Observable<any> {
        let command = {
            "device": [{
                command: "wifiDeleteParameters",
                storageLocation: storageLocation,
                ssid: ssid
            }]
        }
        return this._genericResponseHandler(command);
    }

    wifiSaveParameters(storageLocation: string): Observable<any> {
        let command = {
            "device": [{
                command: "wifiSaveParameters",
                storageLocation: storageLocation
            }]
        }
        return this._genericResponseHandler(command);
    }

    wifiLoadParameters(storageLocation: string, ssid: string): Observable<any> {
        let command = {
            "device": [{
                command: "wifiLoadParameters",
                storageLocation: storageLocation,
                ssid: ssid
            }]
        }
        return this._genericResponseHandler(command);
    }

}