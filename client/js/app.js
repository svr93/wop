/**
 * Base app logic
 */
/* global document */
(function(global) {

    document.addEventListener('DOMContentLoaded', () => {

        const el = document.querySelector('[data-type="temperatureValue"]');
        const url = '/sse';
        globalExports.sse.initDataReception(el, url);
    });
})(this);
