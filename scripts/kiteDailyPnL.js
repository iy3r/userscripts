// ==UserScript==
// @name         Kite | Daily P&L
// @namespace    https://capitalmind.in
// @version      0.1
// @description  Add Daily P&L in /holdings
// @author       Vashistha Iyer
// @match        https://kite.zerodha.com/*
// @icon         https://kite.zerodha.com/static/images/kite-logo.svg
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Selectors
    const APP = 'div#app'
    const STATS_ROW = '.stats.row'
    const TICK = '.pinned-instruments > .instrument-widget:nth-child(1) > span.wrap'

    function updateDailyPnL() {
        const holdings = document.querySelector(APP).__vue__.$store.getters["holdings/holdings"]

        let yesterday = 0
        let today = 0

        for (let index = 0; index < holdings.length; index++) {
            const { tradingsymbol, opening_quantity, close_price, last_price } = holdings[index]
            yesterday += opening_quantity * close_price
            today += opening_quantity * last_price
        }

        const pnl = today - yesterday
        const pnl_perc = pnl / yesterday * 100
        const sign = pnl > 0 ? "+" : ""

        const el = document.getElementById("x-daily-pnl-container")
        if (pnl > 0) { el.className="value text-green" }
        else { el.className = "value text-red" }

        document.getElementById("x-daily-pnl-value").innerText = pnl.toLocaleString('en-in', { minimumFractionDigits: 2 })
        document.getElementById("x-daily-pnl-perc").innerText = `(${sign}${pnl_perc.toFixed(2)}%)`
    }

    function fixMarkupAndUpdatePnL() {
        const statsMountCheck = setInterval(() => {
            const el = document.querySelector(STATS_ROW)

            if (el) {
                // Cleanup
                clearInterval(statsMountCheck)
                document.getElementById("x-daily-pnl-wrapper")?.remove()

                const node = document.createElement('div')
                node.className="three columns"
                node.id = "x-daily-pnl-wrapper"
                node.innerHTML = `
                <h1 class="value" id="x-daily-pnl-container">
                  <span id="x-daily-pnl-value"></span>
                  <small id="x-daily-pnl-perc"></small>
                </h1>
                <div class="label">Today's P&amp;L</div>
                `

                el.appendChild(node)

                Array.from(el.querySelectorAll('div.columns')).map((el, idx) => {
                    el.className="three columns"
                })

                updateDailyPnL()
            }
        }, 500)
    }

    const routeObserver = new MutationObserver((mutation) => {
        const isHoldingsPage = Array.from(mutation[0]?.target?.classList).includes("page-holdings")
        if (isHoldingsPage) {
            fixMarkupAndUpdatePnL()
        }
    })

    const tickObserver = new MutationObserver(() => {
        updateDailyPnL()
    })

    const appMountCheck = setInterval(() => {
        const hasMounted = document.querySelector(APP)?.__vue__?.$store.getters["holdings/holdings"]

        if (hasMounted) {
            clearInterval(appMountCheck)
            const isHoldingsPage = window.location.pathname === "/holdings"

            // Initialize
            if (isHoldingsPage) {
                fixMarkupAndUpdatePnL()
            }

            // Update on route change
            routeObserver.observe(document.querySelector(APP), {
                attributeFilter: [ "class" ]
            })

            // Update on new ticks
            tickObserver.observe(document.querySelector(TICK), {
                subtree: true,
                characterData: true
            })
        }
    }, 500)
})();
