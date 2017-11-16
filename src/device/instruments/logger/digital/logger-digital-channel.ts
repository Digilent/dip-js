export class LoggerDigitalChannel {

    readonly resolution: number = 0;
    readonly effectiveBits: number = 0;
    readonly bufferSizeMax: number = 0;
    readonly fileSamplesMax: number = 0;
    readonly sampleDataType: string = "I16";
    readonly sampleFreqUnits: number = 0;
    readonly sampleFreqMin: number = 0;
    readonly sampleFreqMax: number = 0;
    readonly delayUnits: number = 0;
    readonly delayMax: number = 0;
    readonly delayMin: number = 0;
    readonly voltageUnits: number = 0;
    readonly inputVoltageMax: number = 0;
    readonly inputVoltageMin: number = 0;

    constructor(loggerChannelDescriptor: any) {
        this.resolution = loggerChannelDescriptor.resolution;
        this.effectiveBits = loggerChannelDescriptor.effectiveBits;
        this.bufferSizeMax = loggerChannelDescriptor.bufferSizeMax;
        this.fileSamplesMax = loggerChannelDescriptor.fileSamplesMax;
        this.sampleDataType = loggerChannelDescriptor.sampleDataType;
        this.sampleFreqUnits = loggerChannelDescriptor.sampleFreqUnits;
        this.sampleFreqMin = loggerChannelDescriptor.sampleFreqMin;
        this.sampleFreqMax = loggerChannelDescriptor.sampleFreqMax;
        this.delayUnits = loggerChannelDescriptor.delayUnits;
        this.delayMax = loggerChannelDescriptor.delayMax;
        this.delayMin = loggerChannelDescriptor.delayMin;
        this.voltageUnits = loggerChannelDescriptor.voltageUnits;
        this.inputVoltageMax = loggerChannelDescriptor.inputVoltageMax;
        this.inputVoltageMin = loggerChannelDescriptor.inputVoltageMin;
    }
}