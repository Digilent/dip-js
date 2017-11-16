# dip-js
Digilent Instrumentation Protocol JavaScript Module

# Protocol Documentation
[Digilent Instrumentation Protocol Documentation](https://reference.digilentinc.com/reference/software/digilent-instrumentation-protocol/protocol)

## Installing

```
npm install @digilent/dip-js --save
```
## Usage

#### Create An Instance Of The DeviceManager
Functionality provided by the DeviceManager. Import the Device type from @digilent/dip-js as well.

```TypeScript
import { Component } from '@angular/core';
import { DeviceManager, Device } from '@digilent/dip-js';

export class MyApp {
    public deviceManager: DeviceManager;
    public myDevice: Device;
    public deviceUri: string = 'http://192.168.1.8';

    constructor() {
        this.deviceManager = new DeviceManager();
    }
}
```

### Connecting To A Device
To connect to a device over http, use the connect method. The method takes a deviceUri string e.g 'http://192.168.1.8' and returns an observable.

```Typescript
this.deviceManager.connect(this.deviceUri).subscribe(
    (data) => {
        console.log(data);
    },
    (err) => {
        console.log(err);
    },
    () => { }
);
```

#### Add A Device To The Device Manager
Once a successful connection is made, use the addDeviceFromDescriptor method to create a new device using the deviceUri and the response from the connect method.
After calling addDeviceFromDescriptor, a device of type Device is added to the devices property in DeviceManager and the activeDeviceIndex property
points to the active device.

```Typescript
this.deviceManager.connect(this.deviceUri).subscribe(
    (data) => {
        console.log(data);
        this.deviceManager.addDeviceFromDescriptor(this.deviceUri, data);
        this.myDevice = this.deviceManager.devices[this.deviceManager.activeDeviceIndex];
    },
    (err) => {
        console.log(err);
    },
    () => { }
);
```

#### Send Device Command (AWG On)
With a device, call awg.setRegularWaveform to configure the wavegen and awg.run to run the wavegen. 
See [Digilent Instrumentation Protocol](https://reference.digilentinc.com/reference/software/digilent-instrumentation-protocol/protocol)

```Typescript
this.myDevice.instruments.awg.setRegularWaveform([1], [{
    signalType: 'sine',
    signalFreq: 1000,
    vOffset: 0,
    vpp: 3
}])
.flatMap((data) => {
    console.log(data);
    return this.myDevice.instruments.awg.run([1]);
})
.subscribe(
    (data) => {
        console.log(data);
    },
    (err) => {
        console.log(err);
    },
    () => { }
);
```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details