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

            temperature.eventEmitter.on('value', (value) => {

                client.send(value.toString());
            });
        });
    } else {

        request.on('end', () => {

            staticServer.serve(request, response);
        }).resume();
    }
}).listen(staticPort);
