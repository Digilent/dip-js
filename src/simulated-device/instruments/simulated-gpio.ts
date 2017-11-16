import { SimulatedDeviceHelper } from '../simulated-device-helper';

export class SimulatedGpio {
    private simulatedDevice: SimulatedDeviceHelper;
    private values: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    private directions: string[] = ['input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'input'];
    private counter: number = 1;
    private prevChannel: number = -1;

    constructor(_simulatedDevice: SimulatedDeviceHelper) {
        this.simulatedDevice = _simulatedDevice;

    }

    counterVal(_chan) {
        if (parseInt(_chan) <= this.prevChannel) { this.counter++ }
        this.values[_chan] = (this.counter & Math.pow(2, _chan - 1)) > 0 ? 1 : 0;
        this.prevChannel = parseInt(_chan);
    }

    read(_chan) {
        this.counterVal(_chan);
        return {
            command: 'read',
            value: this.values[_chan],
            direction: this.directions[_chan],
            statusCode: 0,
            wait: 100
        }
    }

    write(_chan, _value) {
        this.values[_chan] = _value;
        return {
            command: 'write',
            statusCode: 0,
            wait: 500
        };
    }

    setParameters(_chan, _direction) {
        this.values[_chan] = _direction;
        return {
            command: 'setParameters',
            statusCode: 0,
            wait: 100
        };
    }

}