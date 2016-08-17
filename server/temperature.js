'use strict';

const childProcess = require('child_process');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

const checkDelay = 10 * 1000;

let timerId = null;
let previousResultObj = {};

/**
 * Gets temperature & humidity value from bash script.
 * @return {Promise<{ temperature: number, humidity: number }>}
 */
const getValueFromSensor = function f() {

    return new Promise((resolve, reject) => {

        const spawnResult = childProcess.spawn('./temperature.sh');
        let resultStr = '';

        spawnResult.stdout.on('data', (data) => resultStr += data);
        spawnResult.on('close', (code) => {

            const resultArr = resultStr.split(' ');
            if (resultArr.length !== 2) {

                reject(new Error('Bad data count'));
                return;
            }
            const resultObj = {

                temperature: +resultArr[0],
                humidity: +resultArr[1],
            };
            if (code === 0 &&
                !isNaN(resultObj.temperature) &&
                !isNaN(resultObj.humidity)) {

                resolve(resultObj);
                return;
            }
            const msg = `Bad data; code: ${ code }, result: ${ resultStr }`;
            reject(new Error(msg));
        });
    });
}

const startEmit = function f() {

    getValueFromSensor()
        .then((resultObj) => {

            if (resultObj.temperature !== previousResultObj.temperature ||
                resultObj.humidity !== previousResultObj.humidity) {

                eventEmitter.emit('value', resultObj);
            }
            previousResultObj = resultObj;
        })
        .catch((err) => {

            console.log(`getValueFromSensor error: ${ err.message }`);
        })
        .then(() => {

            timerId = setTimeout(() => f(), checkDelay);
        });
};

const stopEmit = function() {

    clearTimeout(timerId);
};

/**
 * Gets last temperature & humidity value.
 * @return {({ temperature: number, humidity: number }|null)}
 */
function getLastData() {

    return Object.keys(previousResultObj).length ? previousResultObj : null;
}

module.exports = {

    init: startEmit,
    close: stopEmit,
    eventEmitter: eventEmitter,
    getLastData: getLastData,
};
