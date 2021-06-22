// ==UserScript==
// @name         Kite | Nifty 1SD Range
// @namespace    https://capitalmind.in
// @version      0.1
// @description  Calc and show 1SD range for Nifty using VIX
// @author       Vashistha Iyer
// @match        https://kite.zerodha.com/*
// @icon         https://kite.zerodha.com/static/images/kite-logo.svg
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Selectors
    const ELEMENT_THAT_MUTATES = '.pinned-instruments > .instrument-widget:nth-child(1) > span.wrap'
    const PINNED_1 = '.pinned-instruments > .instrument-widget:nth-child(1)'
    const PINNED_2 = '.pinned-instruments > .instrument-widget:nth-child(2)'
    const NIFTY = '.pinned-instruments > .instrument-widget:nth-child(1) span.last-price'
    const VIX = '.pinned-instruments > .instrument-widget:nth-child(2) span.last-price'
    const LOGO = '.header-right > .logo'

    const observer = new MutationObserver(mutations => {
        const nifty = Number(document.querySelector(NIFTY).innerText.trim())
        const vix = Number(document.querySelector(VIX).innerText.trim())
        const expiry_date = new Date(document.querySelector('#x-expiry-date > input').value)

        const MS_PER_DAY = 1000 * 60 * 60 * 24;
        const days_to_expiry = (expiry_date - new Date()) / MS_PER_DAY

        const one_sd_perc = vix / Math.sqrt(365 / days_to_expiry)
        const one_sd_move = nifty * one_sd_perc / 100
        const one_sd_above = Math.round(nifty + one_sd_move)
        const one_sd_below = Math.round(nifty - one_sd_move)

        document.querySelector("#x-sd-range").innerHTML = `<span style="margin-right: 0.5rem">${one_sd_below} - ${one_sd_above}</span><span class="text-xxsmall dim">${days_to_expiry.toFixed(2)} DTE</span>`
        document.querySelector("#x-sd-perc").innerHTML = `<span style="margin-right: 0.5rem;">${one_sd_perc.toFixed(2)}%</span><span class="text-xxsmall dim">${one_sd_move.toFixed(0)} points</span>`
    })

    window.addEventListener("load", function() {
        const sd_range = document.createElement('div')
        sd_range.id = "x-sd-range"
        sd_range.innerHTML = "0 - 0"
        document.querySelector(PINNED_1).appendChild(sd_range)

        const sd_perc = document.createElement('div')
        sd_perc.id = "x-sd-perc"
        sd_perc.innerHTML = "00%"
        document.querySelector(PINNED_2).appendChild(sd_perc)

        const today = new Date()
        const y = today.getFullYear()
        const m = String(today.getMonth() + 1).padStart(2, '0')
        const d = String(today.getDate()).padStart(2, '0')
        const default_expiry_date = `${y}-${m}-${d}T15:30`

        document.querySelector(LOGO).insertAdjacentHTML(
            "afterend",
            `
            <div id="x-expiry-date" style="display:flex; align-items: center;">
              <input type="datetime-local" value=${default_expiry_date} style="border: 1px solid var(--color-border-default); padding: 4px;"/>
            </div>
            `
        );

        observer.observe(document.querySelector(ELEMENT_THAT_MUTATES), {
            subtree: true,
            characterData: true
        })
    })
})();
