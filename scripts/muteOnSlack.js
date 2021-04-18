// ==UserScript==
// @name         Mute on Slack
// @namespace    https://capitalmind.in
// @version      0.1
// @description  Mute users on Capitalmind Slack
// @author       Vashistha Iyer
// @match        https://app.slack.com/client/T04NJNVHN*
// @icon         https://www.google.com/s2/favicons?domain=slack.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const usersToMute = ["<user_id>"];

  const muteQuery = usersToMute
    .map((x) => `a[data-message-sender="${x}"]`)
    .join(", ");

  const observer = new MutationObserver(function (mutations) {
    [...document.querySelectorAll('div[data-qa="message_container"]')]
      .filter((x) => x.querySelectorAll(muteQuery).length)
      .map((x) => {
        x.style.display = "none";
      });
  });

  window.addEventListener("load", function () {
    observer.observe(document.querySelector("body"), {
      subtree: true,
      childList: true,
      attributes: false,
      characterData: false,
      attributeOldValue: false,
      characterDataOldValue: false,
    });
  });
})();
