// components.js — Shared components and utilities for FIDEE website

(function () {
  var page = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

  // ===== LANGUAGE =====
  window.currentLang = localStorage.getItem('fidee-lang') || 'fr';
  window._onLangChange = null;

  window.setLang = function (lang) {
    window.currentLang = lang;
    localStorage.setItem('fidee-lang', lang);
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.textContent === lang.toUpperCase());
    });
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
  function langSwitcher() {
    return '<li><div class="lang-switcher">'
      + '<button class="lang-btn active" onclick="setLang(\'fr\')">FR</button>'
      + '<button class="lang-btn" onclick="setLang(\'en\')">EN</button>'
      + '</div></li>';
  }

  function navLink(href, fr, en) {
    return '<li><a href="' + href + '" data-fr="' + fr + '" data-en="' + en + '">' + fr + '</a></li>';
  }

  function ctaLink(href) {
    return '<li><a href="' + href + '" class="nav-cta" data-fr="Télécharger" data-en="Download">Télécharger</a></li>';
  }

  // ===== RENDER NAVBAR =====
  window.renderNavbar = function () {
    var links = '';
    var hamburger = true;

    switch (page) {
      case 'index.html':
      case '':
        links = navLink('#comment-ca-marche', 'Comment ça marche', 'How it works')
          + navLink('#pour-qui', 'Pour qui ?', 'For who?')
          + navLink('support.html', 'Support', 'Support')
          + langSwitcher()
          + ctaLink('#telecharger');
        break;
      case 'comment-ca-marche.html':
        links = navLink('index.html#comment-ca-marche', 'Comment ça marche', 'How it works')
          + navLink('index.html#pour-qui', 'Pour qui ?', 'For who?')
          + navLink('support.html', 'Support', 'Support')
          + langSwitcher()
          + ctaLink('index.html#telecharger');
        break;
      case 'support.html':
        links = navLink('comment-ca-marche.html', 'Comment ça marche', 'How it works')
          + navLink('support.html', 'Support', 'Support')
          + langSwitcher()
          + ctaLink('index.html#telecharger');
        break;
      case 'cgu.html':
      case 'confidentialite.html':
        links = navLink('comment-ca-marche.html', 'Comment ça marche', 'How it works')
          + navLink('support.html', 'Support', 'Support')
          + langSwitcher();
        break;
      case 'reset-password.html':
        links = navLink('support.html', 'Support', 'Support')
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

    // Direct approach: set onclick attribute on hamburger button
    var btn = nav.querySelector('.hamburger');
    if (btn) {
      btn.setAttribute('onclick', 'window.toggleMenu(); return false;');
    }

    // Fallback: event delegation
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
  function mobileLink(href, fr, en) {
    var attrs = en ? ' data-fr="' + fr + '" data-en="' + en + '"' : '';
    return '<a href="' + href + '" onclick="toggleMenu()"' + attrs + '>' + fr + '</a>';
  }

  window.renderMobileNav = function () {
    var links = '';
    switch (page) {
      case 'index.html':
      case '':
        links = mobileLink('#comment-ca-marche', 'Comment ça marche', 'How it works')
          + mobileLink('#pour-qui', 'Pour qui ?', 'For who?')
          + mobileLink('support.html', 'Support', 'Support')
          + mobileLink('#telecharger', 'Télécharger', 'Download');
        break;
      case 'comment-ca-marche.html':
        links = mobileLink('index.html', 'Accueil', 'Home')
          + mobileLink('support.html', 'Support', 'Support')
          + mobileLink('index.html#telecharger', 'Télécharger', 'Download');
        break;
      case 'support.html':
        links = mobileLink('index.html', 'Accueil')
          + mobileLink('comment-ca-marche.html', 'Comment ça marche')
          + mobileLink('index.html#telecharger', 'Télécharger');
        break;
      case 'cgu.html':
      case 'confidentialite.html':
        links = mobileLink('index.html', 'Accueil')
          + mobileLink('comment-ca-marche.html', 'Comment ça marche')
          + mobileLink('support.html', 'Support');
        break;
      case 'reset-password.html':
        return;
      default:
        links = mobileLink('index.html', 'Accueil');
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
      + '<p data-fr="La fidélité réinventée." data-en="Local loyalty reinvented.">La fidélité réinventée.</p>'
      + '</div>'
      + '<div>'
      + '<div class="footer-title" data-fr="Application" data-en="App">Application</div>'
      + '<ul class="footer-links">'
      + '<li><a href="comment-ca-marche.html" data-fr="Comment ça marche" data-en="How it works">Comment ça marche</a></li>'
      + '<li><a href="index.html#telecharger" data-fr="Télécharger" data-en="Download">Télécharger</a></li>'
      + '</ul></div>'
      + '<div>'
      + '<div class="footer-title" data-fr="Support" data-en="Support">Support</div>'
      + '<ul class="footer-links">'
      + '<li><a href="support.html" data-fr="Centre d\'aide" data-en="Help center">Centre d\'aide</a></li>'
      + '<li><a href="support.html#contact" data-fr="Contact" data-en="Contact">Contact</a></li>'
      + '</ul></div>'
      + '<div>'
      + '<div class="footer-title" data-fr="Légal" data-en="Legal">Légal</div>'
      + '<ul class="footer-links">'
      + '<li><a href="cgu.html" data-fr="CGU" data-en="Terms">CGU</a></li>'
      + '<li><a href="confidentialite.html" data-fr="Confidentialité" data-en="Privacy">Confidentialité</a></li>'
      + '</ul></div>'
      + '</div>'
      + '<div class="footer-bottom">'
      + '<span>© 2026 FIDEE.</span>'
      + '<span data-fr="Fait avec amour" data-en="Made with love">Fait avec amour</span>'
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
