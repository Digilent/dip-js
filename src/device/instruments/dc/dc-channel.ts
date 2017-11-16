export class DcChannel {

    readonly voltageMin: number = 0;
    readonly voltageMax: number = 0;
    readonly voltageIncrement: number = 0;
    readonly currentMin: number = 0;
    readonly currentMax: number = 0;
    readonly currentIncrement: number = 0;

    constructor(dcChannelDescriptor: any) {

        this.voltageMin = dcChannelDescriptor.voltageMin;
        this.voltageMax = dcChannelDescriptor.voltageMax;
        this.voltageIncrement = dcChannelDescriptor.voltageIncrement;

        this.currentMin = dcChannelDescriptor.currentMin;
        this.currentMax = dcChannelDescriptor.currentMax;
        this.currentIncrement = dcChannelDescriptor.currentIncrement;
    }
}