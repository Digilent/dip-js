export class OscChannel {

    readonly effectiveBits: number;
    readonly bufferSizeMax: number;
    readonly bufferDataType: string;
    readonly resolution: number;
    readonly sampleFreqMin: number;
    readonly sampleFreqMax: number;
    readonly adcVpp: number;
    readonly inputVoltageMax: number;
    readonly inputVoltageMin: number;
    readonly gains: number[];
    readonly delayMax: number;
    readonly delayMin: number;

    constructor(oscChannelDescriptor: any) {

        this.effectiveBits = oscChannelDescriptor.effectiveBits;
        this.bufferSizeMax = oscChannelDescriptor.bufferSizeMax;
        this.bufferDataType = oscChannelDescriptor.bufferDataType;
        this.resolution = oscChannelDescriptor.resolution;
        this.sampleFreqMin = oscChannelDescriptor.sampleFreqMin;
        this.sampleFreqMax = oscChannelDescriptor.sampleFreqMax;
        this.adcVpp = oscChannelDescriptor.adcVpp;
        this.inputVoltageMax = oscChannelDescriptor.inputVoltageMax;
        this.inputVoltageMin = oscChannelDescriptor.inputVoltageMin;
        this.gains = oscChannelDescriptor.gains;
        this.delayMax = oscChannelDescriptor.delayMax;
        this.delayMin = oscChannelDescriptor.delayMin;

    }


}