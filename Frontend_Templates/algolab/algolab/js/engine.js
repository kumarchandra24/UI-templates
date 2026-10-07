/* engine.js – the step player and 3D renderer shared by every topic page. */
(function () {
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;'}[c]));
  const NS = 'http://www.w3.org/2000/svg';
  const key = document.body.dataset.topic, topic = TOPICS.find(t => t.key === key), algos = ALGOS[key];
  let algo, frames = [], i = 0, timer = null, rx = 18, ry = -10, scale = 1, bound = {x:0, y:0};
  const nodes = new Map();

  $('#app').innerHTML = `<h1>${topic.title}</h1><p class="lead">${topic.intro}</p>
  <div class="tabs" id="tabs">${algos.map((a, k) => `<button data-k="${k}">${a.name}</button>`).join('')}</div>
  <section class="studio">
   <div class="stage" id="stage"><div class="board" id="board"><svg id="edges" width="1" height="1"><defs><marker id="ah" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8aa0b8"/></marker></defs></svg></div><span class="hint">Drag to rotate the 3D view</span></div>
   <div class="legend"><span><b style="background:#ffd166"></b>Comparing</span><span><b style="background:#ff7a59"></b>Changed / swapped</span><span><b style="background:#b69cff"></b>Selected / waiting</span><span><b style="background:#4fe3c1"></b>Done</span></div>
   <p class="msg" id="msg" aria-live="polite"></p>
   <div class="bar"><button id="prev">◀ Back</button><button id="play">▶ Play</button><button id="next">Step ▶</button><button id="reset" class="ghost">Reset</button><label>Speed <input id="spd" type="range" min="1" max="10" value="6"></label><span id="cnt"></span></div>
   <form class="inputs" id="form"><label>Input <input id="inp" type="text" aria-label="Input"></label><label id="pl" hidden><span id="plt"></span> <input id="par" type="text" style="width:90px"></label><button>Run</button><button type="button" id="rnd" class="ghost" hidden>Random</button></form>
  </section>
  <section class="cols"><div><h2>Code (Python-style)</h2><pre id="code"></pre></div><div id="info"></div></section>
  <nav class="pager" id="pager"></nav>`;

  const visual = TOPICS.filter(t => !t.hidden), at = visual.findIndex(t => t.key === key), prev = visual[at - 1], next = visual[at + 1];
  $('#pager').innerHTML = (prev ? `<a href="${prev.key}.html">← ${prev.title}</a>` : '<span></span>') + (next ? `<a href="${next.key}.html">${next.title} →</a>` : '');

  function select(k) {
    algo = algos[k]; stop();
    document.querySelectorAll('#tabs button').forEach((b, n) => b.classList.toggle('on', n === k));
    $('#inp').value = algo.input; $('#pl').hidden = !algo.param; $('#plt').textContent = algo.param || ''; $('#par').value = algo.par || '';
    $('#rnd').hidden = !algo.rand;
    $('#code').innerHTML = algo.code.map((c, n) => `<span data-n="${n + 1}">${esc(c)}</span>`).join('');
    $('#info').innerHTML = `<h2>${algo.name}</h2><p>${algo.why}</p><p><strong>When to use it:</strong> ${algo.use}</p>
      <table class="cx">${algo.cx.map(([a, b]) => `<tr><th>${a}</th><td>${b}</td></tr>`).join('')}</table><p class="note">${algo.tip}</p>`;
    run();
  }
  function run() {
    stop(); frames = algo.run($('#inp').value, $('#par').value); i = 0; bound = {x:60, y:60};
    frames.forEach(f => f.n.forEach(n => { bound.x = Math.max(bound.x, n.x + n.w); bound.y = Math.max(bound.y, n.y + n.h + 16); }));
    nodes.forEach(el => el.remove()); nodes.clear(); fit(); draw();
  }
  function fit() {
    const st = $('#stage'); scale = Math.min(1, (st.clientWidth - 40) / (bound.x + 8));
    $('#board').style.width = bound.x + 'px'; $('#board').style.height = bound.y + 'px';
    st.style.height = Math.max(250, bound.y * scale + 110) + 'px'; tilt();
  }
  const tilt = () => { $('#board').style.transform = `translateX(-50%) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`; };
  function draw() {
    const fr = frames[i], seen = new Set(), pos = new Map(fr.n.map(n => [String(n.id), n]));
    fr.n.forEach(n => {
      const k = String(n.id); seen.add(k); let el = nodes.get(k);
      if (!el) { el = document.createElement('div'); $('#board').appendChild(el); nodes.set(k, el); }
      el.className = 'node ' + (n.s || ''); el.style.cssText = `left:${n.x}px;top:${n.y}px;width:${n.w}px;height:${n.h}px`;
      el.innerHTML = esc(n.t) + (n.g ? `<i>${esc(n.g)}</i>` : '');
    });
    nodes.forEach((el, k) => { if (!seen.has(k)) { el.remove(); nodes.delete(k); } });
    const svg = $('#edges'); svg.querySelectorAll('line').forEach(l => l.remove());
    fr.e.forEach(([a, b]) => {
      const p = pos.get(String(a)), q = pos.get(String(b)); if (!p || !q) return;
      const L = document.createElementNS(NS, 'line'), ar = algo.arrows;
      L.setAttribute('x1', ar ? p.x + p.w : p.x + p.w / 2); L.setAttribute('y1', p.y + p.h / 2); L.setAttribute('x2', ar ? q.x : q.x + q.w / 2); L.setAttribute('y2', q.y + q.h / 2);
      if (ar) L.setAttribute('marker-end', 'url(#ah)'); svg.appendChild(L);
    });
    document.querySelectorAll('#code span').forEach((s, n) => s.classList.toggle('on', n === fr.l));
    $('#msg').textContent = fr.m; $('#cnt').textContent = `Step ${i + 1} / ${frames.length}`;
  }
  function stop() { clearInterval(timer); timer = null; const b = $('#play'); if (b) b.textContent = '▶ Play'; }
  function play() {
    if (timer) return stop(); if (i >= frames.length - 1) { i = 0; draw(); }
    $('#play').textContent = '⏸ Pause';
    timer = setInterval(() => { if (i >= frames.length - 1) return stop(); i++; draw(); }, 1150 - $('#spd').value * 100);
  }
  $('#tabs').onclick = e => { if (e.target.dataset.k) select(+e.target.dataset.k); };
  $('#form').onsubmit = e => { e.preventDefault(); run(); };
  $('#rnd').onclick = () => { $('#inp').value = algo.rand(); run(); };
  $('#next').onclick = () => { stop(); if (i < frames.length - 1) { i++; draw(); } };
  $('#prev').onclick = () => { stop(); if (i > 0) { i--; draw(); } };
  $('#reset').onclick = () => { stop(); i = 0; draw(); };
  $('#play').onclick = play;
  $('#spd').oninput = () => { if (timer) { stop(); play(); } };
  let drag = null;
  $('#stage').addEventListener('pointerdown', e => { drag = [e.clientX, e.clientY, rx, ry]; });
  addEventListener('pointerup', () => { drag = null; });
  addEventListener('pointermove', e => { if (!drag) return; ry = Math.max(-55, Math.min(55, drag[3] + (e.clientX - drag[0]) * .4)); rx = Math.max(0, Math.min(60, drag[2] - (e.clientY - drag[1]) * .3)); tilt(); });
  addEventListener('resize', fit);
  select(0);
})();
