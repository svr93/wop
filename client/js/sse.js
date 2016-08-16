/**
 * SSE handler
 */
 /* global console */
(function(global) {
    'use strict';

    let evtSource = null;

    /**
     * Creates data receiver that displays value on the screen.
     * @param {HTMLElement} el,
     * @param {string} url
     */
    function initDataReception(el, url) {

         evtSource = new EventSource(url);
         evtSource.onmessage = function(evt) {

             const resultObj = JSON.parse(evt.data);
             el.innerHTML = resultObj.temperature;
         };
         evtSource.onerror = function(evt) {

             el.innerHTML = '';
             console.log(evt);
         };
    }

    /**
     * Closes connection.
     */
    function closeDataReception() {

        if (evtSource) {

            evtSource.close();
        }
    }

    globalExports.sse = Object.freeze({

        initDataReception: initDataReception,
        closeDataReception: closeDataReception,
    });
})(this);
