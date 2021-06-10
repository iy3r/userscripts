// ==UserScript==
// @name         Don't F*CK with Paste, ICICI!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Disable paste blockers on ICICI NetBanking
// @author       Vashistha Iyer
// @match        https://infinity.icicibank.com/*
// @icon         https://raw.githubusercontent.com/tailwindlabs/heroicons/master/optimized/outline/clipboard-check.svg
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("load", function() {
        const el = document.getElementById("AuthenticationFG.ACCESS_CODE")
        el.replaceWith(el.cloneNode(true))
    })
})();
