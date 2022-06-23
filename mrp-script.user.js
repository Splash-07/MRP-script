// ==UserScript==
// @name         Medium Rare Potato restaurant management script
// @description  Script made to manage your restaurant in https://game.medium-rare-potato.io/
// @namespace    https://github.com/Splash-07/MRP-script
// @version      2.2.0
// @author       Splash-07 (https://github.com/Splash-07)
// @match        https://game.medium-rare-potato.io/*
// @require      https://cdn.jsdelivr.net/gh/jquery/jquery@3.6/dist/jquery.min.js
// ==/UserScript==

(function () {
  'use strict';
  $('body').append('<div id="MRPHelper"></div>');

  const version = '2.2.0';
  $('body').append(`
    <script type="module" crossorigin src="https://cdn.jsdelivr.net/gh/Splash-07/MRP-script@${version}/dist/index.js"></script>
  `);
})();
