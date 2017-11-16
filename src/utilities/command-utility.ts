import { Observable } from 'rxjs/Observable';

export class CommandUtility {

    constructor() { }

    parseChunkedTransfer(data): Promise<any> {
        return new Promise((resolve, reject) => {
            let firstChar = String.fromCharCode.apply(null, new Uint8Array(data.slice(0, 1)));
            if (isNaN(parseInt(firstChar, 16))) {
                reject({
                    message: 'json or bad packet',
                    payload: data
                });
                return;
            }
            let chunkGuardLength = 100;
            let currentReadIndex: number = 0;
            let chunkLength: number;
            let chunkInfo = this._findNewLineChar(chunkGuardLength, data, currentReadIndex);
            chunkLength = this._getChunkLength(chunkInfo.stringBuffer);
            currentReadIndex = chunkInfo.endingIndex;
            let jsonPortion;
            try {
                jsonPortion = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(data.slice(currentReadIndex, currentReadIndex + chunkLength + 2))));
            }
            catch (e) {
                reject(e);
                return;
            }
            currentReadIndex = currentReadIndex + chunkLength + 2;
            chunkInfo = this._findNewLineChar(chunkGuardLength, data, currentReadIndex);
            chunkLength = this._getChunkLength(chunkInfo.stringBuffer);
            currentReadIndex = chunkInfo.endingIndex;
            let binaryDataSlice = data.slice(currentReadIndex, currentReadIndex + chunkLength);
            if (binaryDataSlice.byteLength !== chunkLength) {
                console.warn(new Uint8Array(data));
                reject('corrupt transfer');
                return;
            }
            let typedArray;
            try {
                typedArray = new Int16Array(binaryDataSlice);
            }
            catch(e) {
                reject(e);
                return;
            }
            resolve({
                json: jsonPortion,
                typedArray: typedArray
            });
        });
    }

    observableParseChunkedTransfer(data, typedArrayFormat?: 'i16' | 'u8'): Observable<any> {
        typedArrayFormat = typedArrayFormat == undefined ? 'i16' : typedArrayFormat;
        return Observable.create((observer) => {
            let firstChar = String.fromCharCode.apply(null, new Uint8Array(data.slice(0, 1)));
            if (isNaN(parseInt(firstChar, 16))) {
                observer.error({
                    message: 'json or bad packet',
                    payload: data
                });
                return;
            }
            let chunkGuardLength = 100;
            let currentReadIndex: number = 0;
            let chunkLength: number;
            let chunkInfo = this._findNewLineChar(chunkGuardLength, data, currentReadIndex);
            chunkLength = this._getChunkLength(chunkInfo.stringBuffer);
            currentReadIndex = chunkInfo.endingIndex;
            let jsonPortion;
            try {
                jsonPortion = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(data.slice(currentReadIndex, currentReadIndex + chunkLength + 2))));
            }
            catch (e) {
                observer.error(e);
                return;
            }
            currentReadIndex = currentReadIndex + chunkLength + 2;
            chunkInfo = this._findNewLineChar(chunkGuardLength, data, currentReadIndex);
            chunkLength = this._getChunkLength(chunkInfo.stringBuffer);
            currentReadIndex = chunkInfo.endingIndex;
            let binaryDataSlice = data.slice(currentReadIndex, currentReadIndex + chunkLength);
            if (binaryDataSlice.byteLength !== chunkLength) {
                console.warn(new Uint8Array(data));
                observer.error('corrupt transfer');
                return;
            }
            let typedArray;
            try {
                switch (typedArrayFormat) {
                    case 'i16':
                        typedArray = new Int16Array(binaryDataSlice);
                        break;
                    case 'u8':
                        typedArray = new Uint8Array(binaryDataSlice);
                        break;
                    default:
                        typedArray = new Int16Array(binaryDataSlice);
                }
            }
            catch(e) {
                observer.error(e);
                return;
            }
            observer.next({
                json: jsonPortion,
                typedArray: typedArray
            });
            observer.complete();
        });
    }

    private _getChunkLength(chunkString: string) {
        return parseInt(chunkString, 16);
    }

    private _findNewLineChar(maxLength: number, data: ArrayBuffer, startIndex: number) {
        let char = '';
        let i = startIndex;
        maxLength = maxLength + i;
        let stringBuffer = '';
        while (i < maxLength && char !== '\n') {
            char = String.fromCharCode.apply(null, new Int8Array(data.slice(i, i + 1)));
            stringBuffer += char;
            i++;
        }
        let returnInfo = {
            stringBuffer: stringBuffer,
            endingIndex: i
        };
        return returnInfo;
    }

    createInt16ArrayBuffer(array: number[]): ArrayBuffer {
        if (array.length % 2 !== 0) {
            throw new Error('Array length must be multiple of two!');
        }
        let arrayBufferView = new Int16Array(array);
        return arrayBufferView.buffer;
    }

    createArrayBufferFromString(source: string): ArrayBuffer {
        let arrayBuffer = new ArrayBuffer(source.length);
        let bufView = new Uint8Array(arrayBuffer);
        for (var i = 0; i < source.length; i < i++) {
            bufView[i] = source.charCodeAt(i);
        }
        return arrayBuffer;
    }

    createChunkedArrayBuffer(jsonObject: any, arrayBuffer: ArrayBuffer): Uint8Array {
        let jsonString = JSON.stringify(jsonObject);
        let jsonStringLength = jsonString.length.toString(16);
        let arrayBufferLength = arrayBuffer.byteLength.toString(16);
        let beginningString = jsonStringLength + '\r\n' + jsonString + '\r\n' + arrayBufferLength + '\r\n';
        let endString = '\r\n0\r\n\r\n';
        let startArrayBuffer = this.createArrayBufferFromString(beginningString);
        let endingArrayBuffer = this.createArrayBufferFromString(endString);
        let temp = new Uint8Array(startArrayBuffer.byteLength + arrayBuffer.byteLength + endingArrayBuffer.byteLength);
        temp.set(new Uint8Array(startArrayBuffer), 0);
        temp.set(new Uint8Array(arrayBuffer), startArrayBuffer.byteLength);
        temp.set(new Uint8Array(endingArrayBuffer), startArrayBuffer.byteLength + arrayBuffer.byteLength);
        //Since we're actually sending the result directly to the transport, return the actual byte array instead of the arrayBuffer which is just a reference.
        return temp;
    }

}