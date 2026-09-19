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

  document.querySelectorAll('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var ok = f.querySelector('.form-success');
      if (ok) { ok.classList.add('show'); ok.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      f.reset();
    });
  });

  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links > li > a').forEach(function (a) {
    if (a.getAttribute('href') === here) a.classList.add('active');
  });
})();
