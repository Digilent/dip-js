import { SimulatedDeviceHelper } from '../simulated-device-helper';

export class SimulatedLa {
    private simulatedDevice: SimulatedDeviceHelper;
    private buffers: number[][] = [];
    private sampleFreqs: number[] = [];
    private bufferSizes: number[] = [];
    private bitmasks: number[] = [];
    private triggerDelays: number[] = [];
    private laDescriptor;

    constructor(_simulatedDevice: SimulatedDeviceHelper) {
        this.simulatedDevice = _simulatedDevice;
        this.laDescriptor = this.simulatedDevice.getEnumeration().la;
        for (let i = 0; i < this.laDescriptor.numChans; i++) {
            this.buffers.push([]);
            this.sampleFreqs.push(0);
            this.bufferSizes.push(0);
            this.bitmasks.push(0);
            this.triggerDelays.push(0);
        }
    }

    getCurrentState(chan) {
        return {
            command: "getCurrentState",
            statusCode: 0,
            state: "idle",
            acqCount: 0,
            bitmask: this.bitmasks[chan],
            actualSampleFreq: this.sampleFreqs[chan],
            actualBufferSize: this.bufferSizes[chan],
            triggerDelay: this.triggerDelays[chan],
            wait: 0
        };
    }

    setParameters(chan, commandObject) {
        this.sampleFreqs[chan] = commandObject.sampleFreq;
        this.bufferSizes[chan] = commandObject.bufferSize;
        this.triggerDelays[chan] = commandObject.triggerDelay;
        this.bitmasks[chan] = commandObject.bitmask;
        this.simulatedDevice.setLaParameters(commandObject, chan);
        return {
            "command": "setParameters",
            "statusCode": 0,
            "actualSampleFreq": this.sampleFreqs[chan],
            "wait": 0
        };
    }

    read(chan) {
        return this.generateLaData(chan);
    }

    generateLaData(channel: number) {
        let maxBufferSize = Math.max(...this.bufferSizes);
        let typedArray = new Int16Array(maxBufferSize);
        for (let i = 0; i < typedArray.length; i++) {
            typedArray[i] = i;
        }
        return {
            command: "read",
            statusCode: 0,
            wait: 0,
            binaryLength: 2 * typedArray.length,
            binaryOffset: null,
            acqCount: 3,
            bitmask: this.bitmasks[channel],
            actualSampleFreq: this.sampleFreqs[channel],
            y: typedArray,
            pointOfInterest: this.bufferSizes[channel] / 2,
            triggerIndex: this.bufferSizes[channel] / 2,
            actualTriggerDelay: this.triggerDelays[channel]
        };
    }


}