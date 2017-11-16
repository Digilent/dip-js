import { SimulatedDeviceHelper } from '../simulated-device-helper';

export class SimulatedDc {
    private simulatedDevice: SimulatedDeviceHelper;
    private voltages: number[] = [0, 0, 0, 0, 0, 0, 0, 0];

    constructor(_simulatedDevice: SimulatedDeviceHelper) {
        this.simulatedDevice = _simulatedDevice;

    }

    getVoltage(_chan) {
        return {
            command: 'getVoltage',
            voltage: this.voltages[_chan],
            statusCode: 0,
            wait: 100
        }
    }

    setVoltage(_chan, _voltage) {
        this.voltages[_chan] = _voltage;
        return {
            command: 'setVoltage',
            statusCode: 0,
            wait: 0
        };
    }

}