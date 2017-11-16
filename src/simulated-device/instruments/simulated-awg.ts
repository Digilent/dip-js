import { SimulatedDeviceHelper } from '../simulated-device-helper';

export class SimulatedAwg {
    private simulatedDevice: SimulatedDeviceHelper;
    private signalTypes: string[] = ['', '', '', '', '', '', '', ''];
    private signalFreqs: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
    private vpps: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
    private vOffsets: number[] = [0, 0, 0, 0, 0, 0, 0, 0];

    constructor(_simulatedDevice: SimulatedDeviceHelper) {
        this.simulatedDevice = _simulatedDevice;

    }

    setArbitraryWaveform(chan) {
        return {
            statusCode: 0,
            wait: 0
        };
    }

    setRegularWaveform(chan, commandObject) {
        this.signalTypes[chan] = commandObject.signalType;
        this.signalFreqs[chan] = commandObject.signalFreq;
        this.vpps[chan] = commandObject.vpp;
        this.vOffsets[chan] = commandObject.vOffset;
        this.simulatedDevice.setAwgSettings(commandObject, chan);
        return {
            "command": "setRegularWaveform",
            "statusCode": 0,
            "actualSignalFreq": commandObject.signalFreq,
            "actualVpp": commandObject.vpp,
            "actualVOffset": commandObject.vOffset,
            "wait": 0
        };
    }

    run(chan) {
        this.simulatedDevice.setTriggerArmed(true);
        return {
            "command": "run",
            "statusCode": 0,
            "wait": 0
        }
    }

    stop(chan) {
        this.simulatedDevice.setTriggerArmed(false);
        return {
            "command": "stop",
            "statusCode": 0,
            "wait": 0
        };
    }
}

