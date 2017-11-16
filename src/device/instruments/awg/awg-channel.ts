export class AwgChannel {

    readonly signalTypes: string[];
    readonly signalFreqMin: number;
    readonly signalFreqMax: number;
    readonly dataType: string;
    readonly bufferSizeMax: number;
    readonly dacVpp: number;
    readonly dtMin: number;
    readonly dtMax: number;
    readonly vOffsetMin: number;
    readonly vOffsetMax: number;
    readonly vOutMin: number;
    readonly vOutMax: number;

    constructor(awgChannelDescriptor: any) {

        this.signalTypes = awgChannelDescriptor.signalTypes;
        this.signalFreqMin = awgChannelDescriptor.signalFreqMin;
        this.signalFreqMax = awgChannelDescriptor.signalFreqMax;
        this.dataType = awgChannelDescriptor.dataType;
        this.bufferSizeMax = awgChannelDescriptor.bufferSizeMax;
        this.dacVpp = awgChannelDescriptor.dacVpp;
        this.dtMin = awgChannelDescriptor.dtMin;
        this.dtMax = awgChannelDescriptor.dtMax;
        this.vOffsetMin = awgChannelDescriptor.vOffsetMin;
        this.vOffsetMax = awgChannelDescriptor.vOffsetMax;
        this.vOutMin = awgChannelDescriptor.vOutMin;
        this.vOutMax = awgChannelDescriptor.vOutMax;
    }

}