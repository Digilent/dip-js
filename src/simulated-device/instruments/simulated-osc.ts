import { SimulatedDeviceHelper } from '../simulated-device-helper';

export class SimulatedOsc {
    private simulatedDevice: SimulatedDeviceHelper;
    private buffers: number[][] = [
        [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000],
        [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000],
        [],
        [],
        [],
        []
    ];
    private offsets: number[] = [0, 0, 0];
    private gains: number[] = [1, 1, 1];
    private sampleFreqs: number[] = [0, 0, 0, 0, 0, 0, 0];
    private bufferSizes: number[] = [0, 0, 0, 0, 0, 0, 0];
    private delays: number[] = [0, 0, 0, 0, 0, 0, 0, 0];

    private defaultAwgSettings: Object = {
        signalType: 'sine',
        signalFreq: 1000000,
        vpp: 3000,
        vOffset: 0
    }
    private defaultOscSettings: Object = {
        sampleFreq: 3000000,
        bufferSize: 10000
    }

    constructor(_simulatedDevice: SimulatedDeviceHelper) {
        this.simulatedDevice = _simulatedDevice;
    }

    setParameters(chan, commandObject) {
        this.offsets[chan] = commandObject.offset;
        this.gains[chan] = commandObject.gain;
        this.sampleFreqs[chan] = commandObject.sampleFreq;
        this.bufferSizes[chan] = commandObject.bufferSize;
        this.delays[chan] = commandObject.triggerDelay;
        this.simulatedDevice.setOscParameters(commandObject, chan);
        return {
            "command": "setParameters",
            "actualOffset": commandObject.offset,
            "actualSampleFreq": commandObject.sampleFreq,
            "statusCode": 0,
            "wait": 0
        };
    }

    read(chan) {
        let targets = this.simulatedDevice.getTriggerTargets();
        let returnInfo = {};
        if (targets.osc.indexOf(parseInt(chan)) !== -1) {
            let awgSettings: any = this.simulatedDevice.getAwgSettings(1);
            let oscSettings = this.simulatedDevice.getOscParameters(chan);
            if (!this.simulatedDevice.getTriggerArmed()) {
                returnInfo = this.drawDefault();
            }
            else {
                if (awgSettings.signalType === 'sine') {
                    returnInfo = this.drawSine(awgSettings, oscSettings, chan);
                }
                else if (awgSettings.signalType === 'triangle') {
                    returnInfo = this.drawTriangle(awgSettings, oscSettings, chan);
                }
                else if (awgSettings.signalType === 'sawtooth') {
                    returnInfo = this.drawSawtooth(awgSettings, oscSettings, chan);
                }
                else if (awgSettings.signalType === 'square') {
                    returnInfo = this.drawSquare(awgSettings, oscSettings, chan);
                }
                else if (awgSettings.signalType === 'dc') {
                    returnInfo = this.drawDc(awgSettings, oscSettings, chan);
                }
                else {
                    console.log('drawing default wave');
                    returnInfo = this.drawDefault();
                }
            }
        }
        return returnInfo;
    }

    drawDefault() {
        let numSamples = 32640;
        let sampleRate = 6250000000; //30 points per period
        let vOffset = 0; //in mV

        //Calculate dt - time between data points
        let dt = 1000 / sampleRate;

        //Clock time in seconds.  Rolls ever every hour.

        //Build Y point arrays
        let y = [];
        for (let j = 0; j < numSamples; j++) {
            y[j] = 0;
        }

        let typedArray = new Int16Array(y);

        return {
            command: "read",
            statusCode: 0,
            binaryLength: 2 * typedArray.length,
            binaryOffset: null,
            acqCount: 3,
            actualSampleFreq: 1000 / dt,
            y: typedArray,
            pointOfInterest: numSamples / 2,
            triggerIndex: numSamples / 2,
            triggerDelay: 0,
            actualVOffset: vOffset,
            actualGain: 1
        };
    }

    drawSine(awgSettings, oscSettings, chan) {

        //---------- Simulate Signal ----------
        //Set default values
        let numSamples = oscSettings.bufferSize;
        let sigFreq = awgSettings.signalFreq; //in mHz
        let sampleRate = oscSettings.sampleFreq; //30 points per period
        let t0 = 0;
        let vOffset = awgSettings.vOffset; //in mV
        let vpp = awgSettings.vpp; //mV

        //Calculate dt - time between data points
        let dt = 1000 / sampleRate;

        let phase = ((parseInt(chan) - 1) * (90)) * (Math.PI / 180); //in radians

        //Clock time in seconds.  Rolls ever every hour.

        //Build Y point arrays
        let y = [];
        for (let j = 0; j < numSamples; j++) {
            y[j] = (vpp / 2) * (Math.sin((2 * Math.PI * (sigFreq / 1000)) * dt * j + t0 + phase)) + vOffset;
        }

        let typedArray = new Int16Array(y);
        //length is 2x the array length because 2 bytes per entry
        return {
            command: "read",
            statusCode: 0,
            binaryLength: 2 * typedArray.length,
            binaryOffset: null,
            acqCount: 3,
            actualSampleFreq: 1000 / dt,
            y: typedArray,
            pointOfInterest: numSamples / 2,
            triggerIndex: numSamples / 2,
            triggerDelay: 0,
            actualVOffset: vOffset,
            actualGain: 1
        };
    }
    drawSquare(awgSettings, oscSettings, chan) {
        //Set default values
        let numSamples = oscSettings.bufferSize; //ten thousand points 
        let sigFreq = awgSettings.signalFreq; //in mHz
        let sampleRate = oscSettings.sampleFreq; //30 points per period
        let t0 = 0;
        let vOffset = awgSettings.vOffset; //in mV
        let vpp = awgSettings.vpp; //mV
        let dutyCycle = 50;

        //Calculate dt - time between data points
        let dt = 1000 / sampleRate;
        let y = [];
        let period = 1 / (sigFreq / 1000);

        let phase = (parseInt(chan) - 1) * (period / 4);

        for (let i = 0; i < numSamples; i++) {
            if ((dt * i + t0 + phase) % period < period * (dutyCycle / 100)) {
                y[i] = (vOffset + vpp / 2);
            }
            else {
                y[i] = (vOffset - vpp / 2);
            }
        }

        let typedArray = new Int16Array(y);

        //length is 2x the array length because 2 bytes per entry
        return {
            command: "read",
            statusCode: 0,
            binaryLength: 2 * typedArray.length,
            binaryOffset: null,
            acqCount: 3,
            actualSampleFreq: 1000 / dt,
            y: typedArray,
            pointOfInterest: numSamples / 2,
            triggerIndex: numSamples / 2,
            triggerDelay: 0,
            actualVOffset: vOffset,
            actualGain: 1
        };
    }

    drawTriangle(awgSettings, oscSettings, chan) {
        let numSamples = oscSettings.bufferSize; //ten thousand points 
        let sigFreq = awgSettings.signalFreq; //in mHz
        let sampleRate = oscSettings.sampleFreq; //30 points per period
        let t0 = 0;
        let vOffset = awgSettings.vOffset; //in mV
        let vpp = awgSettings.vpp; //mV

        //Calculate dt - time between data points
        let dt = 1000 / sampleRate;
        let y = [];
        let period = 1 / (sigFreq / 1000);
        let phase = (parseInt(chan) - 1) * (period / 4);

        for (let i = 0; i < numSamples; i++) {
            y[i] = ((4 * (vpp / 2)) / period) * (Math.abs(((i * dt + t0 + phase + 3 * period / 4) % period) - period / 2) - period / 4) + vOffset;
        }

        let typedArray = new Int16Array(y);

        //length is 2x the array length because 2 bytes per entry
        return {
            command: "read",
            statusCode: 0,
            binaryLength: 2 * typedArray.length,
            binaryOffset: null,
            acqCount: 3,
            actualSampleFreq: 1000 / dt,
            y: typedArray,
            pointOfInterest: numSamples / 2,
            triggerIndex: numSamples / 2,
            triggerDelay: 0,
            actualVOffset: vOffset,
            actualGain: 1
        };

    }

    drawSawtooth(awgSettings, oscSettings, chan) {
        let numSamples = oscSettings.bufferSize; //ten thousand points 
        let sigFreq = awgSettings.signalFreq; //in mHz
        let sampleRate = oscSettings.sampleFreq; //30 points per period
        let t0 = 0;
        let vOffset = awgSettings.vOffset; //in mV
        let vpp = awgSettings.vpp; //mV

        //Calculate dt - time between data points
        let dt = 1000 / sampleRate;
        let y = [];
        let period = 1 / (sigFreq / 1000);
        let phase = (parseInt(chan) - 1) * (period / 4);

        for (let i = 0; i < numSamples; i++) {
            y[i] = (vpp / period) * ((dt * i + t0 + phase) % period) + vOffset;
        }

        let typedArray = new Int16Array(y);

        //length is 2x the array length because 2 bytes per entry
        return {
            command: "read",
            statusCode: 0,
            binaryLength: 2 * typedArray.length,
            binaryOffset: null,
            acqCount: 3,
            actualSampleFreq: 1000 / dt,
            y: typedArray,
            pointOfInterest: numSamples / 2,
            triggerIndex: numSamples / 2,
            triggerDelay: 0,
            actualVOffset: vOffset,
            actualGain: 1
        };

    }

    drawDc(awgSettings, oscSettings, chan) {
        let numSamples = oscSettings.bufferSize; //ten thousand points
        let sampleRate = oscSettings.sampleFreq; //30 points per period
        let vOffset = awgSettings.vOffset; //in mV

        //Calculate dt - time between data points
        let dt = 1000 / sampleRate;
        let y = [];

        for (let i = 0; i < numSamples; i++) {
            y[i] = vOffset;
        }

        let typedArray = new Int16Array(y);

        return {
            command: "read",
            statusCode: 0,
            binaryLength: 2 * typedArray.length,
            binaryOffset: null,
            acqCount: 3,
            actualSampleFreq: 1000 / dt,
            y: typedArray,
            pointOfInterest: numSamples / 2,
            triggerIndex: numSamples / 2,
            triggerDelay: 0,
            actualVOffset: vOffset,
            actualGain: 1
        };
    }

}