export class Waveform {

    readonly t0: number;
    readonly dt: number;
    readonly y: Array<number>;
    readonly data: Array<number[]>;
    readonly pointOfInterest: number = 0;
    readonly triggerPosition: number = 0;
    readonly seriesOffset: number = 0;
    readonly triggerDelay: number = 0;

    constructor(waveformDescriptor: WaveformDescriptor) {
       {
            //Construct waveform from waveform descriptor object                   
            this.t0 = waveformDescriptor.t0;
            this.dt = waveformDescriptor.dt;
            this.y = waveformDescriptor.y;
            this.data = waveformDescriptor.data;
            this.pointOfInterest = waveformDescriptor.pointOfInterest;
            this.triggerPosition = waveformDescriptor.triggerPosition;
            this.seriesOffset = waveformDescriptor.seriesOffset;
            this.triggerDelay = waveformDescriptor.triggerDelay;
        }
    }
}

export interface WaveformDescriptor {
    dt: number, y: number[], 
    pointOfInterest: number, 
    triggerPosition: number, 
    seriesOffset: number, 
    t0: number, 
    data: number[][], 
    triggerDelay: number
}