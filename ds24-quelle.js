/*
 * ds24-quelle.js — Werbequelle an Digistore24 weiterreichen
 *
 * Aufruf der Seite mit ?quelle=flyer (oder pinterest, ratgeber-… usw.)
 * hängt an jeden Kauf-Link zum Digistore-Bestellformular ?ds24tr=flyer an.
 * Digistore zeigt den Wert bei einem Kauf unter Berichte > Transaktionen
 * in der Spalte "Trackingkey".
 *
 * Bewusst ohne Cookie und ohne localStorage: Die Quelle gilt nur für die
 * gerade aufgerufene Seite, auf dem Gerät des Besuchers wird nichts gespeichert.
 */
(function () {
  "use strict";

  // Digistore erlaubt nur Buchstaben ohne Umlaute, Ziffern, _ und -, max. 127 Zeichen.
  var ERLAUBTER_KEY = /^[A-Za-z0-9_-]{1,127}$/;

  function leseQuelle() {
    var quelle = new URLSearchParams(window.location.search).get("quelle");
    return quelle && ERLAUBTER_KEY.test(quelle) ? quelle : null;
  }

  function haengeTrackingkeyAn(link, quelle) {
    var url = new URL(link.href);
    // Digistore-Schreibweise laut Hilfe-Center: /product/ID/?ds24tr=KEY
    if (url.pathname.slice(-1) !== "/") url.pathname += "/";
    url.searchParams.set("ds24tr", quelle);
    link.href = url.toString();
  }

  function start() {
    var quelle = leseQuelle();
    if (!quelle) return;
    var kaufLinks = document.querySelectorAll('a[href*="checkout-ds24.com/product/"]');
    Array.prototype.forEach.call(kaufLinks, function (link) {
      haengeTrackingkeyAn(link, quelle);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
