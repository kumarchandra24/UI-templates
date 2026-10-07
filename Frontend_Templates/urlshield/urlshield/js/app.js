(function () {
  const PAGES = [['index.html', 'Dashboard'], ['analyzer.html', 'URL Analyzer'], ['analytics.html', 'Threat Analytics'], ['history.html', 'Scan History'], ['help.html', 'Help Center']];
  const cur = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const logo = '<svg viewBox="0 0 32 32" fill="none"><path d="M16 2l12 4.5v9.2c0 7.2-4.8 12.4-12 14.3C8.8 28.100 4 22.900 4 15.700V6.500L16 2z" fill="#141D3A" stroke="#6C8CFF" stroke-width="2"/><path d="M10.500 16.500l4 4 7.500-8" stroke="#9FE7FF" stroke-width="2.600" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const nav = document.getElementById('nav');
  if (nav) {
    nav.outerHTML = `<header class="nav"><a class="brand" href="index.html">${logo}URLShield</a>
      <button class="burger" aria-label="Menu" id="burger">Menu</button>
      <nav class="links" id="links">${PAGES.map(([h, t]) => `<a href="${h}" class="${h === cur ? 'active' : ''}">${t}</a>`).join('')}</nav></header>`;
    document.getElementById('burger').onclick = () => document.getElementById('links').classList.toggle('open');
  }
  const foot = document.getElementById('foot');
  if (foot) foot.outerHTML = '<footer>URLShield — educational phishing-screening demo. Scores are heuristic risk estimates, not a guarantee. Always verify sensitive links through the official app or site.</footer>';

  const KEY = 'urlshield_history_v1';
  const H = window.History_ = {
    all() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return window.__mem || []; } },
    save(list) { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { window.__mem = list; } },
    add(r) {
      const list = H.all();
      list.unshift({ t: Date.now(), url: r.url, domain: r.domain, score: r.score, verdict: r.verdict, https: r.https, reason: (r.flags[0] || {}).text || r.good[0] || '' });
      H.save(list.slice(0, 300));
    },
    clear() { H.save([]); }
  };
  window.fmtTime = t => new Date(t).toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  window.esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  window.VLABEL = { safe: 'Legitimate', suspicious: 'Suspicious', phishing: 'Potential Phishing' };
  window.VEMOJI = { safe: '🟢', suspicious: '🟡', phishing: '🔴' };
  window.toast = msg => {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2400);
  };
  window.countUp = (el, to, ms = 1100, suffix = '') => {
    const t0 = performance.now();
    (function f(t) { const k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(to * e) + suffix; if (k < 1) requestAnimationFrame(f); })(t0);
  };
  window.badge = v => `<span class="badge ${v}"><span class="dot ${v}" style="margin:0"></span>${VLABEL[v]}</span>`;
})();
