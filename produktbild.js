/*
 * Produktbild für ältere Next.js-Produktseiten (z. B. /flow-board/, /abc-fuchs/).
 * Die Next.js-Vorlage dieser Seiten kennt kein Bild. Dieses Skript setzt das Bild
 * unter den Einleitungstext und fügt es erneut ein, falls React es beim Hydrieren entfernt.
 *
 * Einbindung:
 * <script src="/produktbild.js" data-src="img/bild.jpg" data-alt="Beschreibung"
 *         data-breite="1600" data-hoehe="1128" defer></script>
 */
(function () {
  'use strict';

  var skript = document.currentScript;
  if (!skript) return;

  var BILD_ID = 'gz-produktbild';
  var EINFUEGE_ZIEL = 'section[aria-labelledby="detail-title"] p';
  // Erst nach der React-Hydrierung einfügen, sonst meldet React einen Mismatch (#418)
  // und baut die Seite neu auf, wobei das Bild wieder verschwindet.
  var WARTEZEIT_NACH_LOAD_MS = 600;
  var BEOBACHTUNGSDAUER_MS = 10000;

  var config = {
    src: skript.getAttribute('data-src'),
    alt: skript.getAttribute('data-alt') || '',
    breite: skript.getAttribute('data-breite'),
    hoehe: skript.getAttribute('data-hoehe')
  };

  if (!config.src) {
    console.error('produktbild.js: data-src fehlt, kein Bild eingefügt.');
    return;
  }

  function erstelleBild() {
    var figur = document.createElement('figure');
    figur.id = BILD_ID;
    figur.style.cssText = 'margin:2rem 0 0;max-width:48rem;';

    var bild = document.createElement('img');
    bild.src = config.src;
    bild.alt = config.alt;
    bild.decoding = 'async';
    if (config.breite) bild.width = Number(config.breite);
    if (config.hoehe) bild.height = Number(config.hoehe);
    bild.style.cssText =
      'display:block;width:100%;max-width:' + (config.breite ? config.breite + 'px' : '100%') + ';' +
      'height:auto;border-radius:1rem;border:1px solid rgba(255,255,255,0.06);' +
      'box-shadow:0 20px 60px rgba(0,0,0,0.45);';

    figur.appendChild(bild);
    return figur;
  }

  function fuegeBildEin() {
    if (document.getElementById(BILD_ID)) return true;
    var einleitung = document.querySelector(EINFUEGE_ZIEL);
    if (!einleitung) return false;
    einleitung.insertAdjacentElement('afterend', erstelleBild());
    return true;
  }

  // Beobachtet den gesamten Dokumentbaum: Baut React <main> neu auf, bleibt der Beobachter gültig.
  function beobachteNeuaufbau() {
    var beobachter = new MutationObserver(fuegeBildEin);
    beobachter.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function () { beobachter.disconnect(); }, BEOBACHTUNGSDAUER_MS);
  }

  function start() {
    if (!fuegeBildEin()) {
      console.error('produktbild.js: Einleitungstext (' + EINFUEGE_ZIEL + ') nicht gefunden.');
      return;
    }
    beobachteNeuaufbau();
  }

  function startNachHydrierung() {
    var imLeerlauf = window.requestIdleCallback || function (fn) { return setTimeout(fn, 0); };
    setTimeout(function () { imLeerlauf(start); }, WARTEZEIT_NACH_LOAD_MS);
  }

  if (document.readyState === 'complete') {
    startNachHydrierung();
  } else {
    window.addEventListener('load', startNachHydrierung);
  }
})();
