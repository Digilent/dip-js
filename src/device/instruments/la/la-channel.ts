export class LaChannel {
    readonly bufferDataType: string;
    readonly numDataBits: number;
    readonly bitmask: number;
    readonly sampleFreqMin: number;
    readonly sampleFreqMax: number;
    readonly bufferSizeMax: number;

    constructor(_laChannelDescriptor: any) {
        this.bufferDataType = _laChannelDescriptor.bufferDataType;
        this.numDataBits = _laChannelDescriptor.numDataBits;
        this.bitmask = _laChannelDescriptor.bitmask;
        this.sampleFreqMin = _laChannelDescriptor.sampleFreqMin;
        this.sampleFreqMax = _laChannelDescriptor.sampleFreqMax;
        this.bufferSizeMax = _laChannelDescriptor.bufferSizeMax;
    }
}