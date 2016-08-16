'use strict';

const http = require('http');
const nodeStatic = require('node-static');
const staticServer = new nodeStatic.Server('./client');
const SSE = require('sse');

const temperature = require('./temperature');
temperature.init();

const staticPort = 8000;

const server = http.createServer((request, response) => {

    if (request.url === '/sse') {

        const sseListener = new SSE(server);
        sseListener.on('connection', (client) => {

            /**
             * Callback for 'value' event.
             * @param {{ temperature: number, humidity: number }} value
             */
            const callback = function(value) {

                client.send(JSON.stringify(value));
            };
            temperature.eventEmitter.on('value', callback);
            client.on('close', () => {

                const userAgent = client.req.headers[ 'user-agent' ];
                console.log(`Connection closed with ${ userAgent }`);
                temperature.eventEmitter.removeListener('value', callback);
            });
        });
    } else {

        request.on('end', () => {

            staticServer.serve(request, response);
        }).resume();
    }
}).listen(staticPort);
