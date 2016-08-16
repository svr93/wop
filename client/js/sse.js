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

             el.innerHTML = evt.data;
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
