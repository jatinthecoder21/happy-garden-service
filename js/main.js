/* =====================================================================
   Happy Garden Service — interactions
   Vanilla JS, no dependencies. Progressive enhancement.
   ===================================================================== */
(function () {
  'use strict';

  /* ----- Year in footer ----- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ----- Sticky header shadow on scroll ----- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ----- Mobile menu toggle ----- */
  var toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // close menu when a real link is clicked
    document.querySelectorAll('.nav-menu a').forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ----- Dropdown (click/keyboard friendly; hover handled by CSS on desktop) ----- */
  document.querySelectorAll('.has-dropdown').forEach(function (btn) {
    var dd = btn.parentElement.querySelector('.dropdown');
    if (!dd) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var isOpen = dd.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item-dd')) {
      document.querySelectorAll('.dropdown.open').forEach(function (dd) {
        dd.classList.remove('open');
        var b = dd.parentElement.querySelector('.has-dropdown');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.body.classList.remove('menu-open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
      document.querySelectorAll('.dropdown.open').forEach(function (dd) { dd.classList.remove('open'); });
    }
  });

  /* ----- Scroll reveal (position-based — never leaves content hidden) ----- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = document.querySelectorAll('.reveal');
  if (reduce) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var pending = Array.prototype.slice.call(reveals);
    var ticking = false;
    var checkReveals = function () {
      ticking = false;
      var trigger = window.innerHeight * 0.92;
      pending = pending.filter(function (el) {
        if (el.getBoundingClientRect().top < trigger) { el.classList.add('in'); return false; }
        return true;
      });
      if (!pending.length) {
        window.removeEventListener('scroll', onRevealScroll);
        window.removeEventListener('resize', onRevealScroll);
      }
    };
    var onRevealScroll = function () {
      if (!ticking) { ticking = true; requestAnimationFrame(checkReveals); }
    };
    window.addEventListener('scroll', onRevealScroll, { passive: true });
    window.addEventListener('resize', onRevealScroll);
    checkReveals();
    // safety net: reveal everything shortly after load in case anything slips through
    window.addEventListener('load', function () { setTimeout(checkReveals, 300); });
  }

  /* ----- Count-up stats ----- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var run = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      if (reduce) { el.textContent = target + suffix; return; }
      var dur = 1400, start = null;
      var step = function (ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = target % 1 === 0 ? Math.round(target * eased) : (target * eased).toFixed(1);
        el.textContent = val + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { run(en.target); co.unobserve(en.target); } });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* ----- FAQ accordion ----- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var open = item.classList.toggle('open');
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
      a.style.maxHeight = open ? a.scrollHeight + 'px' : '0px';
    });
  });

  /* ----- Before / After slider ----- */
  document.querySelectorAll('.ba').forEach(function (ba) {
    var after = ba.querySelector('.after');
    var handle = ba.querySelector('.handle');
    var grip = ba.querySelector('.grip');
    var range = ba.querySelector('input[type="range"]');
    var set = function (v) {
      v = Math.max(0, Math.min(100, v));
      if (after) after.style.clipPath = 'inset(0 0 0 ' + v + '%)';
      if (handle) handle.style.left = v + '%';
      if (grip) grip.style.left = v + '%';
      if (range) range.value = v;
    };
    if (range) range.addEventListener('input', function () { set(parseFloat(range.value)); });
    set(50);
  });

  /* ----- Smooth anchor scroll with sticky-header offset ----- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* ----- Prefill service on booking form from ?service= or #book links ----- */
  var params = new URLSearchParams(window.location.search);
  var preselect = params.get('service');
  if (preselect) {
    var box = document.querySelector('.choice input[value="' + CSS.escape(preselect) + '"]');
    if (box) box.checked = true;
  }

  /* =================================================================
     Booking / quote form  →  Web3Forms
     Activate by pasting your free access key in data-access-key below
     (in pricing.html). Until then we fall back to a mailto: draft.
     Get a key in 60s at https://web3forms.com  (no account needed)
     ================================================================= */
  var form = document.getElementById('booking-form');
  if (form) {
    var statusEl = form.querySelector('.form-status');
    var submitBtn = form.querySelector('[type="submit"]');
    var ACCESS_KEY = form.getAttribute('data-access-key') || '';

    var showStatus = function (msg, ok) {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.className = 'form-status show ' + (ok ? 'ok' : 'bad');
      statusEl.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    };

    var validate = function () {
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (f) {
        var wrap = f.closest('.field');
        var valid = f.type === 'email'
          ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim())
          : f.value.trim() !== '';
        if (f.type === 'tel') valid = f.value.replace(/[^0-9]/g, '').length >= 7;
        if (wrap) wrap.classList.toggle('invalid', !valid);
        if (!valid && ok) { ok = false; f.focus(); }
      });
      return ok;
    };

    // clear error styling as the user types
    form.querySelectorAll('[required]').forEach(function (f) {
      f.addEventListener('input', function () {
        var wrap = f.closest('.field');
        if (wrap) wrap.classList.remove('invalid');
      });
    });

    var mailtoFallback = function () {
      var get = function (n) { var el = form.elements[n]; return el ? el.value : ''; };
      var services = Array.prototype.slice.call(form.querySelectorAll('input[name="services"]:checked'))
        .map(function (c) { return c.value; }).join(', ');
      var body = [
        'Name: ' + get('name'),
        'Phone: ' + get('phone'),
        'Email: ' + get('email'),
        'Suburb: ' + get('suburb'),
        'Preferred date: ' + get('date'),
        'Services: ' + services,
        '',
        get('message')
      ].join('\n');
      window.location.href = 'mailto:happygarden114@gmail.com'
        + '?subject=' + encodeURIComponent('Quote request — ' + (get('name') || 'Website'))
        + '&body=' + encodeURIComponent(body);
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) { showStatus('Please fill in the highlighted fields so we can get back to you.', false); return; }

      // No key yet → graceful mailto fallback so the form is never "dead".
      if (!ACCESS_KEY || ACCESS_KEY.indexOf('PASTE') === 0) {
        showStatus('Opening your email app to send the request… If nothing happens, please call or text 027 275 7419.', true);
        mailtoFallback();
        return;
      }

      if (submitBtn) { submitBtn.setAttribute('aria-busy', 'true'); submitBtn.dataset.label = submitBtn.textContent; submitBtn.textContent = 'Sending…'; }

      var data = new FormData(form);
      data.append('access_key', ACCESS_KEY);
      data.append('subject', 'New quote request from Happy Garden Service website');
      data.append('from_name', 'Happy Garden Service Website');

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res.success) {
            form.reset();
            showStatus('Thank you! Your request has been sent — Ravi will get back to you shortly with your FREE quote. For anything urgent, call or text 027 275 7419.', true);
          } else {
            showStatus('Sorry, something went wrong sending your request. Please call or text 027 275 7419 and we\'ll sort it out.', false);
          }
        })
        .catch(function () {
          showStatus('Network problem — please call or text 027 275 7419, or email happygarden114@gmail.com.', false);
        })
        .finally(function () {
          if (submitBtn) { submitBtn.removeAttribute('aria-busy'); submitBtn.textContent = submitBtn.dataset.label || 'Send my request'; }
        });
    });
  }
})();
