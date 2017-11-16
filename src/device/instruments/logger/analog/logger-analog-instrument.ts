import { Observable } from 'rxjs/Observable';
import { GenericInstrument } from '../../generic-instrument';
import { TransportContainer } from '../../../../transport/transport-container';
import { LoggerAnalogChannel } from './logger-analog-channel';
import { LoggerCommand } from '../logger-command';

//Interfaces
import { LoggerInstruments } from '../logger-command';

export class LoggerAnalogInstrument extends GenericInstrument {

    readonly chans: LoggerAnalogChannel[] = [];
    readonly numChans: number = 0;
    readonly fileFormat: number = -1;
    readonly fileRevision: number = -1;
    private loggerCommand: LoggerCommand = new LoggerCommand(this);

    constructor(_transport: TransportContainer, _loggerInstrumentDescriptor: any) {
        super(_transport, '/');

        if (_loggerInstrumentDescriptor == undefined) {
            return;
        }

        this.fileFormat = _loggerInstrumentDescriptor.fileFormat;
        this.fileRevision = _loggerInstrumentDescriptor.fileRevision;

        //Populate logger analog supply parameters
        this.numChans = _loggerInstrumentDescriptor.numChans;

        //Populate channels        
        for (let key in _loggerInstrumentDescriptor) {
            if (parseInt(key).toString() === key && !isNaN(parseInt(key))) {
                this.chans.push(new LoggerAnalogChannel(_loggerInstrumentDescriptor[key]));
            }
        }
    }

    setParameters(chans: number[], maxSampleCounts: number[], gains: number[], vOffsets: number[], sampleFreqs: number[], startDelays: number[], overflows: Array<'stop' | 'circular'>, storageLocations: string[], uris: string[]) {
        return this.loggerCommand.analogSetParameters(chans, maxSampleCounts, gains, vOffsets, sampleFreqs, startDelays, overflows, storageLocations, uris);
    }

    run(instrument: LoggerInstruments, chans: number[]) {
        return this.loggerCommand.run('analog', chans);
    }

    stop(instrument: LoggerInstruments, chans: number[]): Observable<any> {
        return this.loggerCommand.stop('analog', chans);
    }

    read(instrument: LoggerInstruments, chans: number[], startIndices: number[], counts: number[]): Observable<any> {
        return this.loggerCommand.read('analog', chans, startIndices, counts);
    }

    getCurrentState(instrument: LoggerInstruments, chans: number[]) {
        return this.loggerCommand.getCurrentState('analog', chans);
    }
}