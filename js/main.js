(function () {
  'use strict';

  var burger = document.querySelector('.burger');
  var links = document.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', function () {
      links.classList.toggle('open');
      burger.classList.toggle('open');
      burger.setAttribute('aria-expanded', links.classList.contains('open'));
    });
  }

  var langsw = document.querySelector('.langsw');
  if (langsw) {
    var lbtn = langsw.querySelector('.langsw-btn');
    var setLang = function (open) {
      langsw.classList.toggle('open', open);
      lbtn.setAttribute('aria-expanded', open);
    };
    lbtn.addEventListener('click', function (e) {
      e.stopPropagation();
      setLang(!langsw.classList.contains('open'));
    });
    document.addEventListener('click', function (e) {
      if (!langsw.contains(e.target)) setLang(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && langsw.classList.contains('open')) { setLang(false); lbtn.focus(); }
    });
  }

  document.querySelectorAll('.acc-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var acc = q.parentElement, panel = q.nextElementSibling;
      var isOpen = acc.classList.contains('open');
      document.querySelectorAll('.acc.open').forEach(function (o) {
        o.classList.remove('open');
        o.querySelector('.acc-a').style.maxHeight = null;
      });
      if (!isOpen) { acc.classList.add('open'); panel.style.maxHeight = panel.scrollHeight + 'px'; }
    });
  });

  var rev = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && rev.length) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    rev.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });
  } else { rev.forEach(function (el) { el.classList.add('in'); }); }

  var stats = document.querySelectorAll('.stat .n[data-count]');
  if ('IntersectionObserver' in window && stats.length) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, target = parseInt(el.dataset.count, 10), sfx = el.dataset.suffix || '', t0 = null;
        function tick(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / 1100, 1), k = 1 - Math.pow(1 - p, 3);
          el.innerHTML = Math.round(target * k) + '<em>' + sfx + '</em>';
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick); so.unobserve(el);
      });
    }, { threshold: 0.5 });
    stats.forEach(function (s) { so.observe(s); });
  }

  /* Case study filtering + deep links (?domain=ai) */
  var filterBtns = document.querySelectorAll('.filter');
  var cards = document.querySelectorAll('[data-tags]');
  var note = document.querySelector('.filter-note');
  var empty = document.querySelector('.no-results');
  var LABELS = {
    ai: 'Enterprise AI, Agents &amp; RAG',
    ged: 'AI-Powered Document Management',
    workplace: 'Microsoft 365 &amp; Digital Workplace',
    automation: 'Business Process Automation',
    apps: 'Custom Apps &amp; Digital Commerce'
  };

  function applyFilter(key, updateUrl) {
    var shown = 0;
    cards.forEach(function (c) {
      var show = key === 'all' || c.dataset.tags.split(' ').indexOf(key) !== -1;
      c.style.display = show ? '' : 'none';
      if (show) shown++;
    });
    filterBtns.forEach(function (b) { b.classList.toggle('active', b.dataset.filter === key); });
    if (note) {
      if (key !== 'all' && LABELS[key]) {
        note.innerHTML = 'Showing <b>' + shown + '</b> case ' + (shown === 1 ? 'study' : 'studies') +
          ' for <b>' + LABELS[key] + '</b>. <a href="#" class="clear-filter">Show all case studies</a>';
        note.classList.add('show');
      } else { note.classList.remove('show'); }
    }
    if (empty) empty.classList.toggle('show', shown === 0);
    if (updateUrl && window.history && history.replaceState) {
      history.replaceState(null, '', location.pathname + (key === 'all' ? '' : '?domain=' + key));
    }
  }

  if (filterBtns.length && cards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () { applyFilter(btn.dataset.filter, true); });
    });
    document.addEventListener('click', function (e) {
      if (e.target.classList && e.target.classList.contains('clear-filter')) {
        e.preventDefault(); applyFilter('all', true);
      }
    });
    var domain = new URLSearchParams(location.search).get('domain');
    if (domain && LABELS[domain]) {
      applyFilter(domain, false);
      var anchor = document.getElementById('results');
      if (anchor) setTimeout(function () {
        anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  }

  /* Contact form: send the details to the business mailbox, then open the Microsoft Bookings page.
     FORM_ENDPOINT is the URL of the Power Automate flow ("When an HTTP request is received" ->
     "Send an email (V2)" to business@consultim-it.com). While it is empty, visitors go straight to
     the booking page (Bookings collects their name and email itself). */
  var BOOKING_URL = 'https://bookings.cloud.microsoft/bookwithme/user/1c5d01a02d78481c9f96da31aaf60afd%40consultim-it.com/meetingtype/GDlLBOOVQkm81cm6lvuwYg2?bookingcode=de9d51d5-3a09-4f76-a5e4-484b9170574a&anonymous&ismsaljsauthenabled';
  var FORM_ENDPOINT = '';

  document.querySelectorAll('form[data-booking]').forEach(function (f) {
    var status = f.querySelector('.form-status');
    var error = f.querySelector('.form-error');
    var btn = f.querySelector('button[type="submit"]');

    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (error) error.classList.remove('show');
      if (!f.checkValidity()) { f.reportValidity(); return; }
      var d = {};
      new FormData(f).forEach(function (v, k) { d[k] = v; });
      if (d.website) return; /* spam trap field was filled in */

      var go = function () { window.location.href = BOOKING_URL; };
      if (!FORM_ENDPOINT) { go(); return; }

      btn.disabled = true;
      if (status) { status.textContent = f.getAttribute('data-sending') || ''; status.classList.add('show'); }
      var payload = {
        name: d.name, organisation: d.org, email: d.email, country: d.country || '',
        topic: d.topic || '', message: d.msg || '', consent: !!d.consent,
        language: document.documentElement.lang || 'en', page: location.href, sent: new Date().toISOString()
      };
      var ctrl = window.AbortController ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 10000);
      /* text/plain + no-cors avoids a cross-site preflight that Power Automate does not answer */
      fetch(FORM_ENDPOINT, {
        method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload), signal: ctrl ? ctrl.signal : undefined
      }).then(function () {
        clearTimeout(timer);
        if (status) status.textContent = f.getAttribute('data-success') || '';
        setTimeout(go, 600);
      }).catch(function () {
        clearTimeout(timer);
        btn.disabled = false;
        if (status) status.classList.remove('show');
        if (error) { error.classList.add('show'); error.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      });
    });
  });

  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links > li > a').forEach(function (a) {
    if (a.getAttribute('href') === here) a.classList.add('active');
  });
})();

/* Case studies: two by two. One case open at a time; the opened case takes the
   full row where it stands and its neighbour moves down. A deep link (#id) opens it. */
(function () {
  var grid = document.querySelector('.case-grid');
  if (!grid) return;
  var cards = [].slice.call(grid.querySelectorAll('.case-detail'));
  var twoCols = window.matchMedia('(min-width: 761px)');

  function layout() {
    cards.forEach(function (c, i) { c.style.order = i * 2; });
    if (!twoCols.matches) return;
    var visible = cards.filter(function (c) { return c.style.display !== 'none'; });
    visible.forEach(function (c, pos) {
      if (pos % 2 === 1 && c.querySelector('details.case-more').open) {
        c.style.order = parseInt(visible[pos - 1].style.order, 10) - 1;
      }
    });
  }

  cards.forEach(function (c) {
    var d = c.querySelector('details.case-more');
    if (!d) return;
    d.addEventListener('toggle', function () {
      if (d.open) {
        cards.forEach(function (o) {
          var od = o.querySelector('details.case-more');
          if (o !== c && od && od.open) od.open = false;
        });
      }
      layout();
    });
  });
  document.querySelectorAll('.filter').forEach(function (b) { b.addEventListener('click', layout); });
  if (twoCols.addEventListener) twoCols.addEventListener('change', layout);
  layout();

  var id = location.hash.slice(1);
  var target = id && document.getElementById(id);
  var td = target && target.querySelector('details.case-more');
  if (td) { td.open = true; target.scrollIntoView(); }
})();
