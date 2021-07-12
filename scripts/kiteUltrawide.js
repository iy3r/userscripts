// ==UserScript==
// @name         Kite | Ultrawide
// @namespace    https://capitalmind.in
// @version      0.1
// @description  Use full width of screen
// @author       Vashistha Iyer
// @match        https://kite.zerodha.com/*
// @icon         https://kite.zerodha.com/static/images/kite-logo.svg
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const APP = 'div#app .container.wrapper'
    const HEADER = 'div#app > div.header > div.wrapper'
    const BODY = 'div#app > div.container.wrapper'
    const CHART = 'div#app > div.container.wrapper > div.container-right'

    const appMountCheck = setInterval(() => {
        const hasMounted = document.querySelector(APP)

        if (hasMounted) {
            clearInterval(appMountCheck)

            document.querySelector(HEADER).style.maxWidth = "none"
            document.querySelector(BODY).style.maxWidth = "none"
            document.querySelector(CHART).style.maxWidth = "none"
        }
    })
})();
