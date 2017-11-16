/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var root_1 = __webpack_require__(2);
var toSubscriber_1 = __webpack_require__(18);
var observable_1 = __webpack_require__(10);
var pipe_1 = __webpack_require__(23);
/**
 * A representation of any set of values over any amount of time. This is the most basic building block
 * of RxJS.
 *
 * @class Observable<T>
 */
var Observable = (function () {
    /**
     * @constructor
     * @param {Function} subscribe the function that is called when the Observable is
     * initially subscribed to. This function is given a Subscriber, to which new values
     * can be `next`ed, or an `error` method can be called to raise an error, or
     * `complete` can be called to notify of a successful completion.
     */
    function Observable(subscribe) {
        this._isScalar = false;
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    /**
     * Creates a new Observable, with this Observable as the source, and the passed
     * operator defined as the new observable's operator.
     * @method lift
     * @param {Operator} operator the operator defining the operation to take on the observable
     * @return {Observable} a new observable with the Operator applied
     */
    Observable.prototype.lift = function (operator) {
        var observable = new Observable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    };
    /**
     * Invokes an execution of an Observable and registers Observer handlers for notifications it will emit.
     *
     * <span class="informal">Use it when you have all these Observables, but still nothing is happening.</span>
     *
     * `subscribe` is not a regular operator, but a method that calls Observable's internal `subscribe` function. It
     * might be for example a function that you passed to a {@link create} static factory, but most of the time it is
     * a library implementation, which defines what and when will be emitted by an Observable. This means that calling
     * `subscribe` is actually the moment when Observable starts its work, not when it is created, as it is often
     * thought.
     *
     * Apart from starting the execution of an Observable, this method allows you to listen for values
     * that an Observable emits, as well as for when it completes or errors. You can achieve this in two
     * following ways.
     *
     * The first way is creating an object that implements {@link Observer} interface. It should have methods
     * defined by that interface, but note that it should be just a regular JavaScript object, which you can create
     * yourself in any way you want (ES6 class, classic function constructor, object literal etc.). In particular do
     * not attempt to use any RxJS implementation details to create Observers - you don't need them. Remember also
     * that your object does not have to implement all methods. If you find yourself creating a method that doesn't
     * do anything, you can simply omit it. Note however, that if `error` method is not provided, all errors will
     * be left uncaught.
     *
     * The second way is to give up on Observer object altogether and simply provide callback functions in place of its methods.
     * This means you can provide three functions as arguments to `subscribe`, where first function is equivalent
     * of a `next` method, second of an `error` method and third of a `complete` method. Just as in case of Observer,
     * if you do not need to listen for something, you can omit a function, preferably by passing `undefined` or `null`,
     * since `subscribe` recognizes these functions by where they were placed in function call. When it comes
     * to `error` function, just as before, if not provided, errors emitted by an Observable will be thrown.
     *
     * Whatever style of calling `subscribe` you use, in both cases it returns a Subscription object.
     * This object allows you to call `unsubscribe` on it, which in turn will stop work that an Observable does and will clean
     * up all resources that an Observable used. Note that cancelling a subscription will not call `complete` callback
     * provided to `subscribe` function, which is reserved for a regular completion signal that comes from an Observable.
     *
     * Remember that callbacks provided to `subscribe` are not guaranteed to be called asynchronously.
     * It is an Observable itself that decides when these functions will be called. For example {@link of}
     * by default emits all its values synchronously. Always check documentation for how given Observable
     * will behave when subscribed and if its default behavior can be modified with a {@link Scheduler}.
     *
     * @example <caption>Subscribe with an Observer</caption>
     * const sumObserver = {
     *   sum: 0,
     *   next(value) {
     *     console.log('Adding: ' + value);
     *     this.sum = this.sum + value;
     *   },
     *   error() { // We actually could just remove this method,
     *   },        // since we do not really care about errors right now.
     *   complete() {
     *     console.log('Sum equals: ' + this.sum);
     *   }
     * };
     *
     * Rx.Observable.of(1, 2, 3) // Synchronously emits 1, 2, 3 and then completes.
     * .subscribe(sumObserver);
     *
     * // Logs:
     * // "Adding: 1"
     * // "Adding: 2"
     * // "Adding: 3"
     * // "Sum equals: 6"
     *
     *
     * @example <caption>Subscribe with functions</caption>
     * let sum = 0;
     *
     * Rx.Observable.of(1, 2, 3)
     * .subscribe(
     *   function(value) {
     *     console.log('Adding: ' + value);
     *     sum = sum + value;
     *   },
     *   undefined,
     *   function() {
     *     console.log('Sum equals: ' + sum);
     *   }
     * );
     *
     * // Logs:
     * // "Adding: 1"
     * // "Adding: 2"
     * // "Adding: 3"
     * // "Sum equals: 6"
     *
     *
     * @example <caption>Cancel a subscription</caption>
     * const subscription = Rx.Observable.interval(1000).subscribe(
     *   num => console.log(num),
     *   undefined,
     *   () => console.log('completed!') // Will not be called, even
     * );                                // when cancelling subscription
     *
     *
     * setTimeout(() => {
     *   subscription.unsubscribe();
     *   console.log('unsubscribed!');
     * }, 2500);
     *
     * // Logs:
     * // 0 after 1s
     * // 1 after 2s
     * // "unsubscribed!" after 2.5s
     *
     *
     * @param {Observer|Function} observerOrNext (optional) Either an observer with methods to be called,
     *  or the first of three possible handlers, which is the handler for each value emitted from the subscribed
     *  Observable.
     * @param {Function} error (optional) A handler for a terminal event resulting from an error. If no error handler is provided,
     *  the error will be thrown as unhandled.
     * @param {Function} complete (optional) A handler for a terminal event resulting from successful completion.
     * @return {ISubscription} a subscription reference to the registered handlers
     * @method subscribe
     */
    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
        var operator = this.operator;
        var sink = toSubscriber_1.toSubscriber(observerOrNext, error, complete);
        if (operator) {
            operator.call(sink, this.source);
        }
        else {
            sink.add(this.source ? this._subscribe(sink) : this._trySubscribe(sink));
        }
        if (sink.syncErrorThrowable) {
            sink.syncErrorThrowable = false;
            if (sink.syncErrorThrown) {
                throw sink.syncErrorValue;
            }
        }
        return sink;
    };
    Observable.prototype._trySubscribe = function (sink) {
        try {
            return this._subscribe(sink);
        }
        catch (err) {
            sink.syncErrorThrown = true;
            sink.syncErrorValue = err;
            sink.error(err);
        }
    };
    /**
     * @method forEach
     * @param {Function} next a handler for each value emitted by the observable
     * @param {PromiseConstructor} [PromiseCtor] a constructor function used to instantiate the Promise
     * @return {Promise} a promise that either resolves on observable completion or
     *  rejects with the handled error
     */
    Observable.prototype.forEach = function (next, PromiseCtor) {
        var _this = this;
        if (!PromiseCtor) {
            if (root_1.root.Rx && root_1.root.Rx.config && root_1.root.Rx.config.Promise) {
                PromiseCtor = root_1.root.Rx.config.Promise;
            }
            else if (root_1.root.Promise) {
                PromiseCtor = root_1.root.Promise;
            }
        }
        if (!PromiseCtor) {
            throw new Error('no Promise impl found');
        }
        return new PromiseCtor(function (resolve, reject) {
            // Must be declared in a separate statement to avoid a RefernceError when
            // accessing subscription below in the closure due to Temporal Dead Zone.
            var subscription;
            subscription = _this.subscribe(function (value) {
                if (subscription) {
                    // if there is a subscription, then we can surmise
                    // the next handling is asynchronous. Any errors thrown
                    // need to be rejected explicitly and unsubscribe must be
                    // called manually
                    try {
                        next(value);
                    }
                    catch (err) {
                        reject(err);
                        subscription.unsubscribe();
                    }
                }
                else {
                    // if there is NO subscription, then we're getting a nexted
                    // value synchronously during subscription. We can just call it.
                    // If it errors, Observable's `subscribe` will ensure the
                    // unsubscription logic is called, then synchronously rethrow the error.
                    // After that, Promise will trap the error and send it
                    // down the rejection path.
                    next(value);
                }
            }, reject, resolve);
        });
    };
    Observable.prototype._subscribe = function (subscriber) {
        return this.source.subscribe(subscriber);
    };
    /**
     * An interop point defined by the es7-observable spec https://github.com/zenparsing/es-observable
     * @method Symbol.observable
     * @return {Observable} this instance of the observable
     */
    Observable.prototype[observable_1.observable] = function () {
        return this;
    };
    /* tslint:enable:max-line-length */
    /**
     * Used to stitch together functional operators into a chain.
     * @method pipe
     * @return {Observable} the Observable result of all of the operators having
     * been called in the order they were passed in.
     *
     * @example
     *
     * import { map, filter, scan } from 'rxjs/operators';
     *
     * Rx.Observable.interval(1000)
     *   .pipe(
     *     filter(x => x % 2 === 0),
     *     map(x => x + x),
     *     scan((acc, x) => acc + x)
     *   )
     *   .subscribe(x => console.log(x))
     */
    Observable.prototype.pipe = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i - 0] = arguments[_i];
        }
        if (operations.length === 0) {
            return this;
        }
        return pipe_1.pipeFromArray(operations)(this);
    };
    /* tslint:enable:max-line-length */
    Observable.prototype.toPromise = function (PromiseCtor) {
        var _this = this;
        if (!PromiseCtor) {
            if (root_1.root.Rx && root_1.root.Rx.config && root_1.root.Rx.config.Promise) {
                PromiseCtor = root_1.root.Rx.config.Promise;
            }
            else if (root_1.root.Promise) {
                PromiseCtor = root_1.root.Promise;
            }
        }
        if (!PromiseCtor) {
            throw new Error('no Promise impl found');
        }
        return new PromiseCtor(function (resolve, reject) {
            var value;
            _this.subscribe(function (x) { return value = x; }, function (err) { return reject(err); }, function () { return resolve(value); });
        });
    };
    // HACK: Since TypeScript inherits static properties too, we have to
    // fight against TypeScript here so Subject can have a different static create signature
    /**
     * Creates a new cold Observable by calling the Observable constructor
     * @static true
     * @owner Observable
     * @method create
     * @param {Function} subscribe? the subscriber function to be passed to the Observable constructor
     * @return {Observable} a new cold observable
     */
    Observable.create = function (subscribe) {
        return new Observable(subscribe);
    };
    return Observable;
}());
exports.Observable = Observable;
//# sourceMappingURL=Observable.js.map

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = __webpack_require__(0);
var GenericInstrument = /** @class */ (function () {
    function GenericInstrument(_transport, _endpoint) {
        this.endpoint = '';
        this.transport = _transport;
        this.endpoint = _endpoint;
    }
    GenericInstrument.prototype._genericResponseHandler = function (commandObject) {
        var _this = this;
        return Observable_1.Observable.create(function (observer) {
            _this.transport.writeRead('/', JSON.stringify(commandObject), 'json').subscribe(function (arrayBuffer) {
                var data;
                try {
                    var stringify = String.fromCharCode.apply(null, new Int8Array(arrayBuffer.slice(0)));
                    console.log(stringify);
                    data = JSON.parse(stringify);
                }
                catch (e) {
                    observer.error(e);
                    return;
                }
                if (data == undefined || data.agent != undefined) {
                    observer.error(data);
                    return;
                }
                for (var instrument in data) {
                    if (instrument === 'log') {
                        for (var chanType in data[instrument]) {
                            for (var channel in data[instrument][chanType]) {
                                if (data[instrument][chanType][channel][0].statusCode > 0) {
                                    observer.error(data);
                                    return;
                                }
                            }
                        }
                    }
                    else {
                        for (var channel in data[instrument]) {
                            if (data[instrument][channel][0].statusCode > 0) {
                                observer.error(data);
                                return;
                            }
                        }
                    }
                }
                observer.next(data);
                //Handle device errors and warnings
                observer.complete();
            }, function (err) {
                observer.error(err);
            }, function () {
                observer.complete();
            });
        });
    };
    return GenericInstrument;
}());
exports.GenericInstrument = GenericInstrument;
//# sourceMappingURL=generic-instrument.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
// CommonJS / Node have global context exposed as "global" variable.
// We don't want to include the whole node.d.ts this this compilation unit so we'll just fake
// the global "global" var for now.
var __window = typeof window !== 'undefined' && window;
var __self = typeof self !== 'undefined' && typeof WorkerGlobalScope !== 'undefined' &&
    self instanceof WorkerGlobalScope && self;
var __global = typeof global !== 'undefined' && global;
var _root = __window || __global || __self;
exports.root = _root;
// Workaround Closure Compiler restriction: The body of a goog.module cannot use throw.
// This is needed when used with angular/tsickle which inserts a goog.module statement.
// Wrap in IIFE
(function () {
    if (!_root) {
        throw new Error('RxJS could not find any global context (window, self, global)');
    }
})();
//# sourceMappingURL=root.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(17)))

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = __webpack_require__(0);
var CommandUtility = /** @class */ (function () {
    function CommandUtility() {
    }
    CommandUtility.prototype.parseChunkedTransfer = function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var firstChar = String.fromCharCode.apply(null, new Uint8Array(data.slice(0, 1)));
            if (isNaN(parseInt(firstChar, 16))) {
                reject({
                    message: 'json or bad packet',
                    payload: data
                });
                return;
            }
            var chunkGuardLength = 100;
            var currentReadIndex = 0;
            var chunkLength;
            var chunkInfo = _this._findNewLineChar(chunkGuardLength, data, currentReadIndex);
            chunkLength = _this._getChunkLength(chunkInfo.stringBuffer);
            currentReadIndex = chunkInfo.endingIndex;
            var jsonPortion;
            try {
                jsonPortion = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(data.slice(currentReadIndex, currentReadIndex + chunkLength + 2))));
            }
            catch (e) {
                reject(e);
                return;
            }
            currentReadIndex = currentReadIndex + chunkLength + 2;
            chunkInfo = _this._findNewLineChar(chunkGuardLength, data, currentReadIndex);
            chunkLength = _this._getChunkLength(chunkInfo.stringBuffer);
            currentReadIndex = chunkInfo.endingIndex;
            var binaryDataSlice = data.slice(currentReadIndex, currentReadIndex + chunkLength);
            if (binaryDataSlice.byteLength !== chunkLength) {
                console.warn(new Uint8Array(data));
                reject('corrupt transfer');
                return;
            }
            var typedArray;
            try {
                typedArray = new Int16Array(binaryDataSlice);
            }
            catch (e) {
                reject(e);
                return;
            }
            resolve({
                json: jsonPortion,
                typedArray: typedArray
            });
        });
    };
    CommandUtility.prototype.observableParseChunkedTransfer = function (data, typedArrayFormat) {
        var _this = this;
        typedArrayFormat = typedArrayFormat == undefined ? 'i16' : typedArrayFormat;
        return Observable_1.Observable.create(function (observer) {
            var firstChar = String.fromCharCode.apply(null, new Uint8Array(data.slice(0, 1)));
            if (isNaN(parseInt(firstChar, 16))) {
                observer.error({
                    message: 'json or bad packet',
                    payload: data
                });
                return;
            }
            var chunkGuardLength = 100;
            var currentReadIndex = 0;
            var chunkLength;
            var chunkInfo = _this._findNewLineChar(chunkGuardLength, data, currentReadIndex);
            chunkLength = _this._getChunkLength(chunkInfo.stringBuffer);
            currentReadIndex = chunkInfo.endingIndex;
            var jsonPortion;
            try {
                jsonPortion = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(data.slice(currentReadIndex, currentReadIndex + chunkLength + 2))));
            }
            catch (e) {
                observer.error(e);
                return;
            }
            currentReadIndex = currentReadIndex + chunkLength + 2;
            chunkInfo = _this._findNewLineChar(chunkGuardLength, data, currentReadIndex);
            chunkLength = _this._getChunkLength(chunkInfo.stringBuffer);
            currentReadIndex = chunkInfo.endingIndex;
            var binaryDataSlice = data.slice(currentReadIndex, currentReadIndex + chunkLength);
            if (binaryDataSlice.byteLength !== chunkLength) {
                console.warn(new Uint8Array(data));
                observer.error('corrupt transfer');
                return;
            }
            var typedArray;
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
            catch (e) {
                observer.error(e);
                return;
            }
            observer.next({
                json: jsonPortion,
                typedArray: typedArray
            });
            observer.complete();
        });
    };
    CommandUtility.prototype._getChunkLength = function (chunkString) {
        return parseInt(chunkString, 16);
    };
    CommandUtility.prototype._findNewLineChar = function (maxLength, data, startIndex) {
        var char = '';
        var i = startIndex;
        maxLength = maxLength + i;
        var stringBuffer = '';
        while (i < maxLength && char !== '\n') {
            char = String.fromCharCode.apply(null, new Int8Array(data.slice(i, i + 1)));
            stringBuffer += char;
            i++;
        }
        var returnInfo = {
            stringBuffer: stringBuffer,
            endingIndex: i
        };
        return returnInfo;
    };
    CommandUtility.prototype.createInt16ArrayBuffer = function (array) {
        if (array.length % 2 !== 0) {
            throw new Error('Array length must be multiple of two!');
        }
        var arrayBufferView = new Int16Array(array);
        return arrayBufferView.buffer;
    };
    CommandUtility.prototype.createArrayBufferFromString = function (source) {
        var arrayBuffer = new ArrayBuffer(source.length);
        var bufView = new Uint8Array(arrayBuffer);
        for (var i = 0; i < source.length; i < i++) {
            bufView[i] = source.charCodeAt(i);
        }
        return arrayBuffer;
    };
    CommandUtility.prototype.createChunkedArrayBuffer = function (jsonObject, arrayBuffer) {
        var jsonString = JSON.stringify(jsonObject);
        var jsonStringLength = jsonString.length.toString(16);
        var arrayBufferLength = arrayBuffer.byteLength.toString(16);
        var beginningString = jsonStringLength + '\r\n' + jsonString + '\r\n' + arrayBufferLength + '\r\n';
        var endString = '\r\n0\r\n\r\n';
        var startArrayBuffer = this.createArrayBufferFromString(beginningString);
        var endingArrayBuffer = this.createArrayBufferFromString(endString);
        var temp = new Uint8Array(startArrayBuffer.byteLength + arrayBuffer.byteLength + endingArrayBuffer.byteLength);
        temp.set(new Uint8Array(startArrayBuffer), 0);
        temp.set(new Uint8Array(arrayBuffer), startArrayBuffer.byteLength);
        temp.set(new Uint8Array(endingArrayBuffer), startArrayBuffer.byteLength + arrayBuffer.byteLength);
        //Since we're actually sending the result directly to the transport, return the actual byte array instead of the arrayBuffer which is just a reference.
        return temp;
    };
    return CommandUtility;
}());
exports.CommandUtility = CommandUtility;
//# sourceMappingURL=command-utility.js.map

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var isFunction_1 = __webpack_require__(5);
var Subscription_1 = __webpack_require__(19);
var Observer_1 = __webpack_require__(8);
var rxSubscriber_1 = __webpack_require__(9);
/**
 * Implements the {@link Observer} interface and extends the
 * {@link Subscription} class. While the {@link Observer} is the public API for
 * consuming the values of an {@link Observable}, all Observers get converted to
 * a Subscriber, in order to provide Subscription-like capabilities such as
 * `unsubscribe`. Subscriber is a common type in RxJS, and crucial for
 * implementing operators, but it is rarely used as a public API.
 *
 * @class Subscriber<T>
 */
var Subscriber = (function (_super) {
    __extends(Subscriber, _super);
    /**
     * @param {Observer|function(value: T): void} [destinationOrNext] A partially
     * defined Observer or a `next` callback function.
     * @param {function(e: ?any): void} [error] The `error` callback of an
     * Observer.
     * @param {function(): void} [complete] The `complete` callback of an
     * Observer.
     */
    function Subscriber(destinationOrNext, error, complete) {
        _super.call(this);
        this.syncErrorValue = null;
        this.syncErrorThrown = false;
        this.syncErrorThrowable = false;
        this.isStopped = false;
        switch (arguments.length) {
            case 0:
                this.destination = Observer_1.empty;
                break;
            case 1:
                if (!destinationOrNext) {
                    this.destination = Observer_1.empty;
                    break;
                }
                if (typeof destinationOrNext === 'object') {
                    if (destinationOrNext instanceof Subscriber) {
                        this.destination = destinationOrNext;
                        this.destination.add(this);
                    }
                    else {
                        this.syncErrorThrowable = true;
                        this.destination = new SafeSubscriber(this, destinationOrNext);
                    }
                    break;
                }
            default:
                this.syncErrorThrowable = true;
                this.destination = new SafeSubscriber(this, destinationOrNext, error, complete);
                break;
        }
    }
    Subscriber.prototype[rxSubscriber_1.rxSubscriber] = function () { return this; };
    /**
     * A static factory for a Subscriber, given a (potentially partial) definition
     * of an Observer.
     * @param {function(x: ?T): void} [next] The `next` callback of an Observer.
     * @param {function(e: ?any): void} [error] The `error` callback of an
     * Observer.
     * @param {function(): void} [complete] The `complete` callback of an
     * Observer.
     * @return {Subscriber<T>} A Subscriber wrapping the (partially defined)
     * Observer represented by the given arguments.
     */
    Subscriber.create = function (next, error, complete) {
        var subscriber = new Subscriber(next, error, complete);
        subscriber.syncErrorThrowable = false;
        return subscriber;
    };
    /**
     * The {@link Observer} callback to receive notifications of type `next` from
     * the Observable, with a value. The Observable may call this method 0 or more
     * times.
     * @param {T} [value] The `next` value.
     * @return {void}
     */
    Subscriber.prototype.next = function (value) {
        if (!this.isStopped) {
            this._next(value);
        }
    };
    /**
     * The {@link Observer} callback to receive notifications of type `error` from
     * the Observable, with an attached {@link Error}. Notifies the Observer that
     * the Observable has experienced an error condition.
     * @param {any} [err] The `error` exception.
     * @return {void}
     */
    Subscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            this.isStopped = true;
            this._error(err);
        }
    };
    /**
     * The {@link Observer} callback to receive a valueless notification of type
     * `complete` from the Observable. Notifies the Observer that the Observable
     * has finished sending push-based notifications.
     * @return {void}
     */
    Subscriber.prototype.complete = function () {
        if (!this.isStopped) {
            this.isStopped = true;
            this._complete();
        }
    };
    Subscriber.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.isStopped = true;
        _super.prototype.unsubscribe.call(this);
    };
    Subscriber.prototype._next = function (value) {
        this.destination.next(value);
    };
    Subscriber.prototype._error = function (err) {
        this.destination.error(err);
        this.unsubscribe();
    };
    Subscriber.prototype._complete = function () {
        this.destination.complete();
        this.unsubscribe();
    };
    Subscriber.prototype._unsubscribeAndRecycle = function () {
        var _a = this, _parent = _a._parent, _parents = _a._parents;
        this._parent = null;
        this._parents = null;
        this.unsubscribe();
        this.closed = false;
        this.isStopped = false;
        this._parent = _parent;
        this._parents = _parents;
        return this;
    };
    return Subscriber;
}(Subscription_1.Subscription));
exports.Subscriber = Subscriber;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SafeSubscriber = (function (_super) {
    __extends(SafeSubscriber, _super);
    function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
        _super.call(this);
        this._parentSubscriber = _parentSubscriber;
        var next;
        var context = this;
        if (isFunction_1.isFunction(observerOrNext)) {
            next = observerOrNext;
        }
        else if (observerOrNext) {
            next = observerOrNext.next;
            error = observerOrNext.error;
            complete = observerOrNext.complete;
            if (observerOrNext !== Observer_1.empty) {
                context = Object.create(observerOrNext);
                if (isFunction_1.isFunction(context.unsubscribe)) {
                    this.add(context.unsubscribe.bind(context));
                }
                context.unsubscribe = this.unsubscribe.bind(this);
            }
        }
        this._context = context;
        this._next = next;
        this._error = error;
        this._complete = complete;
    }
    SafeSubscriber.prototype.next = function (value) {
        if (!this.isStopped && this._next) {
            var _parentSubscriber = this._parentSubscriber;
            if (!_parentSubscriber.syncErrorThrowable) {
                this.__tryOrUnsub(this._next, value);
            }
            else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            if (this._error) {
                if (!_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(this._error, err);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, this._error, err);
                    this.unsubscribe();
                }
            }
            else if (!_parentSubscriber.syncErrorThrowable) {
                this.unsubscribe();
                throw err;
            }
            else {
                _parentSubscriber.syncErrorValue = err;
                _parentSubscriber.syncErrorThrown = true;
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.complete = function () {
        var _this = this;
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            if (this._complete) {
                var wrappedComplete = function () { return _this._complete.call(_this._context); };
                if (!_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(wrappedComplete);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, wrappedComplete);
                    this.unsubscribe();
                }
            }
            else {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            this.unsubscribe();
            throw err;
        }
    };
    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            parent.syncErrorValue = err;
            parent.syncErrorThrown = true;
            return true;
        }
        return false;
    };
    SafeSubscriber.prototype._unsubscribe = function () {
        var _parentSubscriber = this._parentSubscriber;
        this._context = null;
        this._parentSubscriber = null;
        _parentSubscriber.unsubscribe();
    };
    return SafeSubscriber;
}(Subscriber));
//# sourceMappingURL=Subscriber.js.map

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function isFunction(x) {
    return typeof x === 'function';
}
exports.isFunction = isFunction;
//# sourceMappingURL=isFunction.js.map

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function isObject(x) {
    return x != null && typeof x === 'object';
}
exports.isObject = isObject;
//# sourceMappingURL=isObject.js.map

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// typeof any so that it we don't have to cast when comparing a result to the error object
exports.errorObject = { e: {} };
//# sourceMappingURL=errorObject.js.map

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.empty = {
    closed: true,
    next: function (value) { },
    error: function (err) { throw err; },
    complete: function () { }
};
//# sourceMappingURL=Observer.js.map

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var root_1 = __webpack_require__(2);
var Symbol = root_1.root.Symbol;
exports.rxSubscriber = (typeof Symbol === 'function' && typeof Symbol.for === 'function') ?
    Symbol.for('rxSubscriber') : '@@rxSubscriber';
/**
 * @deprecated use rxSubscriber instead
 */
exports.$$rxSubscriber = exports.rxSubscriber;
//# sourceMappingURL=rxSubscriber.js.map

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var root_1 = __webpack_require__(2);
function getSymbolObservable(context) {
    var $$observable;
    var Symbol = context.Symbol;
    if (typeof Symbol === 'function') {
        if (Symbol.observable) {
            $$observable = Symbol.observable;
        }
        else {
            $$observable = Symbol('observable');
            Symbol.observable = $$observable;
        }
    }
    else {
        $$observable = '@@observable';
    }
    return $$observable;
}
exports.getSymbolObservable = getSymbolObservable;
exports.observable = getSymbolObservable(root_1.root);
/**
 * @deprecated use observable instead
 */
exports.$$observable = exports.observable;
//# sourceMappingURL=observable.js.map

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Waveform = /** @class */ (function () {
    function Waveform(waveformDescriptor) {
        this.pointOfInterest = 0;
        this.triggerPosition = 0;
        this.seriesOffset = 0;
        this.triggerDelay = 0;
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
    return Waveform;
}());
exports.Waveform = Waveform;
//# sourceMappingURL=waveform.js.map

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = __webpack_require__(0);
__webpack_require__(39);
var command_utility_1 = __webpack_require__(3);
var LoggerCommand = /** @class */ (function () {
    function LoggerCommand(_loggerInstrumentRef) {
        this.instrumentRef = _loggerInstrumentRef;
        this.commandUtility = new command_utility_1.CommandUtility();
    }
    LoggerCommand.prototype.analogSetParametersJson = function (chans, maxSampleCounts, gains, vOffsets, sampleFreqs, startDelays, overflows, storageLocations, uris) {
        var command = {
            "log": {
                "analog": {}
            }
        };
        chans.forEach(function (element, index, array) {
            command.log.analog[chans[index]] =
                [
                    {
                        "command": "setParameters",
                        "maxSampleCount": maxSampleCounts[index],
                        "gain": gains[index],
                        "vOffset": Math.round(vOffsets[index] * 1000),
                        "sampleFreq": Math.round(sampleFreqs[index] * 1000000),
                        "startDelay": Math.round(startDelays[index] * Math.pow(10, 12)),
                        "overflow": overflows[index],
                        "storageLocation": storageLocations[index],
                        "uri": uris[index]
                    }
                ];
        });
        return command;
    };
    LoggerCommand.prototype.analogSetParametersParse = function (chan, responseObject) {
        return 'Channel ' + chan + ' ' + responseObject.command + ' successful';
    };
    LoggerCommand.prototype.digitalSetParametersParse = function (chan, responseObject) {
        return 'Channel ' + chan + ' ' + responseObject.command + ' successful';
    };
    LoggerCommand.prototype.runParse = function (chan, responseObject) {
        return 'Channel ' + chan + ' ' + responseObject.command + ' successful';
    };
    LoggerCommand.prototype.stopParse = function (chan, responseObject) {
        return 'Channel ' + chan + ' ' + responseObject.command + ' successful';
    };
    LoggerCommand.prototype.digitalSetParametersJson = function (chans, maxSampleCounts, sampleFreqs, startDelays, overflows, storageLocations, uris, bitMasks) {
        var command = {
            "log": {
                "digital": {}
            }
        };
        chans.forEach(function (element, index, array) {
            command.log.digital[chans[index]] =
                [
                    {
                        "command": "setParameters",
                        "bitMask": bitMasks[index],
                        "maxSampleCount": maxSampleCounts[index],
                        "sampleFreq": Math.round(sampleFreqs[index] * 1000000),
                        "startDelay": Math.round(startDelays[index] * Math.pow(10, 12)),
                        "overflow": overflows[index],
                        "storageLocation": storageLocations[index],
                        "uri": uris[index]
                    }
                ];
        });
        return command;
    };
    LoggerCommand.prototype.runJson = function (instrument, chans) {
        var command = {
            "log": {}
        };
        command.log[instrument] = {};
        chans.forEach(function (element, index, array) {
            command.log[instrument][chans[index]] =
                [
                    {
                        command: "run"
                    }
                ];
        });
        return command;
    };
    LoggerCommand.prototype.stopJson = function (instrument, chans) {
        var command = {
            "log": {}
        };
        command.log[instrument] = {};
        chans.forEach(function (element, index, array) {
            command.log[instrument][chans[index]] =
                [
                    {
                        command: "stop"
                    }
                ];
        });
        return command;
    };
    LoggerCommand.prototype.readJson = function (instrument, chans, startIndices, counts) {
        var command = {
            "log": {}
        };
        command.log[instrument] = {};
        chans.forEach(function (element, index, array) {
            command.log[instrument][chans[index]] =
                [
                    {
                        command: "read",
                        startIndex: startIndices[index],
                        count: counts[index]
                    }
                ];
        });
        return command;
    };
    LoggerCommand.prototype.getCurrentStateJson = function (instrument, chans) {
        var command = {
            "log": {}
        };
        command.log[instrument] = {};
        chans.forEach(function (element, index, array) {
            command.log[instrument][chans[index]] =
                [
                    {
                        command: "getCurrentState"
                    }
                ];
        });
        return command;
    };
    LoggerCommand.prototype.analogSetParameters = function (chans, maxSampleCounts, gains, vOffsets, sampleFreqs, startDelays, overflows, storageLocations, uris) {
        var command = this.analogSetParametersJson(chans, maxSampleCounts, gains, vOffsets, sampleFreqs, startDelays, overflows, storageLocations, uris);
        return this.instrumentRef._genericResponseHandler(command);
    };
    LoggerCommand.prototype.digitalSetParameters = function (chans, maxSampleCounts, sampleFreqs, startDelays, overflows, storageLocations, uris, bitMasks) {
        var command = this.digitalSetParametersJson(chans, maxSampleCounts, sampleFreqs, startDelays, overflows, storageLocations, uris, bitMasks);
        return this.instrumentRef._genericResponseHandler(command);
    };
    LoggerCommand.prototype.run = function (instrument, chans) {
        var command = this.runJson(instrument, chans);
        return this.instrumentRef._genericResponseHandler(command);
    };
    LoggerCommand.prototype.stop = function (instrument, chans) {
        var command = this.stopJson(instrument, chans);
        return this.instrumentRef._genericResponseHandler(command);
    };
    LoggerCommand.prototype.read = function (instrument, chans, startIndices, counts) {
        var _this = this;
        var command = this.readJson(instrument, chans, startIndices, counts);
        return Observable_1.Observable.create(function (observer) {
            _this.instrumentRef.transport.writeRead('/', JSON.stringify(command), 'binary')
                .flatMap(function (data) {
                return _this.commandUtility.observableParseChunkedTransfer(data);
            })
                .subscribe(function (data) {
                var returnObject = {
                    cmdRespObj: data.json,
                    instruments: {}
                };
                var command = data.json;
                console.log(command);
                for (var instrument_1 in command.log) {
                    returnObject.instruments[instrument_1] = {};
                    for (var channel in command.log[instrument_1]) {
                        returnObject.instruments[instrument_1][channel] = {};
                        if (command.log[instrument_1][channel][0].statusCode > 0) {
                            observer.error('StatusCode error: ' + instrument_1 + ' Ch ' + channel);
                            return;
                        }
                        if (command.log[instrument_1][channel][0].binaryLength === 0) {
                            observer.error('No data received on ' + instrument_1 + ' Ch ' + channel);
                            return;
                        }
                        var binaryOffset = command.log[instrument_1][channel][0].binaryOffset / 2;
                        var binaryData = data.typedArray.slice(binaryOffset, binaryOffset + command.log[instrument_1][channel][0].binaryLength / 2);
                        var untypedArray = Array.prototype.slice.call(binaryData);
                        var scaledArray = untypedArray.map(function (voltage) {
                            return voltage / 1000;
                        });
                        Object.assign(returnObject.instruments[instrument_1][channel], command.log[instrument_1][channel][0]);
                        returnObject.instruments[instrument_1][channel]['data'] = scaledArray;
                    }
                }
                observer.next(returnObject);
                observer.complete();
            }, function (err) {
                console.log(err);
                observer.error(err);
            }, function () { });
        });
    };
    LoggerCommand.prototype.getCurrentState = function (instrument, chans) {
        var command = this.getCurrentStateJson(instrument, chans);
        return this.instrumentRef._genericResponseHandler(command);
    };
    return LoggerCommand;
}());
exports.LoggerCommand = LoggerCommand;
//# sourceMappingURL=logger-command.js.map

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var http_transport_1 = __webpack_require__(51);
var local_transport_1 = __webpack_require__(52);
var TransportContainer = /** @class */ (function () {
    function TransportContainer(_uri, httpTimeout) {
        this.transport = new http_transport_1.HttpTransport(_uri, httpTimeout);
        this.httpTimeout = httpTimeout;
    }
    //Set transport uri
    TransportContainer.prototype.setUri = function (uri) {
        this.transport.setUri(uri);
    };
    TransportContainer.prototype.getUri = function () {
        return this.transport.getUri();
    };
    //Get request on the specified url
    TransportContainer.prototype.getRequest = function (requestUrl, timeout) {
        return this.transport.getRequest(requestUrl, timeout);
    };
    //Call writeRead on transport component
    TransportContainer.prototype.writeRead = function (endpoint, sendData, dataType, timeoutOverride) {
        return this.transport.writeRead(endpoint, sendData, dataType, timeoutOverride);
    };
    //Call streamFrom on stransport component
    TransportContainer.prototype.streamFrom = function (endpoint, sendData, dataType, delay) {
        if (delay === void 0) { delay = 0; }
        return this.transport.streamFrom(endpoint, sendData, dataType, delay);
    };
    //Stop all transport streams
    TransportContainer.prototype.stopStream = function () {
        this.transport.stopStream();
    };
    //Get type of transport service
    TransportContainer.prototype.getType = function () {
        return this.transport.getType();
    };
    TransportContainer.prototype.setHttpTransport = function (uri) {
        delete this.transport;
        this.transport = new http_transport_1.HttpTransport(uri, this.httpTimeout);
    };
    TransportContainer.prototype.setLocalTransport = function (deviceEnumeration) {
        delete this.transport;
        this.transport = new local_transport_1.LocalTransport(deviceEnumeration);
    };
    TransportContainer.prototype.setHttpTimeout = function (newHttpTimeout) {
        this.httpTimeout = newHttpTimeout;
        this.transport.setTimeout(newHttpTimeout);
    };
    return TransportContainer;
}());
exports.TransportContainer = TransportContainer;
//# sourceMappingURL=transport-container.js.map

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var GenericTransport = /** @class */ (function () {
    function GenericTransport() {
    }
    //Update the URI used by the transport
    GenericTransport.prototype.setUri = function (_rootUri) {
        this.rootUri = _rootUri;
    };
    GenericTransport.prototype.getUri = function () {
        return this.rootUri;
    };
    //Get type of transport component (parent)
    GenericTransport.prototype.getType = function () {
        return 'Parent';
    };
    return GenericTransport;
}());
exports.GenericTransport = GenericTransport;
//# sourceMappingURL=generic-transport.js.map

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dist_device_device_manager__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dist_device_device_manager___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__dist_device_device_manager__);

window.DeviceManager = __WEBPACK_IMPORTED_MODULE_0__dist_device_device_manager__["DeviceManager"];

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = __webpack_require__(0);
var device_1 = __webpack_require__(25);
var transport_container_1 = __webpack_require__(13);
var DeviceManager = /** @class */ (function () {
    function DeviceManager() {
        this.devices = [];
        this.httpTimeout = 5000;
        this.transport = new transport_container_1.TransportContainer(null, this.httpTimeout);
    }
    DeviceManager.prototype.setHttpTimeout = function (newTimeout) {
        this.httpTimeout = newTimeout;
        this.transport.setHttpTimeout(newTimeout);
        for (var i = 0; i < this.devices.length; i++) {
            this.devices[i].transport.setHttpTimeout(newTimeout);
        }
    };
    DeviceManager.prototype.getHttpTimeout = function () {
        return this.httpTimeout;
    };
    //Connect to device and send enumerate command
    DeviceManager.prototype.connect = function (uri) {
        var _this = this;
        return Observable_1.Observable.create(function (observer) {
            _this.transport.setHttpTransport(uri);
            var command = {
                'device': [
                    {
                        command: 'enumerate'
                    }
                ]
            };
            _this.transport.writeRead('/', JSON.stringify(command), 'json').subscribe(function (deviceDescriptor) {
                var response;
                try {
                    response = JSON.parse(String.fromCharCode.apply(null, new Int8Array(deviceDescriptor.slice(0))));
                }
                catch (error) {
                    observer.error(error);
                    return;
                }
                if (response.device == undefined || response.device[0] == undefined) {
                    observer.error(response);
                    return;
                }
                observer.next(response);
                observer.complete();
            }, function (err) {
                observer.error(err);
            }, function () {
                observer.complete();
            });
        });
    };
    DeviceManager.prototype.connectBridge = function (uri) {
        var _this = this;
        return Observable_1.Observable.create(function (observer) {
            _this.transport.setHttpTransport(uri);
            var command = {
                "agent": [
                    {
                        "command": "enumerateDevices"
                    }
                ]
            };
            _this.transport.writeRead('/config', JSON.stringify(command), 'json').subscribe(function (data) {
                var response;
                try {
                    response = JSON.parse(String.fromCharCode.apply(null, new Int8Array(data.slice(0))));
                }
                catch (error) {
                    observer.error(error);
                }
                observer.next(response);
                observer.complete();
            }, function (err) {
                observer.error(err);
            }, function () {
                observer.complete();
            });
        });
    };
    DeviceManager.prototype.connectLocal = function (deviceName) {
        var _this = this;
        return Observable_1.Observable.create(function (observer) {
            if (deviceName === 'OpenScope MZ') {
                var XHR = new XMLHttpRequest();
                // We define what will happen if the data are successfully sent
                XHR.addEventListener("load", function (event) {
                    var enumerationObject;
                    try {
                        enumerationObject = JSON.parse(event.currentTarget.response);
                    }
                    catch (e) {
                        observer.error(e);
                        return;
                    }
                    this.transport.setLocalTransport(enumerationObject);
                    var command = {
                        'device': [
                            {
                                command: 'enumerate'
                            }
                        ]
                    };
                    this.transport.writeRead('/', JSON.stringify(command), 'json').subscribe(function (deviceDescriptor) {
                        var response = JSON.parse(String.fromCharCode.apply(null, new Int8Array(deviceDescriptor.slice(0))));
                        observer.next(response);
                        observer.complete();
                    }, function (err) {
                        observer.error(err);
                    }, function () {
                        observer.complete();
                    });
                }.bind(_this));
                // We define what will happen in case of error
                XHR.addEventListener("error", function (event) {
                    observer.error('TX Error: ', event);
                });
                // We set up our request
                XHR.open("GET", 'assets/devices/openscope-mz/descriptor.json');
                XHR.send();
            }
        });
    };
    //Return active device
    DeviceManager.prototype.getActiveDevice = function () {
        return this.devices[this.activeDeviceIndex];
    };
    //Sets active device
    DeviceManager.prototype.setActiveDevice = function (_activeDeviceIndex) {
        this.activeDeviceIndex = _activeDeviceIndex;
    };
    DeviceManager.prototype.addDeviceFromDescriptor = function (uri, deviceDescriptor) {
        var deviceExistCheck = this.deviceExists(uri, deviceDescriptor);
        if (deviceExistCheck !== -1) {
            this.activeDeviceIndex = deviceExistCheck;
            return;
        }
        var dev = new device_1.Device(uri, deviceDescriptor.device[0], this.httpTimeout);
        this.activeDeviceIndex = this.devices.push(dev) - 1;
    };
    DeviceManager.prototype.deviceExists = function (uri, deviceDescriptor) {
        var descriptorString = JSON.stringify(deviceDescriptor.device[0]);
        for (var i = 0; i < this.devices.length; i++) {
            if (JSON.stringify(this.devices[i].descriptorObject) === descriptorString && this.devices[i].rootUri === uri) {
                console.log('device exists!');
                return i;
            }
        }
        return -1;
    };
    DeviceManager.prototype.xmlToJson = function (data) {
        var parser = new DOMParser();
        var xmlDoc;
        var contents;
        try {
            xmlDoc = parser.parseFromString(data, "text/xml");
            contents = xmlDoc.getElementsByTagName("Contents");
        }
        catch (e) {
            return e;
        }
        var returnArray = [];
        for (var i = 0; i < contents.length; i++) {
            returnArray.push({});
            for (var j = 0; j < contents[i].childNodes.length; j++) {
                try {
                    returnArray[i][contents[i].childNodes[j].tagName] = contents[i].childNodes[j].textContent;
                }
                catch (e) {
                    return e;
                }
            }
        }
        var arrayToSort = [];
        for (var i = 0; i < returnArray.length; i++) {
            var splitArray = returnArray[i].Key.split('.');
            if (splitArray[splitArray.length - 1] !== 'hex') {
                continue;
            }
            var patch = splitArray[splitArray.length - 2];
            var minor = splitArray[splitArray.length - 3];
            var major = splitArray[splitArray.length - 4].slice(-1);
            var versionNum = major + '.' + minor + '.' + patch;
            arrayToSort.push(versionNum);
        }
        arrayToSort.sort(function (a, b) {
            var aSplit = a.split('.');
            var bSplit = b.split('.');
            var aPriority = parseInt(aSplit[0]) * 1000000 + parseInt(aSplit[1]) * 1000 + parseInt(aSplit[2]);
            var bPriority = parseInt(bSplit[0]) * 1000000 + parseInt(bSplit[1]) * 1000 + parseInt(bSplit[2]);
            return aPriority - bPriority;
        });
        return arrayToSort;
    };
    DeviceManager.prototype.getLatestFirmwareVersionFromArray = function (firmwareVersionsArray) {
        firmwareVersionsArray.sort(function (a, b) {
            var aSplit = a.split('.');
            var bSplit = b.split('.');
            var aPriority = parseInt(aSplit[0]) * 1000000 + parseInt(aSplit[1]) * 1000 + parseInt(aSplit[2]);
            var bPriority = parseInt(bSplit[0]) * 1000000 + parseInt(bSplit[1]) * 1000 + parseInt(bSplit[2]);
            return bPriority - aPriority;
        });
        return firmwareVersionsArray[0];
    };
    DeviceManager.prototype.getLatestFirmwareVersionFromUrl = function (firmwareUrl) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getFirmwareVersionsFromUrl(firmwareUrl).then(function (firmwareVersionsArray) {
                resolve(_this.getLatestFirmwareVersionFromArray(firmwareVersionsArray));
            }).catch(function (e) {
                reject(e);
            });
        });
    };
    DeviceManager.prototype.getFirmwareVersionsFromUrl = function (firmwareUrl) {
        var _this = this;
        this.transport.setHttpTransport(this.transport.getUri());
        return new Promise(function (resolve, reject) {
            _this.transport.getRequest(firmwareUrl).subscribe(function (data) {
                if (data.indexOf('xml') === -1) {
                    reject('Error');
                }
                resolve(_this.xmlToJson(data));
            }, function (err) {
                reject(err);
            }, function () { });
        });
    };
    return DeviceManager;
}());
exports.DeviceManager = DeviceManager;
//# sourceMappingURL=device-manager.js.map

/***/ }),
/* 17 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Subscriber_1 = __webpack_require__(4);
var rxSubscriber_1 = __webpack_require__(9);
var Observer_1 = __webpack_require__(8);
function toSubscriber(nextOrObserver, error, complete) {
    if (nextOrObserver) {
        if (nextOrObserver instanceof Subscriber_1.Subscriber) {
            return nextOrObserver;
        }
        if (nextOrObserver[rxSubscriber_1.rxSubscriber]) {
            return nextOrObserver[rxSubscriber_1.rxSubscriber]();
        }
    }
    if (!nextOrObserver && !error && !complete) {
        return new Subscriber_1.Subscriber(Observer_1.empty);
    }
    return new Subscriber_1.Subscriber(nextOrObserver, error, complete);
}
exports.toSubscriber = toSubscriber;
//# sourceMappingURL=toSubscriber.js.map

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isArray_1 = __webpack_require__(20);
var isObject_1 = __webpack_require__(6);
var isFunction_1 = __webpack_require__(5);
var tryCatch_1 = __webpack_require__(21);
var errorObject_1 = __webpack_require__(7);
var UnsubscriptionError_1 = __webpack_require__(22);
/**
 * Represents a disposable resource, such as the execution of an Observable. A
 * Subscription has one important method, `unsubscribe`, that takes no argument
 * and just disposes the resource held by the subscription.
 *
 * Additionally, subscriptions may be grouped together through the `add()`
 * method, which will attach a child Subscription to the current Subscription.
 * When a Subscription is unsubscribed, all its children (and its grandchildren)
 * will be unsubscribed as well.
 *
 * @class Subscription
 */
var Subscription = (function () {
    /**
     * @param {function(): void} [unsubscribe] A function describing how to
     * perform the disposal of resources when the `unsubscribe` method is called.
     */
    function Subscription(unsubscribe) {
        /**
         * A flag to indicate whether this Subscription has already been unsubscribed.
         * @type {boolean}
         */
        this.closed = false;
        this._parent = null;
        this._parents = null;
        this._subscriptions = null;
        if (unsubscribe) {
            this._unsubscribe = unsubscribe;
        }
    }
    /**
     * Disposes the resources held by the subscription. May, for instance, cancel
     * an ongoing Observable execution or cancel any other type of work that
     * started when the Subscription was created.
     * @return {void}
     */
    Subscription.prototype.unsubscribe = function () {
        var hasErrors = false;
        var errors;
        if (this.closed) {
            return;
        }
        var _a = this, _parent = _a._parent, _parents = _a._parents, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
        this.closed = true;
        this._parent = null;
        this._parents = null;
        // null out _subscriptions first so any child subscriptions that attempt
        // to remove themselves from this subscription will noop
        this._subscriptions = null;
        var index = -1;
        var len = _parents ? _parents.length : 0;
        // if this._parent is null, then so is this._parents, and we
        // don't have to remove ourselves from any parent subscriptions.
        while (_parent) {
            _parent.remove(this);
            // if this._parents is null or index >= len,
            // then _parent is set to null, and the loop exits
            _parent = ++index < len && _parents[index] || null;
        }
        if (isFunction_1.isFunction(_unsubscribe)) {
            var trial = tryCatch_1.tryCatch(_unsubscribe).call(this);
            if (trial === errorObject_1.errorObject) {
                hasErrors = true;
                errors = errors || (errorObject_1.errorObject.e instanceof UnsubscriptionError_1.UnsubscriptionError ?
                    flattenUnsubscriptionErrors(errorObject_1.errorObject.e.errors) : [errorObject_1.errorObject.e]);
            }
        }
        if (isArray_1.isArray(_subscriptions)) {
            index = -1;
            len = _subscriptions.length;
            while (++index < len) {
                var sub = _subscriptions[index];
                if (isObject_1.isObject(sub)) {
                    var trial = tryCatch_1.tryCatch(sub.unsubscribe).call(sub);
                    if (trial === errorObject_1.errorObject) {
                        hasErrors = true;
                        errors = errors || [];
                        var err = errorObject_1.errorObject.e;
                        if (err instanceof UnsubscriptionError_1.UnsubscriptionError) {
                            errors = errors.concat(flattenUnsubscriptionErrors(err.errors));
                        }
                        else {
                            errors.push(err);
                        }
                    }
                }
            }
        }
        if (hasErrors) {
            throw new UnsubscriptionError_1.UnsubscriptionError(errors);
        }
    };
    /**
     * Adds a tear down to be called during the unsubscribe() of this
     * Subscription.
     *
     * If the tear down being added is a subscription that is already
     * unsubscribed, is the same reference `add` is being called on, or is
     * `Subscription.EMPTY`, it will not be added.
     *
     * If this subscription is already in an `closed` state, the passed
     * tear down logic will be executed immediately.
     *
     * @param {TeardownLogic} teardown The additional logic to execute on
     * teardown.
     * @return {Subscription} Returns the Subscription used or created to be
     * added to the inner subscriptions list. This Subscription can be used with
     * `remove()` to remove the passed teardown logic from the inner subscriptions
     * list.
     */
    Subscription.prototype.add = function (teardown) {
        if (!teardown || (teardown === Subscription.EMPTY)) {
            return Subscription.EMPTY;
        }
        if (teardown === this) {
            return this;
        }
        var subscription = teardown;
        switch (typeof teardown) {
            case 'function':
                subscription = new Subscription(teardown);
            case 'object':
                if (subscription.closed || typeof subscription.unsubscribe !== 'function') {
                    return subscription;
                }
                else if (this.closed) {
                    subscription.unsubscribe();
                    return subscription;
                }
                else if (typeof subscription._addParent !== 'function' /* quack quack */) {
                    var tmp = subscription;
                    subscription = new Subscription();
                    subscription._subscriptions = [tmp];
                }
                break;
            default:
                throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
        }
        var subscriptions = this._subscriptions || (this._subscriptions = []);
        subscriptions.push(subscription);
        subscription._addParent(this);
        return subscription;
    };
    /**
     * Removes a Subscription from the internal list of subscriptions that will
     * unsubscribe during the unsubscribe process of this Subscription.
     * @param {Subscription} subscription The subscription to remove.
     * @return {void}
     */
    Subscription.prototype.remove = function (subscription) {
        var subscriptions = this._subscriptions;
        if (subscriptions) {
            var subscriptionIndex = subscriptions.indexOf(subscription);
            if (subscriptionIndex !== -1) {
                subscriptions.splice(subscriptionIndex, 1);
            }
        }
    };
    Subscription.prototype._addParent = function (parent) {
        var _a = this, _parent = _a._parent, _parents = _a._parents;
        if (!_parent || _parent === parent) {
            // If we don't have a parent, or the new parent is the same as the
            // current parent, then set this._parent to the new parent.
            this._parent = parent;
        }
        else if (!_parents) {
            // If there's already one parent, but not multiple, allocate an Array to
            // store the rest of the parent Subscriptions.
            this._parents = [parent];
        }
        else if (_parents.indexOf(parent) === -1) {
            // Only add the new parent to the _parents list if it's not already there.
            _parents.push(parent);
        }
    };
    Subscription.EMPTY = (function (empty) {
        empty.closed = true;
        return empty;
    }(new Subscription()));
    return Subscription;
}());
exports.Subscription = Subscription;
function flattenUnsubscriptionErrors(errors) {
    return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError_1.UnsubscriptionError) ? err.errors : err); }, []);
}
//# sourceMappingURL=Subscription.js.map

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.isArray = Array.isArray || (function (x) { return x && typeof x.length === 'number'; });
//# sourceMappingURL=isArray.js.map

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var errorObject_1 = __webpack_require__(7);
var tryCatchTarget;
function tryCatcher() {
    try {
        return tryCatchTarget.apply(this, arguments);
    }
    catch (e) {
        errorObject_1.errorObject.e = e;
        return errorObject_1.errorObject;
    }
}
function tryCatch(fn) {
    tryCatchTarget = fn;
    return tryCatcher;
}
exports.tryCatch = tryCatch;
;
//# sourceMappingURL=tryCatch.js.map

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * An error thrown when one or more errors have occurred during the
 * `unsubscribe` of a {@link Subscription}.
 */
var UnsubscriptionError = (function (_super) {
    __extends(UnsubscriptionError, _super);
    function UnsubscriptionError(errors) {
        _super.call(this);
        this.errors = errors;
        var err = Error.call(this, errors ?
            errors.length + " errors occurred during unsubscription:\n  " + errors.map(function (err, i) { return ((i + 1) + ") " + err.toString()); }).join('\n  ') : '');
        this.name = err.name = 'UnsubscriptionError';
        this.stack = err.stack;
        this.message = err.message;
    }
    return UnsubscriptionError;
}(Error));
exports.UnsubscriptionError = UnsubscriptionError;
//# sourceMappingURL=UnsubscriptionError.js.map

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var noop_1 = __webpack_require__(24);
/* tslint:enable:max-line-length */
function pipe() {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i - 0] = arguments[_i];
    }
    return pipeFromArray(fns);
}
exports.pipe = pipe;
/* @internal */
function pipeFromArray(fns) {
    if (!fns) {
        return noop_1.noop;
    }
    if (fns.length === 1) {
        return fns[0];
    }
    return function piped(input) {
        return fns.reduce(function (prev, fn) { return fn(prev); }, input);
    };
}
exports.pipeFromArray = pipeFromArray;
//# sourceMappingURL=pipe.js.map

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* tslint:disable:no-empty */
function noop() { }
exports.noop = noop;
//# sourceMappingURL=noop.js.map

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = __webpack_require__(0);
var awg_instrument_1 = __webpack_require__(26);
var dc_instrument_1 = __webpack_require__(28);
var la_instrument_1 = __webpack_require__(30);
var osc_instrument_1 = __webpack_require__(32);
var trigger_instrument_1 = __webpack_require__(34);
var gpio_instrument_1 = __webpack_require__(35);
var logger_instrument_1 = __webpack_require__(36);
var file_1 = __webpack_require__(50);
var transport_container_1 = __webpack_require__(13);
var Device = /** @class */ (function () {
    function Device(_rootUri, deviceDescriptor, httpTimeout) {
        this.instruments = {
            awg: null,
            dc: null,
            la: null,
            osc: null,
            trigger: null,
            gpio: null,
            logger: null
        };
        this.firmwareRepositoryUrl = 'https://s3-us-west-2.amazonaws.com/digilent/Software/OpenScope+MZ/release/without-bootloader';
        this.listFirmwareUrl = 'https://s3-us-west-2.amazonaws.com/digilent?prefix=Software/OpenScope+MZ/release/without-bootloader';
        this.descriptorObject = deviceDescriptor;
        this.httpTimeout = httpTimeout;
        this.rootUri = _rootUri;
        this.transport = new transport_container_1.TransportContainer(this.rootUri, httpTimeout);
        if (_rootUri === 'local') {
            this.transport.setLocalTransport(deviceDescriptor);
        }
        this.deviceMake = deviceDescriptor.deviceMake;
        this.deviceModel = deviceDescriptor.deviceModel;
        this.firmwareVersion = deviceDescriptor.firmwareVersion;
        this.calibrationSource = deviceDescriptor.calibrationSource;
        this.macAddress = deviceDescriptor.macAddress;
        this.instruments.awg = new awg_instrument_1.AwgInstrument(this.transport, deviceDescriptor.awg);
        this.instruments.dc = new dc_instrument_1.DcInstrument(this.transport, deviceDescriptor.dc);
        this.instruments.la = new la_instrument_1.LaInstrument(this.transport, deviceDescriptor.la);
        this.instruments.osc = new osc_instrument_1.OscInstrument(this.transport, deviceDescriptor.osc);
        this.instruments.trigger = new trigger_instrument_1.TriggerInstrument(this.transport, 'deviceDescriptor.trigger');
        this.instruments.gpio = new gpio_instrument_1.GpioInstrument(this.transport, deviceDescriptor.gpio);
        this.instruments.logger = new logger_instrument_1.LoggerInstrument(this.transport, deviceDescriptor.log);
        this.file = new file_1.File(this.transport);
    }
    Device.prototype.multiCommand = function (commandObject) {
        var _this = this;
        var commandToBeSent = {};
        return Observable_1.Observable.create(function (observer) {
            for (var instrument in commandObject) {
                commandToBeSent[instrument] = {};
                var functionNames = Object.keys(commandObject[instrument]);
                var flag = false;
                for (var _i = 0, functionNames_1 = functionNames; _i < functionNames_1.length; _i++) {
                    var element = functionNames_1[_i];
                    var responseJson = void 0;
                    try {
                        responseJson = (_a = _this.instruments[instrument])[element + 'Json'].apply(_a, commandObject[instrument][element]);
                    }
                    catch (e) {
                        console.log(e);
                        flag = true;
                        observer.error('Error in multiCommand().\nThis is most likely due to an undefined function.\nUnknown function name is: ' + element + 'Json.\nAuto-generated error: ' + e);
                    }
                    if (flag) {
                        return;
                    }
                    for (var channel in responseJson[instrument]) {
                        if (commandToBeSent[instrument][channel] === undefined) {
                            commandToBeSent[instrument][channel] = [];
                            commandToBeSent[instrument][channel] = responseJson[instrument][channel];
                        }
                        else {
                            commandToBeSent[instrument][channel].push(responseJson[instrument][channel][0]);
                        }
                    }
                }
            }
            //MultiCommand packet is complete. Now to send
            var multiCommandResponse;
            console.log('multicommand: ');
            console.log(commandToBeSent);
            _this.transport.writeRead('/', JSON.stringify(commandToBeSent), 'json').subscribe(function (arrayBuffer) {
                var firstChar = String.fromCharCode.apply(null, new Int8Array(arrayBuffer.slice(0, 1)));
                if (!isNaN(parseInt(firstChar))) {
                    //TODO switch to chunked transfer
                    var count = 0;
                    var i = 0;
                    var stringBuffer = '';
                    while (count < 2 && i < 10000) {
                        var char = '';
                        char += String.fromCharCode.apply(null, new Int8Array(arrayBuffer.slice(i, i + 1)));
                        if (char === '\n') {
                            count++;
                        }
                        stringBuffer += char;
                        i++;
                    }
                    var binaryIndexStringLength = stringBuffer.indexOf('\r\n');
                    var binaryIndex = parseFloat(stringBuffer.substring(0, binaryIndexStringLength));
                    var command = void 0;
                    var binaryData = void 0;
                    try {
                        command = JSON.parse(stringBuffer.substring(binaryIndexStringLength + 2, binaryIndexStringLength + binaryIndex + 2));
                        binaryData = arrayBuffer.slice(binaryIndexStringLength + 2 + binaryIndex);
                    }
                    catch (error) {
                        console.log('Error parsing OSJB response. Printing entire response');
                        console.log(String.fromCharCode.apply(null, new Int8Array(arrayBuffer.slice(0))));
                        observer.error(error);
                        return;
                    }
                    //Command parsed. Now calling individual parsing functions
                    var flag = false;
                    for (var instrument in command) {
                        for (var channel in command[instrument]) {
                            for (var _i = 0, _a = command[instrument][channel]; _i < _a.length; _i++) {
                                var responseObject = _a[_i];
                                try {
                                    if (responseObject.command === 'read') {
                                        console.log(responseObject);
                                        observer.next(_this.instruments[instrument][responseObject.command + 'Parse'](channel, command, binaryData));
                                    }
                                    else {
                                        observer.next(_this.instruments[instrument][responseObject.command + 'Parse'](channel, responseObject));
                                    }
                                }
                                catch (e) {
                                    console.log(e);
                                    flag = true;
                                    observer.error('Error in multiCommand().\nThis is most likely due to an undefined function.\nUnknown function name is: ' + responseObject.command + 'Parse.\nAuto-generated error: ' + e);
                                }
                                if (flag)
                                    return;
                            }
                        }
                    }
                    observer.next('OSJB whaddup');
                    observer.complete();
                }
                else if (firstChar === '{') {
                    //JSON
                    try {
                        console.log(String.fromCharCode.apply(null, new Int8Array(arrayBuffer.slice(0))));
                        multiCommandResponse = JSON.parse(String.fromCharCode.apply(null, new Int8Array(arrayBuffer.slice(0))));
                    }
                    catch (e) {
                        console.log(e);
                        observer.error('Error in multiCommand().\nThis is most likely due to an unparseable response.\nAuto-generated error: ' + e);
                    }
                    //Response Received! Now to reparse and call observer.next for each command
                    var flag = false;
                    for (var instrument in multiCommandResponse) {
                        for (var channel in multiCommandResponse[instrument]) {
                            for (var _b = 0, _c = multiCommandResponse[instrument][channel]; _b < _c.length; _b++) {
                                var responseObject = _c[_b];
                                try {
                                    if (responseObject.statusCode > 0) {
                                        console.log('StatusCode Error!');
                                        observer.error(responseObject);
                                        flag = true;
                                    }
                                    observer.next(_this.instruments[instrument][responseObject.command + 'Parse'](channel, responseObject));
                                }
                                catch (e) {
                                    console.log(e);
                                    flag = true;
                                    observer.error('Error in multiCommand().\nThis is most likely due to an undefined function.\nUnknown function name is: ' + responseObject.command + 'Parse.\nAuto-generated error: ' + e);
                                }
                                if (flag) {
                                    return;
                                }
                            }
                        }
                    }
                    observer.complete();
                }
                else {
                    observer.error('Error in multiCommand().\nThis is most likely due to an unrecognized response format. Exiting');
                }
            }, function (err) {
                console.log(err);
                observer.error('Error in multiCommand().\nThis is most likely due to no device being detected.');
            }, function () {
            });
            var _a;
        });
    };
    Device.prototype._genericResponseHandler = function (commandObject) {
        var _this = this;
        return Observable_1.Observable.create(function (observer) {
            _this.transport.writeRead('/', JSON.stringify(commandObject), 'json').subscribe(function (arrayBuffer) {
                var data;
                try {
                    var stringify = String.fromCharCode.apply(null, new Int8Array(arrayBuffer.slice(0)));
                    console.log(stringify);
                    data = JSON.parse(stringify);
                }
                catch (e) {
                    observer.error(e);
                    return;
                }
                if (data.device == undefined || data.device[0].statusCode > 0 || data.agent != undefined) {
                    observer.error(data);
                    return;
                }
                observer.next(data);
                //Handle device errors and warnings
                observer.complete();
            }, function (err) {
                observer.error(err);
            }, function () {
                observer.complete();
            });
        });
    };
    Device.prototype.resetInstruments = function () {
        var command = {
            device: [{
                    command: 'resetInstruments'
                }]
        };
        return this._genericResponseHandler(command);
    };
    Device.prototype.storageGetLocations = function () {
        var command = {
            "device": [{
                    command: "storageGetLocations"
                }]
        };
        return this._genericResponseHandler(command);
    };
    Device.prototype.calibrationGetStorageTypes = function () {
        var command = {
            "device": [{
                    command: "calibrationGetStorageTypes"
                }]
        };
        return this._genericResponseHandler(command);
    };
    Device.prototype.calibrationGetInstructions = function () {
        var command = {
            "device": [{
                    command: "calibrationGetInstructions"
                }]
        };
        return this._genericResponseHandler(command);
    };
    Device.prototype.calibrationStart = function () {
        var command = {
            "device": [{
                    command: "calibrationStart"
                }]
        };
        return this._genericResponseHandler(command);
    };
    Device.prototype.calibrationLoad = function (type) {
        var command = {
            "device": [{
                    "command": "calibrationLoad",
                    "type": type
                }]
        };
        return this._genericResponseHandler(command);
    };
    Device.prototype.calibrationRead = function () {
        var command = {
            "device": [{
                    command: "calibrationRead"
                }]
        };
        return this._genericResponseHandler(command);
    };
    Device.prototype.calibrationSave = function (type) {
        var command = {
            "device": [{
                    "command": "calibrationSave",
                    "type": type
                }]
        };
        return this._genericResponseHandler(command);
    };
    Device.prototype.calibrationGetStatus = function () {
        var command = {
            "device": [{
                    "command": "calibrationGetStatus"
                }]
        };
        return this._genericResponseHandler(command);
    };
    Device.prototype.nicList = function () {
        var command = {
            "device": [{
                    command: "nicList"
                }]
        };
        return this._genericResponseHandler(command);
    };
    Device.prototype.nicGetStatus = function (adapter) {
        var command = {
            "device": [{
                    command: "nicGetStatus",
                    adapter: adapter
                }]
        };
        return this._genericResponseHandler(command);
    };
    Device.prototype.nicConnect = function (adapter, parameterSet, force) {
        var command = {
            "device": [{
                    command: "nicConnect",
                    adapter: adapter,
                    parameterSet: parameterSet,
                    force: force
                }]
        };
        return this._genericResponseHandler(command);
    };
    Device.prototype.nicDisconnect = function (adapter) {
        var command = {
            "device": [{
                    command: "nicDisconnect",
                    adapter: adapter
                }]
        };
        return this._genericResponseHandler(command);
    };
    Device.prototype.wifiScan = function (adapter) {
        var command = {
            "device": [{
                    command: "wifiScan",
                    adapter: adapter
                }]
        };
        return this._genericResponseHandler(command);
    };
    Device.prototype.wifiReadScannedNetworks = function (adapter) {
        var command = {
            "device": [{
                    command: "wifiReadScannedNetworks",
                    adapter: adapter
                }]
        };
        return this._genericResponseHandler(command);
    };
    Device.prototype.wifiSetParameters = function (adapter, ssid, securityType, autoConnect, passphrase, keys, keyIndex) {
        var command = {
            "device": [{
                    "command": "wifiSetParameters",
                    "ssid": ssid,
                    "securityType": securityType,
                    "autoConnect": autoConnect
                }]
        };
        if (securityType === 'wep40' || securityType === 'wep104') {
            command.device[0]['keys'] = keys;
            command.device[0]['keyIndex'] = keyIndex;
        }
        else if (securityType === 'wpa' || securityType === 'wpa2') {
            if (passphrase) {
                command.device[0]['passphrase'] = passphrase;
            }
            else {
                command.device[0]['keys'] = keys;
            }
        }
        else if (securityType === 'open') {
            command.device[0]['passphrase'] = '';
        }
        return this._genericResponseHandler(command);
    };
    Device.prototype.wifiListSavedParameters = function (storageLocation) {
        var command = {
            "device": [{
                    command: "wifiListSavedParameters",
                    storageLocation: storageLocation
                }]
        };
        return this._genericResponseHandler(command);
    };
    Device.prototype.wifiDeleteParameters = function (storageLocation, ssid) {
        var command = {
            "device": [{
                    command: "wifiDeleteParameters",
                    storageLocation: storageLocation,
                    ssid: ssid
                }]
        };
        return this._genericResponseHandler(command);
    };
    Device.prototype.wifiSaveParameters = function (storageLocation) {
        var command = {
            "device": [{
                    command: "wifiSaveParameters",
                    storageLocation: storageLocation
                }]
        };
        return this._genericResponseHandler(command);
    };
    Device.prototype.wifiLoadParameters = function (storageLocation, ssid) {
        var command = {
            "device": [{
                    command: "wifiLoadParameters",
                    storageLocation: storageLocation,
                    ssid: ssid
                }]
        };
        return this._genericResponseHandler(command);
    };
    return Device;
}());
exports.Device = Device;
//# sourceMappingURL=device.js.map

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = __webpack_require__(0);
var generic_instrument_1 = __webpack_require__(1);
var awg_channel_1 = __webpack_require__(27);
var AwgInstrument = /** @class */ (function (_super) {
    __extends(AwgInstrument, _super);
    function AwgInstrument(_transport, _awgInstrumentDescriptor) {
        var _this = _super.call(this, _transport, '/') || this;
        _this.chans = [];
        //Populate AWG supply parameters
        _this.numChans = _awgInstrumentDescriptor.numChans;
        //Populate channels  
        for (var key in _awgInstrumentDescriptor) {
            if (key !== 'numChans') {
                _this.chans.push(new awg_channel_1.AwgChannel(_awgInstrumentDescriptor[key]));
            }
        }
        return _this;
    }
    AwgInstrument.prototype.setArbitraryWaveform = function (chans, waveforms, dataTypes) {
        var _this = this;
        var command = {
            "awg": {}
        };
        var binaryOffset = 0;
        var binaryLength = 0;
        chans.forEach(function (element, index, array) {
            //Hard code 2 bytes per value
            //TODO read data types and generate length from that instead of hard code
            binaryLength = waveforms[index].y.length * 2;
            command.awg[chans[index]] =
                [
                    {
                        command: "setArbitraryWaveform",
                        binaryOffset: binaryOffset,
                        binaryLength: binaryLength,
                        binaryType: dataTypes[index],
                        vpp: 3,
                        vOffset: 0,
                        dt: waveforms[index].dt
                    }
                ];
            binaryOffset += binaryLength;
        });
        var stringCommand = JSON.stringify(command) + '\r\n';
        var jsonChars = stringCommand.length;
        var fullString = jsonChars + '\r\n' + stringCommand;
        var binaryBufferToSend = new ArrayBuffer(fullString.length + binaryOffset);
        for (var i = 0; i < fullString.length; i++) {
            binaryBufferToSend[i] = fullString.charCodeAt(i);
        }
        for (var i = 0; i < chans.length; i++) {
            var typedArray = new Int16Array(waveforms[i].y);
            var byteConvert = new Uint8Array(typedArray.buffer);
            for (var i_1 = fullString.length, j = 0; i_1 < binaryOffset + fullString.length; i_1 = i_1 + 2, j = j + 2) {
                binaryBufferToSend[i_1] = byteConvert[j];
                binaryBufferToSend[i_1 + 1] = byteConvert[j + 1];
            }
        }
        return Observable_1.Observable.create(function (observer) {
            _this.transport.writeRead(_this.endpoint, binaryBufferToSend, 'binary').subscribe(function (arrayBuffer) {
                var data = JSON.parse(String.fromCharCode.apply(null, new Int8Array(arrayBuffer.slice(0))));
                for (var i = 0; i < chans.length; i++) {
                    if (data.awg == undefined || data.awg[chans[i]][0].statusCode > 0 || data.agent != undefined) {
                        observer.error(data);
                        return;
                    }
                }
                observer.next(data);
                observer.complete();
            }, function (err) {
                observer.error(err);
            }, function () {
                observer.complete();
            });
        });
    };
    AwgInstrument.prototype.getCurrentState = function (chans) {
        var command = {
            awg: {}
        };
        chans.forEach(function (element, index, array) {
            command.awg[chans[index]] =
                [{
                        command: "getCurrentState"
                    }];
        });
        return _super.prototype._genericResponseHandler.call(this, command);
    };
    AwgInstrument.prototype.setRegularWaveform = function (chans, settings) {
        var command = {
            "awg": {}
        };
        chans.forEach(function (element, index, array) {
            command.awg[chans[index]] =
                [
                    {
                        command: "setRegularWaveform",
                        signalType: settings[index].signalType,
                        signalFreq: Math.floor(settings[index].signalFreq * 1000),
                        vpp: Math.floor(settings[index].vpp * 1000),
                        vOffset: Math.floor(settings[index].vOffset * 1000)
                    }
                ];
        });
        return _super.prototype._genericResponseHandler.call(this, command);
    };
    AwgInstrument.prototype.setRegularWaveformJson = function (chans, settings) {
        var command = {
            "awg": {}
        };
        chans.forEach(function (element, index, array) {
            command.awg[chans[index]] =
                [
                    {
                        command: "setRegularWaveform",
                        signalType: settings[index].signalType,
                        signalFreq: Math.floor(settings[index].signalFreq * 1000),
                        vpp: Math.floor(settings[index].vpp * 1000),
                        vOffset: Math.floor(settings[index].vOffset * 1000)
                    }
                ];
        });
        return command;
    };
    AwgInstrument.prototype.setRegularWaveformParse = function (chan, responseObject) {
        return responseObject;
    };
    AwgInstrument.prototype.runJson = function (chans) {
        var command = {
            "awg": {}
        };
        chans.forEach(function (element, index, array) {
            command.awg[chans[index]] =
                [
                    {
                        command: "run"
                    }
                ];
        });
        return command;
    };
    AwgInstrument.prototype.runParse = function (chan, responseObject) {
        return responseObject;
    };
    AwgInstrument.prototype.run = function (chans) {
        var command = {
            "awg": {}
        };
        chans.forEach(function (element, index, array) {
            command.awg[chans[index]] =
                [
                    {
                        command: "run"
                    }
                ];
        });
        return _super.prototype._genericResponseHandler.call(this, command);
    };
    AwgInstrument.prototype.stop = function (chans) {
        var command = {
            "awg": {}
        };
        chans.forEach(function (element, index, array) {
            command.awg[chans[index]] =
                [
                    {
                        command: "stop"
                    }
                ];
        });
        return _super.prototype._genericResponseHandler.call(this, command);
    };
    return AwgInstrument;
}(generic_instrument_1.GenericInstrument));
exports.AwgInstrument = AwgInstrument;
//# sourceMappingURL=awg-instrument.js.map

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AwgChannel = /** @class */ (function () {
    function AwgChannel(awgChannelDescriptor) {
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
    return AwgChannel;
}());
exports.AwgChannel = AwgChannel;
//# sourceMappingURL=awg-channel.js.map

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = __webpack_require__(0);
var generic_instrument_1 = __webpack_require__(1);
var dc_channel_1 = __webpack_require__(29);
var DcInstrument = /** @class */ (function (_super) {
    __extends(DcInstrument, _super);
    function DcInstrument(_transport, _dcInstrumentDescriptor) {
        var _this = _super.call(this, _transport, '/') || this;
        _this.chans = [];
        //Populate DC supply parameters
        _this.numChans = _dcInstrumentDescriptor.numChans;
        //Populate channels        
        for (var key in _dcInstrumentDescriptor) {
            if (key !== 'numChans') {
                _this.chans.push(new dc_channel_1.DcChannel(_dcInstrumentDescriptor[key]));
            }
        }
        return _this;
    }
    //Get the output voltage(s) of the specified DC power supply channel(s).
    DcInstrument.prototype.getVoltagesJson = function (chans) {
        var command = {
            "dc": {}
        };
        chans.forEach(function (element, index, array) {
            command.dc[chans[index]] =
                [
                    {
                        "command": "getVoltage"
                    }
                ];
        });
        return command;
    };
    DcInstrument.prototype.getVoltageParse = function (chan, responseObject) {
        return 'Channel ' + chan + ' ' + responseObject.command + ' successful';
    };
    DcInstrument.prototype.setVoltagesJson = function (chans, voltages) {
        var scaledVoltages = [];
        var command = {
            "dc": {}
        };
        voltages.forEach(function (element, index, array) {
            scaledVoltages.push(element * 1000);
            command.dc[chans[index]] =
                [
                    {
                        "command": "setVoltage",
                        "voltage": Math.round(element * 1000)
                    }
                ];
        });
        return command;
    };
    DcInstrument.prototype.setVoltageParse = function (chan, responseObject) {
        return 'Channel ' + chan + ' ' + responseObject.command + ' successful';
    };
    DcInstrument.prototype.getVoltages = function (chans) {
        var _this = this;
        var command = this.getVoltagesJson(chans);
        return Observable_1.Observable.create(function (observer) {
            _super.prototype._genericResponseHandler.call(_this, command).subscribe(function (data) {
                for (var i = 0; i < chans.length; i++) {
                    if (data.dc == undefined || data.dc[chans[i]][0].statusCode > 0 || data.agent != undefined) {
                        observer.error(data);
                        return;
                    }
                    data.dc[chans[i]][0].voltage = data.dc[chans[i]][0].voltage / 1000;
                }
                //Return voltages and complete observer
                observer.next(data);
                observer.complete();
            }, function (err) {
                observer.error(err);
            }, function () { });
        });
    };
    //Set the output voltage of the specified DC power supply channel.
    DcInstrument.prototype.setVoltages = function (chans, voltages) {
        var command = this.setVoltagesJson(chans, voltages);
        return _super.prototype._genericResponseHandler.call(this, command);
    };
    //Streaming read voltages from the specified channel(s)
    DcInstrument.prototype.streamReadVoltages = function (chans, delay) {
        var _this = this;
        if (delay === void 0) { delay = 0; }
        var command = {
            command: "dcGetVoltages",
            chans: chans
        };
        return Observable_1.Observable.create(function (observer) {
            _this.transport.streamFrom(_this.endpoint, JSON.stringify(command), 'json', delay).subscribe(function (arrayBuffer) {
                var data = JSON.parse(String.fromCharCode.apply(null, new Int8Array(arrayBuffer.slice(0))));
                //Handle device errors and warnings
                for (var i = 0; i < chans.length; i++) {
                    if (data.dc == undefined || data.dc[chans[i]][0].statusCode > 0 || data.agent != undefined) {
                        observer.error(data);
                        return;
                    }
                }
                //Scale from mV to V                            
                data.voltages.forEach(function (element, index, array) {
                    array[index] = element / 1000;
                });
                observer.next(data.voltages);
            }, function (err) {
                observer.error(err);
            }, function () {
                observer.complete();
            });
        });
    };
    //Stop the current stream
    DcInstrument.prototype.stopStream = function () {
        this.transport.stopStream();
    };
    return DcInstrument;
}(generic_instrument_1.GenericInstrument));
exports.DcInstrument = DcInstrument;
//# sourceMappingURL=dc-instrument.js.map

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DcChannel = /** @class */ (function () {
    function DcChannel(dcChannelDescriptor) {
        this.voltageMin = 0;
        this.voltageMax = 0;
        this.voltageIncrement = 0;
        this.currentMin = 0;
        this.currentMax = 0;
        this.currentIncrement = 0;
        this.voltageMin = dcChannelDescriptor.voltageMin;
        this.voltageMax = dcChannelDescriptor.voltageMax;
        this.voltageIncrement = dcChannelDescriptor.voltageIncrement;
        this.currentMin = dcChannelDescriptor.currentMin;
        this.currentMax = dcChannelDescriptor.currentMax;
        this.currentIncrement = dcChannelDescriptor.currentIncrement;
    }
    return DcChannel;
}());
exports.DcChannel = DcChannel;
//# sourceMappingURL=dc-channel.js.map

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = __webpack_require__(0);
var la_channel_1 = __webpack_require__(31);
var generic_instrument_1 = __webpack_require__(1);
var waveform_1 = __webpack_require__(11);
var command_utility_1 = __webpack_require__(3);
var LaInstrument = /** @class */ (function (_super) {
    __extends(LaInstrument, _super);
    function LaInstrument(_transport, _laInstrumentDescriptor) {
        var _this = _super.call(this, _transport, '/') || this;
        _this.chans = [];
        _this.numDataBuffers = 8;
        _this.dataBuffer = [];
        _this.dataBufferWriteIndex = 0;
        _this.dataBufferReadIndex = 0;
        //Populate LA supply parameters
        _this.numChans = _laInstrumentDescriptor.numChans;
        _this.commandUtility = new command_utility_1.CommandUtility();
        //Populate channels  
        for (var channel in _laInstrumentDescriptor) {
            if (channel !== 'numChans') {
                _this.chans.push(new la_channel_1.LaChannel(_laInstrumentDescriptor[channel]));
            }
        }
        for (var i = 0; i < _this.numDataBuffers; i++) {
            _this.dataBuffer.push([]);
        }
        return _this;
    }
    LaInstrument.prototype.getCurrentStateJson = function (chans) {
        var command = {
            la: {}
        };
        chans.forEach(function (element, index, array) {
            command.la[chans[index]] =
                [
                    {
                        command: "getCurrentState"
                    }
                ];
        });
        return command;
    };
    LaInstrument.prototype.getCurrentState = function (chans) {
        var command = this.getCurrentStateJson(chans);
        return _super.prototype._genericResponseHandler.call(this, command);
    };
    LaInstrument.prototype.setParametersJson = function (chans, bitmasks, sampleFreqs, bufferSizes, triggerDelays) {
        var command = {
            "la": {}
        };
        chans.forEach(function (element, index, array) {
            command.la[chans[index]] =
                [
                    {
                        command: "setParameters",
                        bitmask: bitmasks[index],
                        triggerDelay: Math.round(triggerDelays[index] * Math.pow(10, 12)),
                        sampleFreq: Math.round(sampleFreqs[index] * 1000),
                        bufferSize: bufferSizes[index]
                    }
                ];
        });
        return command;
    };
    LaInstrument.prototype.setParametersParse = function (chan, responseObject) {
        return 'Channel ' + chan + ' ' + responseObject.command + ' successful';
    };
    //Tell OpenScope to run once and return a buffer
    LaInstrument.prototype.setParameters = function (chans, bitmasks, sampleFreqs, bufferSizes, triggerDelays) {
        if (chans.length == 0) {
            return Observable_1.Observable.create(function (observer) {
                observer.complete();
            });
        }
        var command = this.setParametersJson(chans, bitmasks, sampleFreqs, bufferSizes, triggerDelays);
        return _super.prototype._genericResponseHandler.call(this, command);
    };
    //Tell OpenScope to run once and return a buffer
    LaInstrument.prototype.read = function (chans) {
        var _this = this;
        if (chans.length == 0) {
            return Observable_1.Observable.create(function (observer) {
                observer.complete();
            });
        }
        var command = {
            "la": {}
        };
        chans.forEach(function (element, index, array) {
            command.la[chans[index]] =
                [
                    {
                        "command": "read"
                    }
                ];
        });
        console.log('READREADREADREAD');
        return Observable_1.Observable.create(function (observer) {
            _this.transport.writeRead('/', JSON.stringify(command), 'json').subscribe(function (data) {
                _this.rawPacket = data;
                var start = performance.now();
                _this.commandUtility.observableParseChunkedTransfer(data).subscribe(function (data) {
                    var command = data.json;
                    var channelsObject = {};
                    var binaryData;
                    console.log('la response received');
                    console.log(command);
                    try {
                        binaryData = new Int16Array(data.typedArray.slice(command.la[chans[0].toString()][0].binaryOffset, command.la[chans[0].toString()][0].binaryOffset + command.la[chans[0].toString()][0].binaryLength));
                    }
                    catch (e) {
                        console.log(e);
                        observer.error(e);
                        return;
                    }
                    var untypedArray = Array.prototype.slice.call(binaryData);
                    _this.dataBuffer[_this.dataBufferWriteIndex] = [];
                    for (var group in command.la) {
                        if (command.la[group][0].statusCode > 0) {
                            observer.error(command);
                            return;
                        }
                        var binaryString = command.la[group][0].bitmask.toString(2);
                        console.log(binaryString);
                        for (var i = 0; i < binaryString.length; i++) {
                            console.log(binaryString[i]);
                            if (binaryString[i] === '1') {
                                var channel = binaryString.length - i;
                                channelsObject[channel] = [];
                                var andVal = Math.pow(2, channel - 1);
                                var dt = 1 / (command.la[group][0].actualSampleFreq / 1000);
                                var pointContainer = [];
                                var triggerPosition = command.la[group][0].triggerIndex * dt;
                                if (triggerPosition < 0) {
                                    console.log('trigger not in la buffer!');
                                    triggerPosition = command.la[group][0].triggerDelay;
                                }
                                for (var j = 0; j < untypedArray.length; j++) {
                                    channelsObject[channel].push((andVal & untypedArray[j]) > 0 ? 1 : 0);
                                    pointContainer.push([j * dt - triggerPosition, (andVal & untypedArray[j]) > 0 ? 1 : 0]);
                                }
                                _this.dataBuffer[_this.dataBufferWriteIndex][channel - 1] = new waveform_1.Waveform({
                                    dt: 1 / (command.la[group][0].actualSampleFreq / 1000),
                                    t0: 0,
                                    y: channelsObject[channel],
                                    data: pointContainer,
                                    pointOfInterest: command.la[group][0].pointOfInterest,
                                    triggerPosition: triggerPosition,
                                    seriesOffset: 0.5,
                                    triggerDelay: (command.la[group][0].triggerDelay == undefined ? command.la[group][0].actualTriggerDelay : command.la[group][0].triggerDelay)
                                });
                            }
                        }
                    }
                    _this.dataBufferReadIndex = _this.dataBufferWriteIndex;
                    _this.dataBufferWriteIndex = (_this.dataBufferWriteIndex + 1) % _this.numDataBuffers;
                    var finish = performance.now();
                    console.log('Time: ' + (finish - start));
                    console.log(channelsObject);
                    observer.next(command);
                    //Handle device errors and warnings
                    observer.complete();
                }, function (err) {
                    observer.error(data);
                }, function () { });
            }, function (err) {
                observer.error(err);
            }, function () {
                observer.complete();
            });
        });
    };
    return LaInstrument;
}(generic_instrument_1.GenericInstrument));
exports.LaInstrument = LaInstrument;
//# sourceMappingURL=la-instrument.js.map

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var LaChannel = /** @class */ (function () {
    function LaChannel(_laChannelDescriptor) {
        this.bufferDataType = _laChannelDescriptor.bufferDataType;
        this.numDataBits = _laChannelDescriptor.numDataBits;
        this.bitmask = _laChannelDescriptor.bitmask;
        this.sampleFreqMin = _laChannelDescriptor.sampleFreqMin;
        this.sampleFreqMax = _laChannelDescriptor.sampleFreqMax;
        this.bufferSizeMax = _laChannelDescriptor.bufferSizeMax;
    }
    return LaChannel;
}());
exports.LaChannel = LaChannel;
//# sourceMappingURL=la-channel.js.map

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = __webpack_require__(0);
var generic_instrument_1 = __webpack_require__(1);
var osc_channel_1 = __webpack_require__(33);
var waveform_1 = __webpack_require__(11);
var command_utility_1 = __webpack_require__(3);
var OscInstrument = /** @class */ (function (_super) {
    __extends(OscInstrument, _super);
    function OscInstrument(_transport, _oscInstrumentDescriptor) {
        var _this = _super.call(this, _transport, '/') || this;
        _this.chans = [];
        _this.numDataBuffers = 8;
        _this.dataBuffer = [];
        _this.dataBufferWriteIndex = 0;
        _this.dataBufferReadIndex = 0;
        //Populate DC supply parameters
        _this.numChans = _oscInstrumentDescriptor.numChans;
        _this.commandUtility = new command_utility_1.CommandUtility();
        //Populate channels        
        for (var channel in _oscInstrumentDescriptor) {
            if (channel !== 'numChans') {
                _this.chans.push(new osc_channel_1.OscChannel(_oscInstrumentDescriptor[channel]));
            }
        }
        for (var i = 0; i < _this.numDataBuffers; i++) {
            _this.dataBuffer.push([]);
        }
        return _this;
    }
    OscInstrument.prototype.getCurrentState = function (chans) {
        var command = this.getCurrentStateJson(chans);
        return _super.prototype._genericResponseHandler.call(this, command);
    };
    OscInstrument.prototype.getCurrentStateJson = function (chans) {
        var command = {
            osc: {}
        };
        chans.forEach(function (element, index, array) {
            command.osc[chans[index]] =
                [
                    {
                        command: 'getCurrentState'
                    }
                ];
        });
        return command;
    };
    OscInstrument.prototype.getCurrentStateParse = function (chan, responseObject) {
        return 'Success';
    };
    OscInstrument.prototype.setParametersJson = function (chans, offsets, gains, sampleFreqs, bufferSizes, delays) {
        var command = {
            "osc": {}
        };
        chans.forEach(function (element, index, array) {
            command.osc[chans[index]] =
                [
                    {
                        command: "setParameters",
                        vOffset: Math.round(offsets[index] * 1000),
                        gain: gains[index],
                        sampleFreq: Math.round(sampleFreqs[index] * 1000),
                        bufferSize: Math.round(bufferSizes[index]),
                        triggerDelay: Math.round(delays[index] * 1000000000000)
                    }
                ];
        });
        return command;
    };
    OscInstrument.prototype.setParametersParse = function (chan, responseObject) {
        return 'Channel ' + chan + ' ' + responseObject.command + ' successful';
    };
    //Tell OpenScope to run once and return a buffer
    OscInstrument.prototype.setParameters = function (chans, offsets, gains, sampleFreqs, bufferSizes, delays) {
        if (chans.length == 0) {
            return Observable_1.Observable.create(function (observer) {
                observer.complete();
            });
        }
        var command = this.setParametersJson(chans, offsets, gains, sampleFreqs, bufferSizes, delays);
        return _super.prototype._genericResponseHandler.call(this, command);
    };
    //Tell OpenScope to run once and return a buffer
    OscInstrument.prototype.read = function (chans) {
        var _this = this;
        if (chans.length == 0) {
            return Observable_1.Observable.create(function (observer) {
                observer.complete();
            });
        }
        var command = {
            "osc": {}
        };
        chans.forEach(function (element, index, array) {
            command.osc[chans[index]] =
                [
                    {
                        "command": "read"
                    }
                ];
        });
        this.dataBuffer[this.dataBufferWriteIndex] = [];
        return Observable_1.Observable.create(function (observer) {
            _this.transport.writeRead('/', JSON.stringify(command), 'json').subscribe(function (data) {
                _this.rawPacket = data;
                _this.commandUtility.observableParseChunkedTransfer(data).subscribe(function (data) {
                    var command = data.json;
                    console.log(command);
                    for (var channel in command.osc) {
                        if (command.osc[channel][0].statusCode > 0) {
                            observer.error('One or more channels still acquiring');
                            return;
                        }
                        var binaryOffset = command.osc[channel][0].binaryOffset / 2;
                        var binaryData = data.typedArray.slice(binaryOffset, binaryOffset + command.osc[channel][0].binaryLength / 2);
                        var untypedArray = Array.prototype.slice.call(binaryData);
                        var scaledArray = untypedArray.map(function (voltage) {
                            return voltage / 1000;
                        });
                        var dt = 1 / (command.osc[channel][0].actualSampleFreq / 1000);
                        var pointContainer = [];
                        var triggerPosition = -1 * command.osc[channel][0].triggerDelay / Math.pow(10, 12) + dt * scaledArray.length / 2;
                        for (var i = 0; i < scaledArray.length; i++) {
                            pointContainer.push([i * dt - triggerPosition, scaledArray[i]]);
                        }
                        _this.dataBuffer[_this.dataBufferWriteIndex][parseInt(channel) - 1] = new waveform_1.Waveform({
                            dt: 1 / (command.osc[channel][0].actualSampleFreq / 1000),
                            t0: 0,
                            y: scaledArray,
                            data: pointContainer,
                            pointOfInterest: command.osc[channel][0].pointOfInterest,
                            triggerPosition: command.osc[channel][0].triggerIndex,
                            seriesOffset: command.osc[channel][0].actualVOffset / 1000,
                            triggerDelay: (command.osc[channel][0].triggerDelay == undefined ? command.osc[channel][0].actualTriggerDelay : command.osc[channel][0].triggerDelay)
                        });
                    }
                    _this.dataBufferReadIndex = _this.dataBufferWriteIndex;
                    _this.dataBufferWriteIndex = (_this.dataBufferWriteIndex + 1) % _this.numDataBuffers;
                    var finish = performance.now();
                    observer.next(command);
                    //Handle device errors and warnings
                    observer.complete();
                }, function (err) {
                    observer.error(data);
                }, function () { });
            }, function (err) {
                observer.error(err);
            }, function () { });
        });
    };
    return OscInstrument;
}(generic_instrument_1.GenericInstrument));
exports.OscInstrument = OscInstrument;
//# sourceMappingURL=osc-instrument.js.map

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var OscChannel = /** @class */ (function () {
    function OscChannel(oscChannelDescriptor) {
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
    return OscChannel;
}());
exports.OscChannel = OscChannel;
//# sourceMappingURL=osc-channel.js.map

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = __webpack_require__(0);
var generic_instrument_1 = __webpack_require__(1);
var TriggerInstrument = /** @class */ (function (_super) {
    __extends(TriggerInstrument, _super);
    function TriggerInstrument(_transport, _triggerInstrumentDescriptor) {
        var _this = _super.call(this, _transport, '/') || this;
        _this.chans = [];
        return _this;
    }
    TriggerInstrument.prototype.setParametersJson = function (chans, sources, targetsArray) {
        var command = {
            "trigger": {}
        };
        chans.forEach(function (element, index, array) {
            command.trigger[chans[index]] =
                [
                    {
                        "command": "setParameters",
                        "source": sources[index],
                        "targets": targetsArray[index]
                    }
                ];
        });
        return command;
    };
    TriggerInstrument.prototype.setParametersParse = function (chan, command) {
        return 'set Parameters channel ' + chan + ' is done!';
    };
    //Tell OpenScope to run once and return a buffer
    TriggerInstrument.prototype.setParameters = function (chans, sources, targetsArray) {
        if (chans.length == 0) {
            return Observable_1.Observable.create(function (observer) {
                observer.complete();
            });
        }
        var command = this.setParametersJson(chans, sources, targetsArray);
        return _super.prototype._genericResponseHandler.call(this, command);
    };
    TriggerInstrument.prototype.getCurrentState = function (chans) {
        var command = this.getCurrentStateJson(chans);
        return _super.prototype._genericResponseHandler.call(this, command);
    };
    TriggerInstrument.prototype.getCurrentStateJson = function (chans) {
        var command = {
            trigger: {}
        };
        chans.forEach(function (element, index, array) {
            command.trigger[chans[index]] =
                [
                    {
                        command: 'getCurrentState'
                    }
                ];
        });
        return command;
    };
    TriggerInstrument.prototype.getCurrentStateParse = function (chan, responseObject) {
        return 'Success';
    };
    TriggerInstrument.prototype.singleJson = function (chans) {
        var command = {
            "trigger": {}
        };
        chans.forEach(function (element, index, array) {
            command.trigger[chans[index]] =
                [
                    {
                        "command": "single"
                    }
                ];
        });
        return command;
    };
    TriggerInstrument.prototype.singleParse = function (chan, command) {
        return 'single channel ' + chan + ' is done';
    };
    TriggerInstrument.prototype.single = function (chans) {
        //If no channels are active no need to talk to hardware
        if (chans.length == 0) {
            return Observable_1.Observable.create(function (observer) {
                observer.complete();
            });
        }
        var command = this.singleJson(chans);
        return _super.prototype._genericResponseHandler.call(this, command);
    };
    TriggerInstrument.prototype.stopJson = function (chans) {
        var command = {
            trigger: {}
        };
        chans.forEach(function (element, index, array) {
            command.trigger[chans[index]] = [{
                    command: "stop"
                }];
        });
        return command;
    };
    TriggerInstrument.prototype.stopParse = function (chan, command) {
        return 'stop done';
    };
    TriggerInstrument.prototype.stop = function (chans) {
        if (chans.length == 0) {
            return Observable_1.Observable.create(function (observer) {
                observer.complete();
            });
        }
        var command = this.stopJson(chans);
        return _super.prototype._genericResponseHandler.call(this, command);
    };
    TriggerInstrument.prototype.forceTriggerJson = function (chans) {
        var command = {
            "trigger": {}
        };
        chans.forEach(function (element, index, array) {
            command.trigger[chans[index]] =
                [
                    {
                        "command": "forceTrigger"
                    }
                ];
        });
        return command;
    };
    TriggerInstrument.prototype.forceTriggerParse = function (chan, command) {
        return 'force trigger done';
    };
    TriggerInstrument.prototype.forceTrigger = function (chans) {
        //If no channels are active no need to talk to hardware
        if (chans.length == 0) {
            return Observable_1.Observable.create(function (observer) {
                observer.complete();
            });
        }
        var command = this.forceTriggerJson(chans);
        return _super.prototype._genericResponseHandler.call(this, command);
    };
    return TriggerInstrument;
}(generic_instrument_1.GenericInstrument));
exports.TriggerInstrument = TriggerInstrument;
//# sourceMappingURL=trigger-instrument.js.map

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = __webpack_require__(0);
var generic_instrument_1 = __webpack_require__(1);
var GpioInstrument = /** @class */ (function (_super) {
    __extends(GpioInstrument, _super);
    function GpioInstrument(_transport, _gpioInstrumentDescriptor) {
        var _this = _super.call(this, _transport, '/') || this;
        //Populate LA supply parameters
        _this.numChans = _gpioInstrumentDescriptor.numChans;
        _this.sinkCurrentMax = _gpioInstrumentDescriptor.sinkCurrentMax;
        _this.sourceCurrentMax = _gpioInstrumentDescriptor.sourceCurrentMax;
        return _this;
    }
    GpioInstrument.prototype.setParameters = function (chans, directions) {
        var command = {
            "gpio": {}
        };
        chans.forEach(function (element, index, array) {
            command.gpio[chans[index]] =
                [
                    {
                        "command": "setParameters",
                        "direction": directions[index]
                    }
                ];
        });
        return _super.prototype._genericResponseHandler.call(this, command);
    };
    //Set the output voltage of the specified DC power supply channel.
    GpioInstrument.prototype.write = function (chans, values) {
        var command = {
            "gpio": {}
        };
        values.forEach(function (element, index, array) {
            command.gpio[chans[index]] =
                [
                    {
                        "command": "write",
                        "value": values[index]
                    }
                ];
        });
        return _super.prototype._genericResponseHandler.call(this, command);
    };
    //Set the output voltage of the specified DC power supply channel.
    GpioInstrument.prototype.read = function (chans) {
        var _this = this;
        var command = {
            "gpio": {}
        };
        chans.forEach(function (element, index, array) {
            command.gpio[chans[index]] =
                [
                    {
                        "command": "read"
                    }
                ];
        });
        return Observable_1.Observable.create(function (observer) {
            if (chans.length < 1) {
                observer.error('No Channels Specified');
            }
            _this.transport.writeRead(_this.endpoint, JSON.stringify(command), 'json').subscribe(function (arrayBuffer) {
                //Handle device errors and warnings
                var data;
                try {
                    data = JSON.parse(String.fromCharCode.apply(null, new Int8Array(arrayBuffer.slice(0))));
                }
                catch (e) {
                    observer.error(e);
                    return;
                }
                for (var i = 0; i < chans.length; i++) {
                    if (data.gpio == undefined || data.gpio[chans[i]][0].statusCode > 0 || data.agent != undefined) {
                        observer.error(data);
                        return;
                    }
                }
                observer.next(data);
                observer.complete();
            }, function (err) {
                observer.error(err);
            }, function () {
                observer.complete();
            });
        });
    };
    return GpioInstrument;
}(generic_instrument_1.GenericInstrument));
exports.GpioInstrument = GpioInstrument;
//# sourceMappingURL=gpio-instrument.js.map

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var logger_analog_instrument_1 = __webpack_require__(37);
var logger_digital_instrument_1 = __webpack_require__(48);
var LoggerInstrument = /** @class */ (function () {
    function LoggerInstrument(_transport, _loggerInstrumentDescriptor) {
        this.analog = new logger_analog_instrument_1.LoggerAnalogInstrument(_transport, _loggerInstrumentDescriptor == undefined ? undefined : _loggerInstrumentDescriptor.analog);
        this.digital = new logger_digital_instrument_1.LoggerDigitalInstrument(_transport, _loggerInstrumentDescriptor == undefined ? undefined : _loggerInstrumentDescriptor.digital);
    }
    return LoggerInstrument;
}());
exports.LoggerInstrument = LoggerInstrument;
//# sourceMappingURL=logger-instrument.js.map

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var generic_instrument_1 = __webpack_require__(1);
var logger_analog_channel_1 = __webpack_require__(38);
var logger_command_1 = __webpack_require__(12);
var LoggerAnalogInstrument = /** @class */ (function (_super) {
    __extends(LoggerAnalogInstrument, _super);
    function LoggerAnalogInstrument(_transport, _loggerInstrumentDescriptor) {
        var _this = _super.call(this, _transport, '/') || this;
        _this.chans = [];
        _this.numChans = 0;
        _this.fileFormat = -1;
        _this.fileRevision = -1;
        _this.loggerCommand = new logger_command_1.LoggerCommand(_this);
        if (_loggerInstrumentDescriptor == undefined) {
            return _this;
        }
        _this.fileFormat = _loggerInstrumentDescriptor.fileFormat;
        _this.fileRevision = _loggerInstrumentDescriptor.fileRevision;
        //Populate logger analog supply parameters
        _this.numChans = _loggerInstrumentDescriptor.numChans;
        //Populate channels        
        for (var key in _loggerInstrumentDescriptor) {
            if (parseInt(key).toString() === key && !isNaN(parseInt(key))) {
                _this.chans.push(new logger_analog_channel_1.LoggerAnalogChannel(_loggerInstrumentDescriptor[key]));
            }
        }
        return _this;
    }
    LoggerAnalogInstrument.prototype.setParameters = function (chans, maxSampleCounts, gains, vOffsets, sampleFreqs, startDelays, overflows, storageLocations, uris) {
        return this.loggerCommand.analogSetParameters(chans, maxSampleCounts, gains, vOffsets, sampleFreqs, startDelays, overflows, storageLocations, uris);
    };
    LoggerAnalogInstrument.prototype.run = function (instrument, chans) {
        return this.loggerCommand.run('analog', chans);
    };
    LoggerAnalogInstrument.prototype.stop = function (instrument, chans) {
        return this.loggerCommand.stop('analog', chans);
    };
    LoggerAnalogInstrument.prototype.read = function (instrument, chans, startIndices, counts) {
        return this.loggerCommand.read('analog', chans, startIndices, counts);
    };
    LoggerAnalogInstrument.prototype.getCurrentState = function (instrument, chans) {
        return this.loggerCommand.getCurrentState('analog', chans);
    };
    return LoggerAnalogInstrument;
}(generic_instrument_1.GenericInstrument));
exports.LoggerAnalogInstrument = LoggerAnalogInstrument;
//# sourceMappingURL=logger-analog-instrument.js.map

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var LoggerAnalogChannel = /** @class */ (function () {
    function LoggerAnalogChannel(loggerChannelDescriptor) {
        this.resolution = 0;
        this.effectiveBits = 0;
        this.bufferSizeMax = 0;
        this.fileSamplesMax = 0;
        this.sampleDataType = "I16";
        this.sampleFreqUnits = 0;
        this.sampleFreqMin = 0;
        this.sampleFreqMax = 0;
        this.delayUnits = 0;
        this.delayMax = 0;
        this.delayMin = 0;
        this.voltageUnits = 0;
        this.adcVpp = 0;
        this.inputVoltageMax = 0;
        this.inputVoltageMin = 0;
        this.gains = [];
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
        this.adcVpp = loggerChannelDescriptor.adcVpp;
        this.inputVoltageMax = loggerChannelDescriptor.inputVoltageMax;
        this.inputVoltageMin = loggerChannelDescriptor.inputVoltageMin;
        this.gains = loggerChannelDescriptor.gains;
    }
    return LoggerAnalogChannel;
}());
exports.LoggerAnalogChannel = LoggerAnalogChannel;
//# sourceMappingURL=logger-analog-channel.js.map

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Observable_1 = __webpack_require__(0);
var mergeMap_1 = __webpack_require__(40);
Observable_1.Observable.prototype.mergeMap = mergeMap_1.mergeMap;
Observable_1.Observable.prototype.flatMap = mergeMap_1.mergeMap;
//# sourceMappingURL=mergeMap.js.map

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var mergeMap_1 = __webpack_require__(41);
/* tslint:enable:max-line-length */
/**
 * Projects each source value to an Observable which is merged in the output
 * Observable.
 *
 * <span class="informal">Maps each value to an Observable, then flattens all of
 * these inner Observables using {@link mergeAll}.</span>
 *
 * <img src="./img/mergeMap.png" width="100%">
 *
 * Returns an Observable that emits items based on applying a function that you
 * supply to each item emitted by the source Observable, where that function
 * returns an Observable, and then merging those resulting Observables and
 * emitting the results of this merger.
 *
 * @example <caption>Map and flatten each letter to an Observable ticking every 1 second</caption>
 * var letters = Rx.Observable.of('a', 'b', 'c');
 * var result = letters.mergeMap(x =>
 *   Rx.Observable.interval(1000).map(i => x+i)
 * );
 * result.subscribe(x => console.log(x));
 *
 * // Results in the following:
 * // a0
 * // b0
 * // c0
 * // a1
 * // b1
 * // c1
 * // continues to list a,b,c with respective ascending integers
 *
 * @see {@link concatMap}
 * @see {@link exhaustMap}
 * @see {@link merge}
 * @see {@link mergeAll}
 * @see {@link mergeMapTo}
 * @see {@link mergeScan}
 * @see {@link switchMap}
 *
 * @param {function(value: T, ?index: number): ObservableInput} project A function
 * that, when applied to an item emitted by the source Observable, returns an
 * Observable.
 * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
 * A function to produce the value on the output Observable based on the values
 * and the indices of the source (outer) emission and the inner Observable
 * emission. The arguments passed to this function are:
 * - `outerValue`: the value that came from the source
 * - `innerValue`: the value that came from the projected Observable
 * - `outerIndex`: the "index" of the value that came from the source
 * - `innerIndex`: the "index" of the value from the projected Observable
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
 * Observables being subscribed to concurrently.
 * @return {Observable} An Observable that emits the result of applying the
 * projection function (and the optional `resultSelector`) to each item emitted
 * by the source Observable and merging the results of the Observables obtained
 * from this transformation.
 * @method mergeMap
 * @owner Observable
 */
function mergeMap(project, resultSelector, concurrent) {
    if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
    return mergeMap_1.mergeMap(project, resultSelector, concurrent)(this);
}
exports.mergeMap = mergeMap;
//# sourceMappingURL=mergeMap.js.map

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var subscribeToResult_1 = __webpack_require__(42);
var OuterSubscriber_1 = __webpack_require__(47);
/* tslint:enable:max-line-length */
/**
 * Projects each source value to an Observable which is merged in the output
 * Observable.
 *
 * <span class="informal">Maps each value to an Observable, then flattens all of
 * these inner Observables using {@link mergeAll}.</span>
 *
 * <img src="./img/mergeMap.png" width="100%">
 *
 * Returns an Observable that emits items based on applying a function that you
 * supply to each item emitted by the source Observable, where that function
 * returns an Observable, and then merging those resulting Observables and
 * emitting the results of this merger.
 *
 * @example <caption>Map and flatten each letter to an Observable ticking every 1 second</caption>
 * var letters = Rx.Observable.of('a', 'b', 'c');
 * var result = letters.mergeMap(x =>
 *   Rx.Observable.interval(1000).map(i => x+i)
 * );
 * result.subscribe(x => console.log(x));
 *
 * // Results in the following:
 * // a0
 * // b0
 * // c0
 * // a1
 * // b1
 * // c1
 * // continues to list a,b,c with respective ascending integers
 *
 * @see {@link concatMap}
 * @see {@link exhaustMap}
 * @see {@link merge}
 * @see {@link mergeAll}
 * @see {@link mergeMapTo}
 * @see {@link mergeScan}
 * @see {@link switchMap}
 *
 * @param {function(value: T, ?index: number): ObservableInput} project A function
 * that, when applied to an item emitted by the source Observable, returns an
 * Observable.
 * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
 * A function to produce the value on the output Observable based on the values
 * and the indices of the source (outer) emission and the inner Observable
 * emission. The arguments passed to this function are:
 * - `outerValue`: the value that came from the source
 * - `innerValue`: the value that came from the projected Observable
 * - `outerIndex`: the "index" of the value that came from the source
 * - `innerIndex`: the "index" of the value from the projected Observable
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
 * Observables being subscribed to concurrently.
 * @return {Observable} An Observable that emits the result of applying the
 * projection function (and the optional `resultSelector`) to each item emitted
 * by the source Observable and merging the results of the Observables obtained
 * from this transformation.
 * @method mergeMap
 * @owner Observable
 */
function mergeMap(project, resultSelector, concurrent) {
    if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
    return function mergeMapOperatorFunction(source) {
        if (typeof resultSelector === 'number') {
            concurrent = resultSelector;
            resultSelector = null;
        }
        return source.lift(new MergeMapOperator(project, resultSelector, concurrent));
    };
}
exports.mergeMap = mergeMap;
var MergeMapOperator = (function () {
    function MergeMapOperator(project, resultSelector, concurrent) {
        if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
        this.project = project;
        this.resultSelector = resultSelector;
        this.concurrent = concurrent;
    }
    MergeMapOperator.prototype.call = function (observer, source) {
        return source.subscribe(new MergeMapSubscriber(observer, this.project, this.resultSelector, this.concurrent));
    };
    return MergeMapOperator;
}());
exports.MergeMapOperator = MergeMapOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var MergeMapSubscriber = (function (_super) {
    __extends(MergeMapSubscriber, _super);
    function MergeMapSubscriber(destination, project, resultSelector, concurrent) {
        if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
        _super.call(this, destination);
        this.project = project;
        this.resultSelector = resultSelector;
        this.concurrent = concurrent;
        this.hasCompleted = false;
        this.buffer = [];
        this.active = 0;
        this.index = 0;
    }
    MergeMapSubscriber.prototype._next = function (value) {
        if (this.active < this.concurrent) {
            this._tryNext(value);
        }
        else {
            this.buffer.push(value);
        }
    };
    MergeMapSubscriber.prototype._tryNext = function (value) {
        var result;
        var index = this.index++;
        try {
            result = this.project(value, index);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.active++;
        this._innerSub(result, value, index);
    };
    MergeMapSubscriber.prototype._innerSub = function (ish, value, index) {
        this.add(subscribeToResult_1.subscribeToResult(this, ish, value, index));
    };
    MergeMapSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (this.active === 0 && this.buffer.length === 0) {
            this.destination.complete();
        }
    };
    MergeMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        if (this.resultSelector) {
            this._notifyResultSelector(outerValue, innerValue, outerIndex, innerIndex);
        }
        else {
            this.destination.next(innerValue);
        }
    };
    MergeMapSubscriber.prototype._notifyResultSelector = function (outerValue, innerValue, outerIndex, innerIndex) {
        var result;
        try {
            result = this.resultSelector(outerValue, innerValue, outerIndex, innerIndex);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    MergeMapSubscriber.prototype.notifyComplete = function (innerSub) {
        var buffer = this.buffer;
        this.remove(innerSub);
        this.active--;
        if (buffer.length > 0) {
            this._next(buffer.shift());
        }
        else if (this.active === 0 && this.hasCompleted) {
            this.destination.complete();
        }
    };
    return MergeMapSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
exports.MergeMapSubscriber = MergeMapSubscriber;
//# sourceMappingURL=mergeMap.js.map

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var root_1 = __webpack_require__(2);
var isArrayLike_1 = __webpack_require__(43);
var isPromise_1 = __webpack_require__(44);
var isObject_1 = __webpack_require__(6);
var Observable_1 = __webpack_require__(0);
var iterator_1 = __webpack_require__(45);
var InnerSubscriber_1 = __webpack_require__(46);
var observable_1 = __webpack_require__(10);
function subscribeToResult(outerSubscriber, result, outerValue, outerIndex) {
    var destination = new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex);
    if (destination.closed) {
        return null;
    }
    if (result instanceof Observable_1.Observable) {
        if (result._isScalar) {
            destination.next(result.value);
            destination.complete();
            return null;
        }
        else {
            destination.syncErrorThrowable = true;
            return result.subscribe(destination);
        }
    }
    else if (isArrayLike_1.isArrayLike(result)) {
        for (var i = 0, len = result.length; i < len && !destination.closed; i++) {
            destination.next(result[i]);
        }
        if (!destination.closed) {
            destination.complete();
        }
    }
    else if (isPromise_1.isPromise(result)) {
        result.then(function (value) {
            if (!destination.closed) {
                destination.next(value);
                destination.complete();
            }
        }, function (err) { return destination.error(err); })
            .then(null, function (err) {
            // Escaping the Promise trap: globally throw unhandled errors
            root_1.root.setTimeout(function () { throw err; });
        });
        return destination;
    }
    else if (result && typeof result[iterator_1.iterator] === 'function') {
        var iterator = result[iterator_1.iterator]();
        do {
            var item = iterator.next();
            if (item.done) {
                destination.complete();
                break;
            }
            destination.next(item.value);
            if (destination.closed) {
                break;
            }
        } while (true);
    }
    else if (result && typeof result[observable_1.observable] === 'function') {
        var obs = result[observable_1.observable]();
        if (typeof obs.subscribe !== 'function') {
            destination.error(new TypeError('Provided object does not correctly implement Symbol.observable'));
        }
        else {
            return obs.subscribe(new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex));
        }
    }
    else {
        var value = isObject_1.isObject(result) ? 'an invalid object' : "'" + result + "'";
        var msg = ("You provided " + value + " where a stream was expected.")
            + ' You can provide an Observable, Promise, Array, or Iterable.';
        destination.error(new TypeError(msg));
    }
    return null;
}
exports.subscribeToResult = subscribeToResult;
//# sourceMappingURL=subscribeToResult.js.map

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.isArrayLike = (function (x) { return x && typeof x.length === 'number'; });
//# sourceMappingURL=isArrayLike.js.map

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function isPromise(value) {
    return value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
}
exports.isPromise = isPromise;
//# sourceMappingURL=isPromise.js.map

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var root_1 = __webpack_require__(2);
function symbolIteratorPonyfill(root) {
    var Symbol = root.Symbol;
    if (typeof Symbol === 'function') {
        if (!Symbol.iterator) {
            Symbol.iterator = Symbol('iterator polyfill');
        }
        return Symbol.iterator;
    }
    else {
        // [for Mozilla Gecko 27-35:](https://mzl.la/2ewE1zC)
        var Set_1 = root.Set;
        if (Set_1 && typeof new Set_1()['@@iterator'] === 'function') {
            return '@@iterator';
        }
        var Map_1 = root.Map;
        // required for compatability with es6-shim
        if (Map_1) {
            var keys = Object.getOwnPropertyNames(Map_1.prototype);
            for (var i = 0; i < keys.length; ++i) {
                var key = keys[i];
                // according to spec, Map.prototype[@@iterator] and Map.orototype.entries must be equal.
                if (key !== 'entries' && key !== 'size' && Map_1.prototype[key] === Map_1.prototype['entries']) {
                    return key;
                }
            }
        }
        return '@@iterator';
    }
}
exports.symbolIteratorPonyfill = symbolIteratorPonyfill;
exports.iterator = symbolIteratorPonyfill(root_1.root);
/**
 * @deprecated use iterator instead
 */
exports.$$iterator = exports.iterator;
//# sourceMappingURL=iterator.js.map

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = __webpack_require__(4);
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var InnerSubscriber = (function (_super) {
    __extends(InnerSubscriber, _super);
    function InnerSubscriber(parent, outerValue, outerIndex) {
        _super.call(this);
        this.parent = parent;
        this.outerValue = outerValue;
        this.outerIndex = outerIndex;
        this.index = 0;
    }
    InnerSubscriber.prototype._next = function (value) {
        this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
    };
    InnerSubscriber.prototype._error = function (error) {
        this.parent.notifyError(error, this);
        this.unsubscribe();
    };
    InnerSubscriber.prototype._complete = function () {
        this.parent.notifyComplete(this);
        this.unsubscribe();
    };
    return InnerSubscriber;
}(Subscriber_1.Subscriber));
exports.InnerSubscriber = InnerSubscriber;
//# sourceMappingURL=InnerSubscriber.js.map

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = __webpack_require__(4);
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var OuterSubscriber = (function (_super) {
    __extends(OuterSubscriber, _super);
    function OuterSubscriber() {
        _super.apply(this, arguments);
    }
    OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(innerValue);
    };
    OuterSubscriber.prototype.notifyError = function (error, innerSub) {
        this.destination.error(error);
    };
    OuterSubscriber.prototype.notifyComplete = function (innerSub) {
        this.destination.complete();
    };
    return OuterSubscriber;
}(Subscriber_1.Subscriber));
exports.OuterSubscriber = OuterSubscriber;
//# sourceMappingURL=OuterSubscriber.js.map

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var generic_instrument_1 = __webpack_require__(1);
var logger_digital_channel_1 = __webpack_require__(49);
var logger_command_1 = __webpack_require__(12);
var LoggerDigitalInstrument = /** @class */ (function (_super) {
    __extends(LoggerDigitalInstrument, _super);
    function LoggerDigitalInstrument(_transport, _loggerInstrumentDescriptor) {
        var _this = _super.call(this, _transport, '/') || this;
        _this.chans = [];
        _this.numChans = 0;
        _this.fileFormat = -1;
        _this.fileRevision = -1;
        _this.loggerCommand = new logger_command_1.LoggerCommand(_this);
        if (_loggerInstrumentDescriptor == undefined) {
            return _this;
        }
        _this.fileFormat = _loggerInstrumentDescriptor.fileFormat;
        _this.fileRevision = _loggerInstrumentDescriptor.fileRevision;
        //Populate logger digital supply parameters
        _this.numChans = _loggerInstrumentDescriptor.numChans;
        //Populate channels        
        for (var key in _loggerInstrumentDescriptor) {
            if (key !== 'numChans') {
                _this.chans.push(new logger_digital_channel_1.LoggerDigitalChannel(_loggerInstrumentDescriptor[key]));
            }
        }
        return _this;
    }
    LoggerDigitalInstrument.prototype.setParameters = function (chans, maxSampleCounts, sampleFreqs, startDelays, overflows, storageLocations, uris, bitMasks) {
        return this.loggerCommand.digitalSetParameters(chans, maxSampleCounts, sampleFreqs, startDelays, overflows, storageLocations, uris, bitMasks);
    };
    LoggerDigitalInstrument.prototype.run = function (instrument, chans) {
        return this.loggerCommand.run('digital', chans);
    };
    LoggerDigitalInstrument.prototype.stop = function (instrument, chans) {
        return this.loggerCommand.stop('digital', chans);
    };
    LoggerDigitalInstrument.prototype.read = function (instrument, chans, startIndices, counts) {
        return this.loggerCommand.read('digital', chans, startIndices, counts);
    };
    LoggerDigitalInstrument.prototype.getCurrentState = function (instrument, chans) {
        return this.loggerCommand.getCurrentState('digital', chans);
    };
    return LoggerDigitalInstrument;
}(generic_instrument_1.GenericInstrument));
exports.LoggerDigitalInstrument = LoggerDigitalInstrument;
//# sourceMappingURL=logger-digital-instrument.js.map

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var LoggerDigitalChannel = /** @class */ (function () {
    function LoggerDigitalChannel(loggerChannelDescriptor) {
        this.resolution = 0;
        this.effectiveBits = 0;
        this.bufferSizeMax = 0;
        this.fileSamplesMax = 0;
        this.sampleDataType = "I16";
        this.sampleFreqUnits = 0;
        this.sampleFreqMin = 0;
        this.sampleFreqMax = 0;
        this.delayUnits = 0;
        this.delayMax = 0;
        this.delayMin = 0;
        this.voltageUnits = 0;
        this.inputVoltageMax = 0;
        this.inputVoltageMin = 0;
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
    return LoggerDigitalChannel;
}());
exports.LoggerDigitalChannel = LoggerDigitalChannel;
//# sourceMappingURL=logger-digital-channel.js.map

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = __webpack_require__(0);
var command_utility_1 = __webpack_require__(3);
var File = /** @class */ (function () {
    function File(transport) {
        this.transport = transport;
        this.commandUtil = new command_utility_1.CommandUtility();
    }
    //Set the output voltage of the specified DC power supply channel.
    File.prototype.write = function (location, path, file, filePosition) {
        var _this = this;
        filePosition = filePosition == undefined ? 0 : filePosition;
        var command = {
            file: [{
                    command: 'write',
                    type: location,
                    path: path,
                    filePosition: filePosition,
                    binaryOffset: 0,
                    binaryLength: file.byteLength
                }]
        };
        return Observable_1.Observable.create(function (observer) {
            var dataToSend = _this.commandUtil.createChunkedArrayBuffer(command, file);
            _this.transport.writeRead('/', dataToSend, 'binary').subscribe(function (arrayBuffer) {
                var data;
                try {
                    var stringify = String.fromCharCode.apply(null, new Uint8Array(arrayBuffer.slice(0)));
                    data = JSON.parse(stringify);
                }
                catch (e) {
                    observer.error(e);
                    return;
                }
                if (data == undefined || data.agent != undefined) {
                    observer.error(data);
                    return;
                }
                if (data.file == undefined || data.file[0] == undefined || data.file[0].statusCode !== 0) {
                    observer.error(data);
                    return;
                }
                observer.next(data);
                observer.complete();
            }, function (err) {
                observer.error(err);
            }, function () {
                observer.complete();
            });
        });
    };
    File.prototype.listDir = function (location, path) {
        var command = {
            file: [{
                    command: 'listdir',
                    type: location,
                    path: path
                }]
        };
        return this.genericResponse(command);
    };
    File.prototype.getFileSize = function (location, path) {
        var command = {
            file: [{
                    command: 'getFileSize',
                    type: location,
                    path: path
                }]
        };
        return this.genericResponse(command);
    };
    File.prototype.delete = function (location, path) {
        var command = {
            file: [{
                    command: 'delete',
                    type: location,
                    path: path
                }]
        };
        return this.genericResponse(command);
    };
    //Set the output voltage of the specified DC power supply channel.
    File.prototype.read = function (location, path, filePosition, length, timeoutOverride) {
        var _this = this;
        var command = {
            file: [{
                    command: 'read',
                    type: location,
                    path: path,
                    filePosition: filePosition,
                    requestedLength: length
                }]
        };
        return Observable_1.Observable.create(function (observer) {
            _this.transport.writeRead('/', JSON.stringify(command), 'json', timeoutOverride).subscribe(function (arrayBuffer) {
                _this.commandUtil.observableParseChunkedTransfer(arrayBuffer, 'u8').subscribe(function (data) {
                    var jsonObject = data.json;
                    var binaryData = data.typedArray;
                    if (data == undefined || data.agent != undefined) {
                        observer.error(data);
                        return;
                    }
                    if (jsonObject.file == undefined || jsonObject.file[0] == undefined || jsonObject.file[0].statusCode !== 0) {
                        observer.error(data);
                        return;
                    }
                    observer.next({
                        jsonObject: jsonObject,
                        file: _this.safeStringBinary(binaryData)
                    });
                    observer.complete();
                }, function (err) {
                    observer.error(err);
                }, function () { });
            }, function (err) {
                observer.error(err);
            }, function () {
                observer.complete();
            });
        });
    };
    File.prototype.safeStringBinary = function (binaryData) {
        var returnString = '';
        for (var i = 0; i < binaryData.length; i++) {
            returnString += String.fromCharCode(binaryData[i]);
        }
        return returnString;
    };
    File.prototype.genericResponse = function (command) {
        var _this = this;
        return Observable_1.Observable.create(function (observer) {
            _this.transport.writeRead('/', JSON.stringify(command), 'json').subscribe(function (arrayBuffer) {
                var data;
                try {
                    var stringify = String.fromCharCode.apply(null, new Uint8Array(arrayBuffer.slice(0)));
                    data = JSON.parse(stringify);
                }
                catch (e) {
                    observer.error(e);
                    return;
                }
                if (data == undefined || data.agent != undefined) {
                    observer.error(data);
                    return;
                }
                if (data.file == undefined || data.file[0] == undefined || data.file[0].statusCode !== 0) {
                    observer.error(data);
                    return;
                }
                observer.next(data);
                observer.complete();
            }, function (err) {
                observer.error(err);
            }, function () {
                observer.complete();
            });
        });
    };
    return File;
}());
exports.File = File;
//# sourceMappingURL=file.js.map

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = __webpack_require__(0);
var generic_transport_1 = __webpack_require__(14);
var HttpTransport = /** @class */ (function (_super) {
    __extends(HttpTransport, _super);
    function HttpTransport(_rootUri, timeout) {
        var _this = _super.call(this) || this;
        _this.timeoutMinMs = 500;
        _this.timeoutMaxMs = 86400000; //One day should be enough...
        console.log('Transport HTTP Contructor');
        _this.rootUri = _rootUri;
        _this.streamState = {
            mode: 'off',
            remainingSamples: 0
        };
        _this.timeout = _this.forceRange(timeout, _this.timeoutMinMs, _this.timeoutMaxMs);
        return _this;
    }
    HttpTransport.prototype.getUri = function () {
        return this.rootUri;
    };
    HttpTransport.prototype.setTimeout = function (newTimeout) {
        this.timeout = this.forceRange(newTimeout, this.timeoutMinMs, this.timeoutMaxMs);
    };
    HttpTransport.prototype.forceRange = function (val, min, max) {
        return Math.min(Math.max(min, val), max);
    };
    HttpTransport.prototype.getRequest = function (requestUrl, timeout) {
        var _this = this;
        timeout = timeout == undefined ? this.timeout : this.forceRange(timeout, this.timeoutMinMs, this.timeoutMaxMs);
        return Observable_1.Observable.create(function (observer) {
            var XHR = new XMLHttpRequest();
            XHR.addEventListener("load", function (event) {
                _this.finish = performance.now();
                console.log('from start to fin');
                console.log(_this.finish - _this.start);
                observer.next(event.currentTarget.response);
                observer.complete();
            });
            XHR.addEventListener("error", function (event) {
                observer.error('Get Request Error', event);
            });
            XHR.addEventListener("timeout", function (event) {
                observer.error('Timeout', event);
            });
            try {
                XHR.open("GET", requestUrl);
                XHR.timeout = timeout;
                XHR.send();
                _this.start = performance.now();
                console.log('command sent');
            }
            catch (err) {
                observer.error('TX Error: ', event);
            }
        });
    };
    //Data transmission wrapper to avoid duplicate code. 
    HttpTransport.prototype.writeRead = function (endpoint, sendData, dataType, timeoutOverride) {
        return this.writeReadHelper(this.rootUri, endpoint, sendData, dataType, timeoutOverride);
    };
    HttpTransport.prototype.writeReadHelper = function (rootUri, endpoint, sendData, dataType, timeout) {
        var _this = this;
        var uri = rootUri + endpoint;
        var body = sendData;
        timeout = timeout == undefined ? this.timeout : this.forceRange(timeout, this.timeoutMinMs, this.timeoutMaxMs);
        console.log(body);
        return Observable_1.Observable.create(function (observer) {
            var XHR = new XMLHttpRequest();
            // We define what will happen if the data are successfully sent
            XHR.addEventListener("load", function (event) {
                _this.finish = performance.now();
                console.log('from start to fin');
                console.log(_this.finish - _this.start);
                observer.next(event.currentTarget.response);
                observer.complete();
            });
            // We define what will happen in case of error
            XHR.addEventListener("error", function (event) {
                observer.error('TX Error: ', event);
            });
            XHR.addEventListener("timeout", function (event) {
                observer.error('HTTP Timeout: ', event);
            });
            // We set up our request
            try {
                XHR.open("POST", uri);
                if (dataType === 'json') {
                    XHR.setRequestHeader("Content-Type", "application/json");
                }
                else if (dataType === 'binary') {
                    XHR.setRequestHeader("Content-Type", "application/octet-stream");
                }
                XHR.timeout = timeout;
                //Set resposne type as arraybuffer to receive response as bytes
                XHR.responseType = 'arraybuffer';
                XHR.send(body);
                _this.start = performance.now();
                console.log('command sent');
            }
            catch (err) {
                observer.error('TX Error: ', event);
            }
        });
    };
    //Stream via back to back xhr calls
    HttpTransport.prototype.streamFrom = function (endpoint, sendData, dataType, delay) {
        var _this = this;
        if (delay === void 0) { delay = 0; }
        this.streamState.mode = 'continuous';
        return Observable_1.Observable.create(function (observer) {
            var i = 0;
            var getData = function (writeReadHelper, streamState, rootUri, endpoint, sendData, delay) {
                writeReadHelper(rootUri, endpoint, sendData).subscribe(function (data) {
                    //console.log('Inner Read ', i, ' >> ', data);
                    observer.next(data);
                }, function (err) {
                    console.log(err);
                }, function () {
                    i++;
                    if (streamState.mode == 'continuous') {
                        //Wrap getData in anaonymous function to allow passing parameters to setTimeout handler
                        setTimeout(function () {
                            getData(writeReadHelper, streamState, rootUri, endpoint, sendData, delay);
                        }, delay);
                    }
                    else {
                        observer.complete();
                    }
                });
            };
            getData(_this.writeReadHelper, _this.streamState, _this.rootUri, endpoint, sendData, delay);
        });
    };
    //Sets stream to off
    HttpTransport.prototype.stopStream = function () {
        this.streamState.mode = 'off';
    };
    //Get transport type
    HttpTransport.prototype.getType = function () {
        return 'http';
    };
    return HttpTransport;
}(generic_transport_1.GenericTransport));
exports.HttpTransport = HttpTransport;
//# sourceMappingURL=http-transport.js.map

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = __webpack_require__(0);
var generic_transport_1 = __webpack_require__(14);
var simulated_device_1 = __webpack_require__(53);
var LocalTransport = /** @class */ (function (_super) {
    __extends(LocalTransport, _super);
    function LocalTransport(deviceEnumeration) {
        var _this = _super.call(this) || this;
        _this.streamState = {
            mode: 'off',
            remainingSamples: 0
        };
        _this.simulatedDevice = new simulated_device_1.SimulatedDevice(deviceEnumeration);
        return _this;
    }
    LocalTransport.prototype.getUri = function () {
        return this.rootUri;
    };
    LocalTransport.prototype.setTimeout = function (newTimeout) { };
    LocalTransport.prototype.getRequest = function (requestUrl, timeout) {
        return Observable_1.Observable.create(function (observer) {
            observer.error('Local transport does not support get requests');
        });
    };
    //Data transmission wrapper to avoid duplicate code. 
    LocalTransport.prototype.writeRead = function (endpoint, sendData, dataType) {
        return this.writeReadHelper(this.rootUri, endpoint, sendData, dataType);
    };
    LocalTransport.prototype.writeReadHelper = function (rootUri, endpoint, sendData, dataType) {
        var _this = this;
        var body = sendData;
        return Observable_1.Observable.create(function (observer) {
            _this.simulatedDevice.send(body).subscribe(function (data) {
                observer.next(data);
            }, function (err) {
                observer.error(err);
            }, function () {
            });
        });
    };
    //Stream via back to back xhr calls
    LocalTransport.prototype.streamFrom = function (endpoint, sendData, dataType, delay) {
        var _this = this;
        if (delay === void 0) { delay = 0; }
        this.streamState.mode = 'continuous';
        return Observable_1.Observable.create(function (observer) {
            var i = 0;
            var getData = function (writeReadHelper, streamState, rootUri, endpoint, sendData, delay) {
                writeReadHelper(rootUri, endpoint, sendData).subscribe(function (data) {
                    observer.next(data);
                }, function (err) {
                    observer.error(err);
                    return;
                }, function () {
                    i++;
                    if (streamState.mode == 'continuous') {
                        //Wrap getData in anaonymous function to allow passing parameters to setTimeout handler
                        setTimeout(function () {
                            getData(writeReadHelper, streamState, rootUri, endpoint, sendData, delay);
                        }, delay);
                    }
                    else {
                        observer.complete();
                    }
                });
            };
            getData(_this.writeReadHelper, _this.streamState, _this.rootUri, endpoint, sendData, delay);
        });
    };
    //Sets stream to off
    LocalTransport.prototype.stopStream = function () {
        this.streamState.mode = 'off';
    };
    //Get transport type
    LocalTransport.prototype.getType = function () {
        return 'local';
    };
    return LocalTransport;
}(generic_transport_1.GenericTransport));
exports.LocalTransport = LocalTransport;
//# sourceMappingURL=local-transport.js.map

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = __webpack_require__(0);
var simulated_awg_1 = __webpack_require__(54);
var simulated_dc_1 = __webpack_require__(55);
var simulated_osc_1 = __webpack_require__(56);
var simulated_trigger_1 = __webpack_require__(57);
var simulated_la_1 = __webpack_require__(58);
var simulated_gpio_1 = __webpack_require__(59);
var simulated_device_helper_1 = __webpack_require__(60);
var command_utility_1 = __webpack_require__(3);
var SimulatedDevice = /** @class */ (function () {
    function SimulatedDevice(enumeration) {
        this.descriptor = enumeration;
        this.commandUtility = new command_utility_1.CommandUtility();
        this.simDev = new simulated_device_helper_1.SimulatedDeviceHelper();
        this.simDev.setEnumeration(this.descriptor);
        this.awg = new simulated_awg_1.SimulatedAwg(this.simDev);
        this.dc = new simulated_dc_1.SimulatedDc(this.simDev);
        this.osc = new simulated_osc_1.SimulatedOsc(this.simDev);
        this.trigger = new simulated_trigger_1.SimulatedTrigger(this.simDev);
        this.la = new simulated_la_1.SimulatedLa(this.simDev);
        this.gpio = new simulated_gpio_1.SimulatedGpio(this.simDev);
    }
    SimulatedDevice.prototype.send = function (command) {
        var _this = this;
        return Observable_1.Observable.create(function (observer) {
            observer.next(_this.parseCommand(JSON.parse(command)));
            observer.complete();
        });
    };
    SimulatedDevice.prototype.parseCommand = function (event) {
        var _this = this;
        var responseObject = {};
        var sumStatusCode = 0;
        var binaryDataFlag = 0;
        var _loop_1 = function (instrument) {
            //create property on response object
            responseObject[instrument] = {};
            if (event[instrument][0] !== undefined && event[instrument][0].command !== undefined) {
                if (instrument === 'device') {
                    responseObject[instrument] = [];
                    var activeIndex = responseObject[instrument].push(this_1.processCommands(instrument, event[instrument][0], [])) - 1;
                    sumStatusCode += responseObject[instrument][activeIndex].statusCode;
                }
                else {
                    responseObject[instrument] = this_1.processCommands(instrument, event[instrument][0], []);
                    sumStatusCode += responseObject[instrument].statusCode;
                }
            }
            var _loop_2 = function (channel) {
                if (event[instrument][channel][0] !== undefined) {
                    //create property on response object 
                    responseObject[instrument][channel] = [];
                    event[instrument][channel].forEach(function (element, index, array) {
                        responseObject[instrument][channel].push(_this.processCommands(instrument, event[instrument][channel][index], [channel])) - 1;
                        if (element.command === 'read' && instrument !== 'gpio') {
                            binaryDataFlag = 1;
                        }
                    });
                }
            };
            for (var channel in event[instrument]) {
                _loop_2(channel);
            }
        };
        var this_1 = this;
        for (var instrument in event) {
            _loop_1(instrument);
        }
        if (binaryDataFlag) {
            return this.processBinaryDataAndSend(responseObject);
        }
        else {
            var response = JSON.stringify(responseObject);
            var buf = new ArrayBuffer(response.length);
            var bufView = new Uint8Array(buf);
            for (var i = 0; i < response.length; i++) {
                bufView[i] = response.charCodeAt(i);
            }
            return bufView.buffer;
        }
    };
    SimulatedDevice.prototype.processCommands = function (instrument, commandObject, params) {
        var command = instrument + commandObject.command;
        switch (command) {
            //---------- Device ----------
            case 'deviceenumerate':
                return this.descriptor;
            //---------- AWG ----------            
            case 'awgsetArbitraryWaveform':
                return this.awg.setArbitraryWaveform(params[0]);
            case 'awgsetRegularWaveform':
                return this.awg.setRegularWaveform(params[0], commandObject);
            case 'awgrun':
                return this.awg.run(params[0]);
            case 'awgstop':
                return this.awg.stop(params[0]);
            //---------- DC ----------        
            case 'dcsetVoltage':
                return this.dc.setVoltage(params[0], commandObject.voltage);
            case 'dcgetVoltage':
                return this.dc.getVoltage(params[0]);
            //---------- GPIO ----------        
            case 'gpiowrite':
                return this.gpio.write(params[0], commandObject.value);
            case 'gpioread':
                return this.gpio.read(params[0]);
            case 'gpiosetParameters':
                return this.gpio.setParameters(params[0], commandObject.direction);
            //-------- TRIGGER --------
            case 'triggersetParameters':
                return this.trigger.setParameters(params[0], commandObject.source, commandObject.targets);
            case 'triggersingle':
                return this.trigger.single();
            case 'triggerforceTrigger':
                return this.trigger.forceTrigger();
            case 'triggerstop':
                return this.trigger.stop();
            //---------- OSC ----------            
            case 'oscsetParameters':
                return this.osc.setParameters(params[0], commandObject);
            case 'oscread':
                return this.osc.read(params[0]);
            //---------- LA ----------            
            case 'lasetParameters':
                return this.la.setParameters(params[0], commandObject);
            case 'laread':
                return this.la.read(params[0]);
            default:
                return {
                    statusCode: 1,
                    errorMessage: 'Not a recognized command'
                };
        }
    };
    SimulatedDevice.prototype.processBinaryDataAndSend = function (commandObject) {
        var binaryDataContainer = {};
        var binaryOffset = 0;
        for (var instrument in this.trigger.targets) {
            if (instrument === 'osc' && commandObject[instrument] != undefined) {
                binaryDataContainer['osc'] = {};
                for (var channel in commandObject[instrument]) {
                    binaryDataContainer.osc[channel] = commandObject[instrument][channel][0].y;
                    commandObject[instrument][channel][0].binaryOffset = binaryOffset;
                    binaryOffset += commandObject[instrument][channel][0].binaryLength;
                    delete commandObject[instrument][channel][0].y;
                }
            }
            if (instrument === 'la' && commandObject[instrument] != undefined) {
                binaryDataContainer['la'] = {};
                var initialIteration = true;
                for (var channel in commandObject[instrument]) {
                    commandObject[instrument][channel][0].binaryOffset = binaryOffset;
                    if (initialIteration) {
                        initialIteration = false;
                        binaryDataContainer.la[channel] = commandObject[instrument][channel][0].y;
                        binaryOffset += commandObject[instrument][channel][0].binaryLength;
                    }
                    delete commandObject[instrument][channel][0].y;
                }
            }
        }
        var buf = new ArrayBuffer(binaryOffset);
        var bufView = new Uint8Array(buf);
        var binaryInjectorIndex = 0;
        var prevLength = 0;
        for (var instrument in binaryDataContainer) {
            for (var channel in binaryDataContainer[instrument]) {
                var unsignedConversion = new Uint8Array(binaryDataContainer[instrument][channel].buffer);
                binaryInjectorIndex += prevLength + unsignedConversion.length;
                for (var i = prevLength, j = 0; i < binaryInjectorIndex; i = i + 2, j = j + 2) {
                    bufView[i] = unsignedConversion[j];
                    bufView[i + 1] = unsignedConversion[j + 1];
                }
                prevLength = unsignedConversion.length;
                if (instrument === 'la') {
                    break;
                }
            }
        }
        return this.commandUtility.createChunkedArrayBuffer(commandObject, bufView.buffer).buffer;
    };
    return SimulatedDevice;
}());
exports.SimulatedDevice = SimulatedDevice;
//# sourceMappingURL=simulated-device.js.map

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SimulatedAwg = /** @class */ (function () {
    function SimulatedAwg(_simulatedDevice) {
        this.signalTypes = ['', '', '', '', '', '', '', ''];
        this.signalFreqs = [0, 0, 0, 0, 0, 0, 0, 0];
        this.vpps = [0, 0, 0, 0, 0, 0, 0, 0];
        this.vOffsets = [0, 0, 0, 0, 0, 0, 0, 0];
        this.simulatedDevice = _simulatedDevice;
    }
    SimulatedAwg.prototype.setArbitraryWaveform = function (chan) {
        return {
            statusCode: 0,
            wait: 0
        };
    };
    SimulatedAwg.prototype.setRegularWaveform = function (chan, commandObject) {
        this.signalTypes[chan] = commandObject.signalType;
        this.signalFreqs[chan] = commandObject.signalFreq;
        this.vpps[chan] = commandObject.vpp;
        this.vOffsets[chan] = commandObject.vOffset;
        this.simulatedDevice.setAwgSettings(commandObject, chan);
        return {
            "command": "setRegularWaveform",
            "statusCode": 0,
            "actualSignalFreq": commandObject.signalFreq,
            "actualVpp": commandObject.vpp,
            "actualVOffset": commandObject.vOffset,
            "wait": 0
        };
    };
    SimulatedAwg.prototype.run = function (chan) {
        this.simulatedDevice.setTriggerArmed(true);
        return {
            "command": "run",
            "statusCode": 0,
            "wait": 0
        };
    };
    SimulatedAwg.prototype.stop = function (chan) {
        this.simulatedDevice.setTriggerArmed(false);
        return {
            "command": "stop",
            "statusCode": 0,
            "wait": 0
        };
    };
    return SimulatedAwg;
}());
exports.SimulatedAwg = SimulatedAwg;
//# sourceMappingURL=simulated-awg.js.map

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SimulatedDc = /** @class */ (function () {
    function SimulatedDc(_simulatedDevice) {
        this.voltages = [0, 0, 0, 0, 0, 0, 0, 0];
        this.simulatedDevice = _simulatedDevice;
    }
    SimulatedDc.prototype.getVoltage = function (_chan) {
        return {
            command: 'getVoltage',
            voltage: this.voltages[_chan],
            statusCode: 0,
            wait: 100
        };
    };
    SimulatedDc.prototype.setVoltage = function (_chan, _voltage) {
        this.voltages[_chan] = _voltage;
        return {
            command: 'setVoltage',
            statusCode: 0,
            wait: 0
        };
    };
    return SimulatedDc;
}());
exports.SimulatedDc = SimulatedDc;
//# sourceMappingURL=simulated-dc.js.map

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SimulatedOsc = /** @class */ (function () {
    function SimulatedOsc(_simulatedDevice) {
        this.buffers = [
            [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000],
            [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000],
            [],
            [],
            [],
            []
        ];
        this.offsets = [0, 0, 0];
        this.gains = [1, 1, 1];
        this.sampleFreqs = [0, 0, 0, 0, 0, 0, 0];
        this.bufferSizes = [0, 0, 0, 0, 0, 0, 0];
        this.delays = [0, 0, 0, 0, 0, 0, 0, 0];
        this.defaultAwgSettings = {
            signalType: 'sine',
            signalFreq: 1000000,
            vpp: 3000,
            vOffset: 0
        };
        this.defaultOscSettings = {
            sampleFreq: 3000000,
            bufferSize: 10000
        };
        this.simulatedDevice = _simulatedDevice;
    }
    SimulatedOsc.prototype.setParameters = function (chan, commandObject) {
        this.offsets[chan] = commandObject.offset;
        this.gains[chan] = commandObject.gain;
        this.sampleFreqs[chan] = commandObject.sampleFreq;
        this.bufferSizes[chan] = commandObject.bufferSize;
        this.delays[chan] = commandObject.triggerDelay;
        this.simulatedDevice.setOscParameters(commandObject, chan);
        return {
            "command": "setParameters",
            "actualOffset": commandObject.offset,
            "actualSampleFreq": commandObject.sampleFreq,
            "statusCode": 0,
            "wait": 0
        };
    };
    SimulatedOsc.prototype.read = function (chan) {
        var targets = this.simulatedDevice.getTriggerTargets();
        var returnInfo = {};
        if (targets.osc.indexOf(parseInt(chan)) !== -1) {
            var awgSettings = this.simulatedDevice.getAwgSettings(1);
            var oscSettings = this.simulatedDevice.getOscParameters(chan);
            if (!this.simulatedDevice.getTriggerArmed()) {
                returnInfo = this.drawDefault();
            }
            else {
                if (awgSettings.signalType === 'sine') {
                    returnInfo = this.drawSine(awgSettings, oscSettings, chan);
                }
                else if (awgSettings.signalType === 'triangle') {
                    returnInfo = this.drawTriangle(awgSettings, oscSettings, chan);
                }
                else if (awgSettings.signalType === 'sawtooth') {
                    returnInfo = this.drawSawtooth(awgSettings, oscSettings, chan);
                }
                else if (awgSettings.signalType === 'square') {
                    returnInfo = this.drawSquare(awgSettings, oscSettings, chan);
                }
                else if (awgSettings.signalType === 'dc') {
                    returnInfo = this.drawDc(awgSettings, oscSettings, chan);
                }
                else {
                    console.log('drawing default wave');
                    returnInfo = this.drawDefault();
                }
            }
        }
        return returnInfo;
    };
    SimulatedOsc.prototype.drawDefault = function () {
        var numSamples = 32640;
        var sampleRate = 6250000000; //30 points per period
        var vOffset = 0; //in mV
        //Calculate dt - time between data points
        var dt = 1000 / sampleRate;
        //Clock time in seconds.  Rolls ever every hour.
        //Build Y point arrays
        var y = [];
        for (var j = 0; j < numSamples; j++) {
            y[j] = 0;
        }
        var typedArray = new Int16Array(y);
        return {
            command: "read",
            statusCode: 0,
            binaryLength: 2 * typedArray.length,
            binaryOffset: null,
            acqCount: 3,
            actualSampleFreq: 1000 / dt,
            y: typedArray,
            pointOfInterest: numSamples / 2,
            triggerIndex: numSamples / 2,
            triggerDelay: 0,
            actualVOffset: vOffset,
            actualGain: 1
        };
    };
    SimulatedOsc.prototype.drawSine = function (awgSettings, oscSettings, chan) {
        //---------- Simulate Signal ----------
        //Set default values
        var numSamples = oscSettings.bufferSize;
        var sigFreq = awgSettings.signalFreq; //in mHz
        var sampleRate = oscSettings.sampleFreq; //30 points per period
        var t0 = 0;
        var vOffset = awgSettings.vOffset; //in mV
        var vpp = awgSettings.vpp; //mV
        //Calculate dt - time between data points
        var dt = 1000 / sampleRate;
        var phase = ((parseInt(chan) - 1) * (90)) * (Math.PI / 180); //in radians
        //Clock time in seconds.  Rolls ever every hour.
        //Build Y point arrays
        var y = [];
        for (var j = 0; j < numSamples; j++) {
            y[j] = (vpp / 2) * (Math.sin((2 * Math.PI * (sigFreq / 1000)) * dt * j + t0 + phase)) + vOffset;
        }
        var typedArray = new Int16Array(y);
        //length is 2x the array length because 2 bytes per entry
        return {
            command: "read",
            statusCode: 0,
            binaryLength: 2 * typedArray.length,
            binaryOffset: null,
            acqCount: 3,
            actualSampleFreq: 1000 / dt,
            y: typedArray,
            pointOfInterest: numSamples / 2,
            triggerIndex: numSamples / 2,
            triggerDelay: 0,
            actualVOffset: vOffset,
            actualGain: 1
        };
    };
    SimulatedOsc.prototype.drawSquare = function (awgSettings, oscSettings, chan) {
        //Set default values
        var numSamples = oscSettings.bufferSize; //ten thousand points 
        var sigFreq = awgSettings.signalFreq; //in mHz
        var sampleRate = oscSettings.sampleFreq; //30 points per period
        var t0 = 0;
        var vOffset = awgSettings.vOffset; //in mV
        var vpp = awgSettings.vpp; //mV
        var dutyCycle = 50;
        //Calculate dt - time between data points
        var dt = 1000 / sampleRate;
        var y = [];
        var period = 1 / (sigFreq / 1000);
        var phase = (parseInt(chan) - 1) * (period / 4);
        for (var i = 0; i < numSamples; i++) {
            if ((dt * i + t0 + phase) % period < period * (dutyCycle / 100)) {
                y[i] = (vOffset + vpp / 2);
            }
            else {
                y[i] = (vOffset - vpp / 2);
            }
        }
        var typedArray = new Int16Array(y);
        //length is 2x the array length because 2 bytes per entry
        return {
            command: "read",
            statusCode: 0,
            binaryLength: 2 * typedArray.length,
            binaryOffset: null,
            acqCount: 3,
            actualSampleFreq: 1000 / dt,
            y: typedArray,
            pointOfInterest: numSamples / 2,
            triggerIndex: numSamples / 2,
            triggerDelay: 0,
            actualVOffset: vOffset,
            actualGain: 1
        };
    };
    SimulatedOsc.prototype.drawTriangle = function (awgSettings, oscSettings, chan) {
        var numSamples = oscSettings.bufferSize; //ten thousand points 
        var sigFreq = awgSettings.signalFreq; //in mHz
        var sampleRate = oscSettings.sampleFreq; //30 points per period
        var t0 = 0;
        var vOffset = awgSettings.vOffset; //in mV
        var vpp = awgSettings.vpp; //mV
        //Calculate dt - time between data points
        var dt = 1000 / sampleRate;
        var y = [];
        var period = 1 / (sigFreq / 1000);
        var phase = (parseInt(chan) - 1) * (period / 4);
        for (var i = 0; i < numSamples; i++) {
            y[i] = ((4 * (vpp / 2)) / period) * (Math.abs(((i * dt + t0 + phase + 3 * period / 4) % period) - period / 2) - period / 4) + vOffset;
        }
        var typedArray = new Int16Array(y);
        //length is 2x the array length because 2 bytes per entry
        return {
            command: "read",
            statusCode: 0,
            binaryLength: 2 * typedArray.length,
            binaryOffset: null,
            acqCount: 3,
            actualSampleFreq: 1000 / dt,
            y: typedArray,
            pointOfInterest: numSamples / 2,
            triggerIndex: numSamples / 2,
            triggerDelay: 0,
            actualVOffset: vOffset,
            actualGain: 1
        };
    };
    SimulatedOsc.prototype.drawSawtooth = function (awgSettings, oscSettings, chan) {
        var numSamples = oscSettings.bufferSize; //ten thousand points 
        var sigFreq = awgSettings.signalFreq; //in mHz
        var sampleRate = oscSettings.sampleFreq; //30 points per period
        var t0 = 0;
        var vOffset = awgSettings.vOffset; //in mV
        var vpp = awgSettings.vpp; //mV
        //Calculate dt - time between data points
        var dt = 1000 / sampleRate;
        var y = [];
        var period = 1 / (sigFreq / 1000);
        var phase = (parseInt(chan) - 1) * (period / 4);
        for (var i = 0; i < numSamples; i++) {
            y[i] = (vpp / period) * ((dt * i + t0 + phase) % period) + vOffset;
        }
        var typedArray = new Int16Array(y);
        //length is 2x the array length because 2 bytes per entry
        return {
            command: "read",
            statusCode: 0,
            binaryLength: 2 * typedArray.length,
            binaryOffset: null,
            acqCount: 3,
            actualSampleFreq: 1000 / dt,
            y: typedArray,
            pointOfInterest: numSamples / 2,
            triggerIndex: numSamples / 2,
            triggerDelay: 0,
            actualVOffset: vOffset,
            actualGain: 1
        };
    };
    SimulatedOsc.prototype.drawDc = function (awgSettings, oscSettings, chan) {
        var numSamples = oscSettings.bufferSize; //ten thousand points
        var sampleRate = oscSettings.sampleFreq; //30 points per period
        var vOffset = awgSettings.vOffset; //in mV
        //Calculate dt - time between data points
        var dt = 1000 / sampleRate;
        var y = [];
        for (var i = 0; i < numSamples; i++) {
            y[i] = vOffset;
        }
        var typedArray = new Int16Array(y);
        return {
            command: "read",
            statusCode: 0,
            binaryLength: 2 * typedArray.length,
            binaryOffset: null,
            acqCount: 3,
            actualSampleFreq: 1000 / dt,
            y: typedArray,
            pointOfInterest: numSamples / 2,
            triggerIndex: numSamples / 2,
            triggerDelay: 0,
            actualVOffset: vOffset,
            actualGain: 1
        };
    };
    return SimulatedOsc;
}());
exports.SimulatedOsc = SimulatedOsc;
//# sourceMappingURL=simulated-osc.js.map

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SimulatedTrigger = /** @class */ (function () {
    function SimulatedTrigger(_simulatedDevice) {
        this.sources = [{
                "instrument": null,
                "channel": null,
                "type": null,
                "lowerThreshold": null,
                "upperThreshold": null
            }];
        this.targets = {};
        this.simulatedDevice = _simulatedDevice;
    }
    SimulatedTrigger.prototype.setParameters = function (chan, source, targets) {
        this.sources[chan] = source;
        this.targets = targets;
        this.simulatedDevice.setTriggerTargets(targets);
        return {
            "command": "setParameters",
            "statusCode": 0,
            "wait": 0
        };
    };
    SimulatedTrigger.prototype.single = function () {
        return {
            "command": "single",
            "statusCode": 0,
            "wait": -1,
            "acqCount": 27
        };
    };
    SimulatedTrigger.prototype.stop = function () {
        return {
            "command": "stop",
            "statusCode": 0,
            "wait": -1
        };
    };
    SimulatedTrigger.prototype.forceTrigger = function () {
        return {
            "command": "forceTrigger",
            "statusCode": 2684354589,
            "wait": -1
        };
    };
    return SimulatedTrigger;
}());
exports.SimulatedTrigger = SimulatedTrigger;
//# sourceMappingURL=simulated-trigger.js.map

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SimulatedLa = /** @class */ (function () {
    function SimulatedLa(_simulatedDevice) {
        this.buffers = [];
        this.sampleFreqs = [];
        this.bufferSizes = [];
        this.bitmasks = [];
        this.triggerDelays = [];
        this.simulatedDevice = _simulatedDevice;
        this.laDescriptor = this.simulatedDevice.getEnumeration().la;
        for (var i = 0; i < this.laDescriptor.numChans; i++) {
            this.buffers.push([]);
            this.sampleFreqs.push(0);
            this.bufferSizes.push(0);
            this.bitmasks.push(0);
            this.triggerDelays.push(0);
        }
    }
    SimulatedLa.prototype.getCurrentState = function (chan) {
        return {
            command: "getCurrentState",
            statusCode: 0,
            state: "idle",
            acqCount: 0,
            bitmask: this.bitmasks[chan],
            actualSampleFreq: this.sampleFreqs[chan],
            actualBufferSize: this.bufferSizes[chan],
            triggerDelay: this.triggerDelays[chan],
            wait: 0
        };
    };
    SimulatedLa.prototype.setParameters = function (chan, commandObject) {
        this.sampleFreqs[chan] = commandObject.sampleFreq;
        this.bufferSizes[chan] = commandObject.bufferSize;
        this.triggerDelays[chan] = commandObject.triggerDelay;
        this.bitmasks[chan] = commandObject.bitmask;
        this.simulatedDevice.setLaParameters(commandObject, chan);
        return {
            "command": "setParameters",
            "statusCode": 0,
            "actualSampleFreq": this.sampleFreqs[chan],
            "wait": 0
        };
    };
    SimulatedLa.prototype.read = function (chan) {
        return this.generateLaData(chan);
    };
    SimulatedLa.prototype.generateLaData = function (channel) {
        var maxBufferSize = Math.max.apply(Math, this.bufferSizes);
        var typedArray = new Int16Array(maxBufferSize);
        for (var i = 0; i < typedArray.length; i++) {
            typedArray[i] = i;
        }
        return {
            command: "read",
            statusCode: 0,
            wait: 0,
            binaryLength: 2 * typedArray.length,
            binaryOffset: null,
            acqCount: 3,
            bitmask: this.bitmasks[channel],
            actualSampleFreq: this.sampleFreqs[channel],
            y: typedArray,
            pointOfInterest: this.bufferSizes[channel] / 2,
            triggerIndex: this.bufferSizes[channel] / 2,
            actualTriggerDelay: this.triggerDelays[channel]
        };
    };
    return SimulatedLa;
}());
exports.SimulatedLa = SimulatedLa;
//# sourceMappingURL=simulated-la.js.map

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SimulatedGpio = /** @class */ (function () {
    function SimulatedGpio(_simulatedDevice) {
        this.values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.directions = ['input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'input'];
        this.counter = 1;
        this.prevChannel = -1;
        this.simulatedDevice = _simulatedDevice;
    }
    SimulatedGpio.prototype.counterVal = function (_chan) {
        if (parseInt(_chan) <= this.prevChannel) {
            this.counter++;
        }
        this.values[_chan] = (this.counter & Math.pow(2, _chan - 1)) > 0 ? 1 : 0;
        this.prevChannel = parseInt(_chan);
    };
    SimulatedGpio.prototype.read = function (_chan) {
        this.counterVal(_chan);
        return {
            command: 'read',
            value: this.values[_chan],
            direction: this.directions[_chan],
            statusCode: 0,
            wait: 100
        };
    };
    SimulatedGpio.prototype.write = function (_chan, _value) {
        this.values[_chan] = _value;
        return {
            command: 'write',
            statusCode: 0,
            wait: 500
        };
    };
    SimulatedGpio.prototype.setParameters = function (_chan, _direction) {
        this.values[_chan] = _direction;
        return {
            command: 'setParameters',
            statusCode: 0,
            wait: 100
        };
    };
    return SimulatedGpio;
}());
exports.SimulatedGpio = SimulatedGpio;
//# sourceMappingURL=simulated-gpio.js.map

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SimulatedDeviceHelper = /** @class */ (function () {
    function SimulatedDeviceHelper() {
        /*AWG Settings*/
        this.signalTypes = ['', '', '', '', '', '', '', ''];
        this.signalFreqs = [0, 0, 0, 0, 0, 0, 0, 0];
        this.vpps = [0, 0, 0, 0, 0, 0, 0, 0];
        this.vOffsets = [0, 0, 0, 0, 0, 0, 0, 0];
        /*Osc Parameters*/
        this.oscSampleFreqs = [0, 0, 0, 0, 0, 0, 0, 0];
        this.oscBufferSizes = [0, 0, 0, 0, 0, 0, 0, 0];
        this.laSampleFreqs = [0, 0, 0, 0, 0, 0, 0, 0];
        this.laBufferSizes = [0, 0, 0, 0, 0, 0, 0, 0];
    }
    SimulatedDeviceHelper.prototype.setEnumeration = function (enumeration) {
        this.enumeration = enumeration;
    };
    SimulatedDeviceHelper.prototype.getEnumeration = function () {
        return this.enumeration;
    };
    SimulatedDeviceHelper.prototype.setTriggerArmed = function (triggerArmed) {
        this.triggerArmed = triggerArmed;
    };
    SimulatedDeviceHelper.prototype.getTriggerArmed = function () {
        return this.triggerArmed;
    };
    SimulatedDeviceHelper.prototype.setAwgSettings = function (settings, channel) {
        this.signalTypes[channel] = settings.signalType;
        this.signalFreqs[channel] = settings.signalFreq;
        this.vpps[channel] = settings.vpp;
        this.vOffsets[channel] = settings.vOffset;
    };
    SimulatedDeviceHelper.prototype.getAwgSettings = function (channel) {
        return {
            signalType: this.signalTypes[channel],
            signalFreq: this.signalFreqs[channel],
            vpp: this.vpps[channel],
            vOffset: this.vOffsets[channel]
        };
    };
    //Not sure if needed after moving read to oscope but here we go anyways TODO tag for future delete
    SimulatedDeviceHelper.prototype.setOscParameters = function (parameters, channel) {
        this.oscSampleFreqs[channel] = parameters.sampleFreq;
        this.oscBufferSizes[channel] = parameters.bufferSize;
    };
    SimulatedDeviceHelper.prototype.getOscParameters = function (channel) {
        return {
            sampleFreq: this.oscSampleFreqs[channel],
            bufferSize: this.oscBufferSizes[channel]
        };
    };
    SimulatedDeviceHelper.prototype.setLaParameters = function (parameters, channel) {
        this.laSampleFreqs[channel] = parameters.sampleFreq;
        this.laBufferSizes[channel] = parameters.bufferSize;
    };
    SimulatedDeviceHelper.prototype.getLaParameters = function (channel) {
        return {
            sampleFreq: this.laSampleFreqs[channel],
            bufferSize: this.laBufferSizes[channel]
        };
    };
    SimulatedDeviceHelper.prototype.setTriggerTargets = function (targets) {
        this.targets = targets;
    };
    SimulatedDeviceHelper.prototype.getTriggerTargets = function () {
        return this.targets;
    };
    return SimulatedDeviceHelper;
}());
exports.SimulatedDeviceHelper = SimulatedDeviceHelper;
//# sourceMappingURL=simulated-device-helper.js.map

/***/ })
/******/ ]);