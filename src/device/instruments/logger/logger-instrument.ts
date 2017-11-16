import { Observable } from 'rxjs/Observable';
import { LoggerAnalogInstrument } from './analog/logger-analog-instrument';
import { LoggerDigitalInstrument } from './digital/logger-digital-instrument';
import { TransportContainer } from '../../../transport/transport-container';

export class LoggerInstrument {

    readonly analog: LoggerAnalogInstrument;
    readonly digital: LoggerDigitalInstrument;

    constructor(_transport: TransportContainer, _loggerInstrumentDescriptor: any) {
        this.analog = new LoggerAnalogInstrument(_transport, _loggerInstrumentDescriptor == undefined ? undefined : _loggerInstrumentDescriptor.analog);
        this.digital = new LoggerDigitalInstrument(_transport, _loggerInstrumentDescriptor == undefined ? undefined : _loggerInstrumentDescriptor.digital);
    }
}