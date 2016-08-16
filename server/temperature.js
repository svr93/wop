'use strict';

const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

const baseTemperature = 20;
let timerId = null;

const startEmit = function f() {

    timerId = setTimeout(() => {

        eventEmitter.emit('value', baseTemperature + Math.random());
        f();
    }, Math.random() * 1000 * 10);
};

const stopEmit = function() {

    clearTimeout(timerId);
};

module.exports = {

    init: startEmit,
    close: stopEmit,
    eventEmitter: eventEmitter,
};
