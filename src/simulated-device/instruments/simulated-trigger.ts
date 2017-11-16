import { SimulatedDeviceHelper } from '../simulated-device-helper';

export class SimulatedTrigger {
    private simulatedDevice: SimulatedDeviceHelper;
    private sources: Array<Object> = [{
        "instrument": null,
        "channel": null,
        "type": null,
        "lowerThreshold": null,
        "upperThreshold": null
    }];
    public targets: Object = {};

    constructor(_simulatedDevice: SimulatedDeviceHelper) {
        this.simulatedDevice = _simulatedDevice;
    }

    setParameters(chan, source, targets) {
        this.sources[chan] = source;
        this.targets = targets;
        this.simulatedDevice.setTriggerTargets(targets);
        return {
            "command": "setParameters",
            "statusCode": 0,
            "wait": 0
        };
    }

    single() {
        return {
            "command": "single",
            "statusCode": 0,
            "wait": -1,
            "acqCount": 27
        };
    }

    stop() {
        return {
            "command": "stop",
            "statusCode": 0,
            "wait": -1
        }
    }

    forceTrigger() {
        return {
            "command": "forceTrigger",
            "statusCode": 2684354589,
            "wait": -1
        };
    }

}