(function () {
  'use strict';

  var I18N = window.MEH_I18N || { en: {} };
  var root = document.documentElement;
  var lang = 'en';

  /* ---------- Language ---------- */
  var textNodes = Array.prototype.slice.call(document.querySelectorAll('[data-i18n]'));
  var ariaNodes = Array.prototype.slice.call(document.querySelectorAll('[data-i18n-aria]'));
  var altNodes = Array.prototype.slice.call(document.querySelectorAll('[data-i18n-alt]'));

  // English lives in the HTML; capture it so switching back restores it exactly.
  textNodes.forEach(function (n) { I18N.en[n.getAttribute('data-i18n')] = n.innerHTML; });
  ariaNodes.forEach(function (n) { I18N.en[n.getAttribute('data-i18n-aria')] = n.getAttribute('aria-label'); });
  altNodes.forEach(function (n) { I18N.en[n.getAttribute('data-i18n-alt')] = n.getAttribute('alt'); });

  function t(key) {
    var d = I18N[lang] || {};
    return d[key] != null ? d[key] : I18N.en[key];
  }

  function setLang(next) {
    lang = I18N[next] ? next : 'en';
    textNodes.forEach(function (n) {
      var v = t(n.getAttribute('data-i18n'));
      if (v != null) n.innerHTML = v;
    });
    ariaNodes.forEach(function (n) {
      var v = t(n.getAttribute('data-i18n-aria'));
      if (v != null) n.setAttribute('aria-label', v);
    });
    altNodes.forEach(function (n) {
      var v = t(n.getAttribute('data-i18n-alt'));
      if (v != null) n.setAttribute('alt', v);
    });
    root.lang = lang;
    document.querySelector('.lang').setAttribute('data-active', lang);
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
    });
    try { localStorage.setItem('meh-lang', lang); } catch (e) { /* storage unavailable */ }
  }

  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById('menu-btn');
  var nav = document.getElementById('site-nav');
  function closeMenu() { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
  menuBtn.addEventListener('click', function () {
    var open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  // Replays the short blur-in on an element whose content just changed.
  function swap(el) {
    el.classList.remove('swap');
    void el.offsetWidth;
    el.classList.add('swap');
  }

  /* ---------- Work stages (tabs) ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.steps [role="tab"]'));

  function selectTab(index, focus) {
    tabs.forEach(function (tab, i) {
      var selected = i === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !selected;
    });
    if (focus) tabs[index].focus();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(i, false); });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % tabs.length;
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabs.length - 1;
      if (next !== null) { e.preventDefault(); selectTab(next, true); }
    });
  });

  /* ---------- Plain-language example: before / after ---------- */
  var toggle = document.querySelector('.crisis .toggle');
  var before = document.getElementById('notice-before');
  var after = document.getElementById('notice-after');
  var checks = Array.prototype.slice.call(document.querySelectorAll('.checks li'));
  var mode = 'before';

  function renderNotice(animate) {
    var isAfter = mode === 'after';
    before.hidden = isAfter;
    after.hidden = !isAfter;
    if (animate) swap(isAfter ? after : before);
    checks.forEach(function (li) { li.classList.toggle('on', isAfter); });
    toggle.setAttribute('data-mode', mode);
    toggle.querySelectorAll('button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-mode') === mode));
    });
  }

  toggle.querySelectorAll('button').forEach(function (b) {
    b.addEventListener('click', function () {
      var next = b.getAttribute('data-mode');
      if (next === mode) return;
      mode = next;
      renderNotice(true);
    });
  });

  /* ---------- Copy email ---------- */
  var copyBtn = document.getElementById('copy-email');
  var emailEl = document.getElementById('email');
  var copyTimer = null;

  function flash(text) {
    copyBtn.textContent = text;
    swap(copyBtn);
    clearTimeout(copyTimer);
    copyTimer = setTimeout(function () { copyTimer = null; copyBtn.textContent = t('ct.copy'); swap(copyBtn); }, 2200);
  }
  function selectEmail() {
    var range = document.createRange();
    range.selectNodeContents(emailEl);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    flash(t('ui.copyFail'));
  }
  copyBtn.addEventListener('click', function () {
    var text = emailEl.textContent.trim();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { flash(t('ui.copied')); }, selectEmail);
    } else {
      selectEmail();
    }
  });

  /* ---------- Start ---------- */
  var saved = null;
  try { saved = localStorage.getItem('meh-lang'); } catch (e) { /* storage unavailable */ }
  renderNotice(false);
  setLang(saved || 'en');
  // Enable sliding-thumb transitions only after the first paint, so a saved language doesn't animate in on load.
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { root.classList.add('js-ready'); });
  });
})();
