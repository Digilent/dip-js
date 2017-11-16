# dip-js
Digilent Instrumentation Protocol JavaScript Module

# Protocol Documentation
[Digilent Instrumentation Protocol Documentation](https://reference.digilentinc.com/reference/software/digilent-instrumentation-protocol/protocol)

## Setting Up

### Install dip-js
```
npm install dip-js --save
```

### Setup App @NgModule
```TypeScript
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
 
//Digilent Instrument Protocol and Digilent Chart
import { DeviceManagerService } from 'dip-angular2/services';
 
@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, DeviceManagerService]
})
export class AppModule {}
```

## Usage

### Basic Usage

#### Inject DeviceManagerService
Functionality provided by the DeviceManagerService. Import the DeviceService type from dip-angular2 as well.

```TypeScript
import { Component } from '@angular/core';
import { DeviceManagerService, DeviceService } from 'dip-angular2/services';

@Component({
    selector: 'page-hello-ionic',
    templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
    public myDevice: DeviceService;

    constructor(public deviceManagerService: DeviceManagerService) {
 
    }
}
```

### Connecting To A Device
To connect to a device over http, use the connect method. The method takes a deviceUri string e.g 'http://192.168.1.8' and returns an observable.

```Typescript
this.deviceManagerService.connect(this.deviceUri).subscribe(
    (data) => {
        console.log(data);
    },
    (err) => {
        console.log(err);
    },
    () => { }
);
```

#### Add A Device To The Device Manager Service
Once a successful connection is made, use the addDeviceFromDescriptor method to create a new device using the deviceUri and the response from the connect method.
After calling addDeviceFromDescriptor, a device of type DeviceService is added to the devices property in DeviceManagerService and the activeDeviceIndex property
points to the active device.

```Typescript
this.deviceManagerService.connect(this.deviceUri).subscribe(
    (data) => {
        console.log(data);
        this.deviceManagerService.addDeviceFromDescriptor(this.deviceUri, data);
        this.myDevice = this.deviceManagerService.devices[this.deviceManagerService.activeDeviceIndex];
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