import { Observable } from 'rxjs/Observable';
import { GenericInstrument } from '../../generic-instrument';
import { TransportContainer } from '../../../../transport/transport-container';
import { LoggerDigitalChannel } from './logger-digital-channel';
import { LoggerCommand } from '../logger-command';

//Interfaces
import { LoggerInstruments } from '../logger-command';

export class LoggerDigitalInstrument extends GenericInstrument {

    readonly chans: LoggerDigitalChannel[] = [];
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

        //Populate logger digital supply parameters
        this.numChans = _loggerInstrumentDescriptor.numChans;

        //Populate channels        
        for (let key in _loggerInstrumentDescriptor) {
            if (key !== 'numChans') {
                this.chans.push(new LoggerDigitalChannel(_loggerInstrumentDescriptor[key]));
            }
        }
    }

    setParameters(chans: number[], maxSampleCounts: number[], sampleFreqs: number[], startDelays: number[], overflows: Array<'stop' | 'circular'>, storageLocations: string[], uris: string[], bitMasks: number[]) {
        return this.loggerCommand.digitalSetParameters(chans, maxSampleCounts, sampleFreqs, startDelays, overflows, storageLocations, uris, bitMasks);
    }

    run(instrument: LoggerInstruments, chans: number[]) {
        return this.loggerCommand.run('digital', chans);
    }

    stop(instrument: LoggerInstruments, chans: number[]): Observable<any> {
        return this.loggerCommand.stop('digital', chans);
    }

    read(instrument: LoggerInstruments, chans: number[], startIndices: number[], counts: number[]): Observable<any> {
        return this.loggerCommand.read('digital', chans, startIndices, counts);
    }

    getCurrentState(instrument: LoggerInstruments, chans: number[]) {
        return this.loggerCommand.getCurrentState('digital', chans);
    }

}