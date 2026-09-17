// components.js — Shared components and utilities for FIDEE website

(function () {
  var _p = (window.location.pathname.split('/').pop() || '').toLowerCase();
  var page = (_p === '' || _p === 'index') ? 'index.html' : (_p.includes('.') ? _p : _p + '.html');

  // ===== LANGUAGE =====
  // Kept in sync with the app's supported languages (constants/translations.ts).
  var LANGS = [
    ['fr', 'Français'], ['en', 'English'], ['es', 'Español'], ['de', 'Deutsch'],
    ['it', 'Italiano'], ['pt', 'Português'], ['nl', 'Nederlands'], ['pl', 'Polski'],
    ['ro', 'Română'], ['tr', 'Türkçe']
  ];
  var SUPPORTED = LANGS.map(function (l) { return l[0]; });
  function _supported(code) { return SUPPORTED.indexOf(code) !== -1 ? code : null; }

  var _param = _supported(new URLSearchParams(window.location.search).get('lang'));
  var _saved = _supported(localStorage.getItem('fidee-lang'));
  var _browser = ((navigator.language || navigator.userLanguage || 'fr').toLowerCase()).split('-')[0];
  var _default = _supported(_browser) || 'fr';
  window.currentLang = _param || _saved || _default;
  window._onLangChange = null;

  window.setLang = function (lang) {
    window.currentLang = lang;
    localStorage.setItem('fidee-lang', lang);
    document.querySelectorAll('.lang-select').forEach(function (sel) { sel.value = lang; });
    document.querySelectorAll('[data-fr]').forEach(function (el) {
      var text = el.getAttribute('data-' + lang);
      if (!text) return;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = text;
      else if (text.includes('<')) el.innerHTML = text;
      else el.textContent = text;
    });
    document.documentElement.lang = lang;
    if (window._onLangChange) window._onLangChange(lang);
  };

  // ===== MOBILE MENU =====
  window.toggleMenu = function () {
    var nav = document.getElementById('mobileNav');
    if (nav) nav.classList.toggle('open');
  };

  // ===== SCROLL HANDLER =====
  window.addEventListener('scroll', function () {
    var nb = document.getElementById('navbar');
    if (nb) nb.style.background = window.scrollY > 50 ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.88)';
  });

  // ===== NAVBAR HELPERS =====
  function langSwitcherDiv() {
    var options = LANGS.map(function (l) {
      return '<option value="' + l[0] + '">' + l[1] + '</option>';
    }).join('');
    return '<div class="lang-switcher">'
      + '<select class="lang-select" onchange="setLang(this.value)" aria-label="Language">' + options + '</select>'
      + '</div>';
  }

  function langSwitcher() {
    return '<li>' + langSwitcherDiv() + '</li>';
  }

  // Same compact pill as desktop, just set off from the links above by a
  // divider — kept out of langSwitcherDiv() so the pill itself never stretches.
  function mobileLangRow() {
    return '<div class="mobile-nav-langrow">' + langSwitcherDiv() + '</div>';
  }

  // Builds ` data-fr="..." data-en="..." ...` from a {lang: text} map, skipping
  // any language the map doesn't provide.
  function dataAttrs(map) {
    return LANGS.map(function (l) {
      var v = map[l[0]];
      return v ? ' data-' + l[0] + '="' + v + '"' : '';
    }).join('');
  }

  var T = {
    merchants: { fr: 'Commerçants', en: 'Merchants', es: 'Comercios', de: 'Geschäfte', it: 'Negozi', pt: 'Comerciantes', nl: 'Winkels', pl: 'Sklepy', ro: 'Comercianți', tr: 'İşletmeler' },
    howItWorks: { fr: 'Comment ça marche', en: 'How it works', es: 'Cómo funciona', de: "So funktioniert's", it: 'Come funziona', pt: 'Como funciona', nl: 'Hoe het werkt', pl: 'Jak to działa', ro: 'Cum funcționează', tr: 'Nasıl çalışır' },
    suggestStore: { fr: 'Suggérer un commerce', en: 'Suggest a store', es: 'Sugerir un comercio', de: 'Geschäft vorschlagen', it: 'Suggerisci un negozio', pt: 'Sugerir um comércio', nl: 'Winkel voorstellen', pl: 'Zaproponuj sklep', ro: 'Sugerează un comerciant', tr: 'Bir işletme öner' },
    support: { fr: 'Support', en: 'Support', es: 'Soporte', de: 'Support', it: 'Supporto', pt: 'Suporte', nl: 'Ondersteuning', pl: 'Wsparcie', ro: 'Asistență', tr: 'Destek' },
    download: { fr: 'Télécharger', en: 'Download', es: 'Descargar', de: 'Herunterladen', it: 'Scarica', pt: 'Transferir', nl: 'Downloaden', pl: 'Pobierz', ro: 'Descarcă', tr: 'İndir' },
    home: { fr: 'Accueil', en: 'Home', es: 'Inicio', de: 'Startseite', it: 'Home', pt: 'Início', nl: 'Home', pl: 'Strona główna', ro: 'Acasă', tr: 'Ana sayfa' },
    everyVisitCounts: { fr: 'Chaque visite compte.', en: 'Every visit counts.', es: 'Cada visita cuenta.', de: 'Jeder Besuch zählt.', it: 'Ogni visita conta.', pt: 'Cada visita conta.', nl: 'Elk bezoek telt.', pl: 'Każda wizyta się liczy.', ro: 'Fiecare vizită contează.', tr: 'Her ziyaret sayılır.' },
    application: { fr: 'Application', en: 'App', es: 'Aplicación', de: 'App', it: 'App', pt: 'Aplicação', nl: 'App', pl: 'Aplikacja', ro: 'Aplicație', tr: 'Uygulama' },
    helpCenter: { fr: "Centre d'aide", en: 'Help center', es: 'Centro de ayuda', de: 'Hilfe-Center', it: 'Centro assistenza', pt: 'Centro de ajuda', nl: 'Helpcentrum', pl: 'Centrum pomocy', ro: 'Centru de asistență', tr: 'Yardım merkezi' },
    contact: { fr: 'Contact', en: 'Contact', es: 'Contacto', de: 'Kontakt', it: 'Contatto', pt: 'Contacto', nl: 'Contact', pl: 'Kontakt', ro: 'Contact', tr: 'İletişim' },
    legal: { fr: 'Légal', en: 'Legal', es: 'Legal', de: 'Rechtliches', it: 'Legale', pt: 'Legal', nl: 'Juridisch', pl: 'Informacje prawne', ro: 'Legal', tr: 'Yasal' },
    terms: { fr: 'CGU', en: 'Terms', es: 'Términos', de: 'AGB', it: 'Termini', pt: 'Termos', nl: 'Voorwaarden', pl: 'Regulamin', ro: 'Termeni', tr: 'Şartlar' },
    privacy: { fr: 'Confidentialité', en: 'Privacy', es: 'Privacidad', de: 'Datenschutz', it: 'Privacy', pt: 'Privacidade', nl: 'Privacy', pl: 'Prywatność', ro: 'Confidențialitate', tr: 'Gizlilik' },
    madeWithLove: { fr: 'Fait avec amour', en: 'Made with love', es: 'Hecho con amor', de: 'Mit Liebe gemacht', it: 'Fatto con amore', pt: 'Feito com amor', nl: 'Met liefde gemaakt', pl: 'Zrobione z miłością', ro: 'Făcut cu drag', tr: 'Sevgiyle yapıldı' },
  };

  function navLink(href, map) {
    return '<li><a href="' + href + '"' + dataAttrs(map) + '>' + map.fr + '</a></li>';
  }

  function ctaLink(href) {
    return '<li><a href="' + href + '" class="nav-cta"' + dataAttrs(T.download) + '>' + T.download.fr + '</a></li>';
  }

  // ===== RENDER NAVBAR =====
  window.renderNavbar = function () {
    var links = '';
    var hamburger = true;

    switch (page) {
      case 'index.html':
      case '':
        links = navLink('#commercant', T.merchants)
          + navLink('#comment-ca-marche', T.howItWorks)
          + navLink('#suggestionForm', T.suggestStore)
          + navLink('support.html', T.support)
          + langSwitcher()
          + ctaLink('#telecharger');
        break;
      case 'comment-ca-marche.html':
      case 'support.html':
      case 'cgu.html':
      case 'confidentialite.html':
        links = navLink('index.html#commercant', T.merchants)
          + navLink('index.html#comment-ca-marche', T.howItWorks)
          + navLink('index.html#suggestionForm', T.suggestStore)
          + navLink('support.html', T.support)
          + langSwitcher()
          + ctaLink('index.html#telecharger');
        break;
      case 'reset-password.html':
        links = navLink('support.html', T.support)
          + langSwitcher();
        hamburger = false;
        break;
    }

    var html = '<a href="index.html" class="nav-logo"><img src="fidee_logo_blanc.svg" alt="FIDEE" class="nav-logo-image"></a>'
      + '<ul class="nav-links">' + links + '</ul>'
      + (hamburger ? '<button class="hamburger" type="button" aria-label="Menu"><span></span><span></span><span></span></button>' : '');

    var el = document.getElementById('navbar-placeholder');
    if (!el) return;
    var nav = document.createElement('nav');
    nav.id = 'navbar';
    nav.innerHTML = html;
    el.replaceWith(nav);

    // Single source of truth for the hamburger click: delegated on `nav`
    // (click for mouse/desktop, touchend for touch — touchend's preventDefault
    // stops the browser from also firing the synthetic click that would
    // otherwise follow, toggling the menu open then immediately shut).
    nav.addEventListener('click', function (e) {
      if (e.target.closest('.hamburger')) {
        window.toggleMenu();
      }
    }, false);
    nav.addEventListener('touchend', function (e) {
      if (e.target.closest('.hamburger')) {
        e.preventDefault();
        e.stopPropagation();
        window.toggleMenu();
      }
    }, { passive: false });
  };

  // ===== RENDER MOBILE NAV =====
  function mobileLink(href, map) {
    return '<a href="' + href + '" onclick="toggleMenu()"' + dataAttrs(map) + '>' + map.fr + '</a>';
  }

  window.renderMobileNav = function () {
    var links = '';
    switch (page) {
      case 'index.html':
      case '':
        links = mobileLink('#commercant', T.merchants)
          + mobileLink('#comment-ca-marche', T.howItWorks)
          + mobileLink('#suggestionForm', T.suggestStore)
          + mobileLink('support.html', T.support)
          + mobileLink('#telecharger', T.download)
          + mobileLangRow();
        break;
      case 'comment-ca-marche.html':
      case 'support.html':
      case 'cgu.html':
      case 'confidentialite.html':
        links = mobileLink('index.html#commercant', T.merchants)
          + mobileLink('index.html#comment-ca-marche', T.howItWorks)
          + mobileLink('index.html#suggestionForm', T.suggestStore)
          + mobileLink('support.html', T.support)
          + mobileLink('index.html#telecharger', T.download)
          + mobileLangRow();
        break;
      case 'reset-password.html':
        return;
      default:
        links = mobileLink('index.html', T.home) + mobileLangRow();
    }

    var nav = document.getElementById('navbar');
    if (!nav) return;
    var div = document.createElement('div');
    div.className = 'mobile-nav';
    div.id = 'mobileNav';
    div.innerHTML = links;
    nav.appendChild(div);
  };

  // ===== RENDER FOOTER =====
  window.renderFooter = function () {
    var el = document.getElementById('footer-placeholder');
    if (!el) return;
    var footer = document.createElement('footer');
    footer.innerHTML = '<div class="container">'
      + '<div class="footer-grid">'
      + '<div class="footer-brand">'
      + '<a href="index.html" class="nav-logo" style="margin-bottom:16px; display:inline-flex;">'
      + '<img src="fidee_logo_blanc.svg" alt="FIDEE" class="nav-logo-image"></a>'
      + '<p' + dataAttrs(T.everyVisitCounts) + '>' + T.everyVisitCounts.fr + '</p>'
      + '</div>'
      + '<div>'
      + '<div class="footer-title"' + dataAttrs(T.application) + '>' + T.application.fr + '</div>'
      + '<ul class="footer-links">'
      + '<li><a href="comment-ca-marche.html"' + dataAttrs(T.howItWorks) + '>' + T.howItWorks.fr + '</a></li>'
      + '<li><a href="index.html#telecharger"' + dataAttrs(T.download) + '>' + T.download.fr + '</a></li>'
      + '</ul></div>'
      + '<div>'
      + '<div class="footer-title"' + dataAttrs(T.support) + '>' + T.support.fr + '</div>'
      + '<ul class="footer-links">'
      + '<li><a href="support.html"' + dataAttrs(T.helpCenter) + '>' + T.helpCenter.fr + '</a></li>'
      + '<li><a href="support.html#contact"' + dataAttrs(T.contact) + '>' + T.contact.fr + '</a></li>'
      + '</ul></div>'
      + '<div>'
      + '<div class="footer-title"' + dataAttrs(T.legal) + '>' + T.legal.fr + '</div>'
      + '<ul class="footer-links">'
      + '<li><a href="cgu.html"' + dataAttrs(T.terms) + '>' + T.terms.fr + '</a></li>'
      + '<li><a href="confidentialite.html"' + dataAttrs(T.privacy) + '>' + T.privacy.fr + '</a></li>'
      + '</ul></div>'
      + '</div>'
      + '<div class="footer-bottom">'
      + '<span>© 2026 FIDEE.</span>'
      + '<span' + dataAttrs(T.madeWithLove) + '>' + T.madeWithLove.fr + '</span>'
      + '</div></div>';
    el.replaceWith(footer);
  };

  // ===== AUTO INIT =====
  window.initComponents = function () {
    renderNavbar();
    renderMobileNav();
    renderFooter();
    setLang(window.currentLang);
  };
})();
