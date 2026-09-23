/* AUREA HAIR CO. — theme interactions (vanilla, no dependencies) */
(function () {
  'use strict';
  var routes = window.AureaRoutes || {};

  /* ---- hero background video: force muted autoplay, never show controls ---- */
  document.querySelectorAll('.hero__video').forEach(function (v) {
    v.controls = false;
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute('muted', '');
    v.removeAttribute('controls');
    // reveal the video only once it is actually playing — if the browser blocks
    // muted autoplay (iOS Low Power Mode, data saver), it stays hidden and the
    // poster background shows instead, so no native play button is ever visible.
    v.addEventListener('playing', function () { v.classList.add('is-playing'); });
    var tryPlay = function () { var p = v.play(); if (p && p.catch) p.catch(function () {}); };
    tryPlay();
    v.addEventListener('loadeddata', tryPlay);
    v.addEventListener('canplay', tryPlay);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) tryPlay(); });
  });

  /* ---- sticky header ---- */
  var header = document.querySelector('[data-header]');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 12);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- generic open/close via data-toggle ---- */
  function bindToggle(openSel, targetSel) {
    document.querySelectorAll(openSel).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var t = document.querySelector(targetSel);
        var ov = document.querySelector('[data-overlay]');
        if (!t) return;
        var willOpen = !t.classList.contains('is-open');
        t.classList.toggle('is-open', willOpen);
        if (ov) ov.classList.toggle('is-open', willOpen);
        document.body.style.overflow = willOpen ? 'hidden' : '';
        var input = t.querySelector('input[type="search"],input[type="text"]');
        if (willOpen && input) setTimeout(function () { input.focus(); }, 250);
      });
    });
  }
  function closeAll() {
    document.querySelectorAll('.is-open').forEach(function (el) { el.classList.remove('is-open'); });
    document.body.style.overflow = '';
  }
  bindToggle('[data-open-search]', '[data-search-drawer]');
  bindToggle('[data-open-menu]', '[data-mobile-menu]');
  document.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', closeAll); });
  var overlay = document.querySelector('[data-overlay]');
  if (overlay) overlay.addEventListener('click', closeAll);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });

  /* ---- announcement rotation ---- */
  var track = document.querySelector('[data-announcement]');
  if (track) {
    var items = track.querySelectorAll('.announcement__item');
    if (items.length > 1) {
      var i = 0;
      setInterval(function () {
        items[i].classList.remove('is-active');
        i = (i + 1) % items.length;
        items[i].classList.add('is-active');
      }, 4500);
    }
  }

  /* ---- reveal on scroll ---- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---- cart count refresh ---- */
  function updateCartCount(count) {
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = count;
      el.style.display = count > 0 ? '' : 'none';
    });
  }

  /* ---- AJAX add to cart (quick add + featured product) ---- */
  function addToCart(id, qty, btn) {
    if (!id) return;
    var original = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Adding…'; }
    fetch((routes.cart_add_url || '/cart/add') + '.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ items: [{ id: Number(id), quantity: qty || 1 }] })
    })
      .then(function (r) { return r.json(); })
      .then(function () {
        return fetch((routes.cart_url || '/cart') + '.js').then(function (r) { return r.json(); });
      })
      .then(function (cart) {
        updateCartCount(cart.item_count);
        if (btn) { btn.textContent = 'Added ✓'; setTimeout(function () { btn.textContent = original; btn.disabled = false; }, 1600); }
      })
      .catch(function () {
        if (btn) { btn.textContent = 'Try again'; btn.disabled = false; }
      });
  }

  document.addEventListener('click', function (e) {
    var q = e.target.closest('[data-quick-add]');
    if (q) {
      e.preventDefault();
      addToCart(q.getAttribute('data-quick-add'), 1, q);
    }
  });

  /* ---- featured product variant selection + add ---- */
  document.querySelectorAll('[data-product-form]').forEach(function (form) {
    var variants = JSON.parse(form.getAttribute('data-variants') || '[]');
    var priceEl = form.querySelector('[data-price]');
    var atc = form.querySelector('[data-atc]');
    var idField = form.querySelector('[data-variant-id]');

    function currentSelection() {
      return Array.prototype.map.call(form.querySelectorAll('input[data-option]:checked'), function (i) { return i.value; });
    }
    function matchVariant() {
      var sel = currentSelection();
      if (!sel.length) return variants[0];
      return variants.find(function (v) {
        return v.options.every(function (o, idx) { return o === sel[idx]; });
      });
    }
    function refresh() {
      var v = matchVariant();
      if (!v) return;
      if (idField) idField.value = v.id;
      if (priceEl) priceEl.innerHTML = v.priceHtml;
      if (atc) {
        atc.disabled = !v.available;
        atc.textContent = v.available ? (atc.getAttribute('data-label') || 'Add to Cart') : 'Sold Out';
        atc.setAttribute('data-variant-id', v.id);
      }
    }
    form.querySelectorAll('input[data-option]').forEach(function (i) { i.addEventListener('change', refresh); });
    if (atc) {
      atc.addEventListener('click', function (e) {
        e.preventDefault();
        var v = matchVariant();
        if (v && v.available) addToCart(v.id, 1, atc);
      });
    }
    refresh();
  });
})();
