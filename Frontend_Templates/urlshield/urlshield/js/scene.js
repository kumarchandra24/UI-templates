/* 3D hero: a wireframe "shield core" ringed by link-nodes. Safe nodes glow green,
   a few threat nodes pulse red and get intercepted by the scanning ring. */
(function () {
  const canvas = document.getElementById('scene');
  if (!canvas || !window.THREE) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0, 9);
  const group = new THREE.Group(); scene.add(group);

  // core
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.7, 1),
    new THREE.MeshBasicMaterial({ color: 0x6c8cff, wireframe: true, transparent: true, opacity: 0.55 }));
  const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(1.15, 0),
    new THREE.MeshBasicMaterial({ color: 0x9fe7ff, wireframe: true, transparent: true, opacity: 0.9 }));
  const glow = new THREE.Mesh(new THREE.SphereGeometry(0.62, 32, 32), new THREE.MeshBasicMaterial({ color: 0x2dd4a0, transparent: true, opacity: 0.55 }));
  group.add(core, inner, glow);

  // scanning rings
  const rings = [];
  [2.6, 3.2, 3.8].forEach((r, i) => {
    const m = new THREE.Mesh(new THREE.TorusGeometry(r, 0.012, 8, 160), new THREE.MeshBasicMaterial({ color: i === 1 ? 0x9fe7ff : 0x6c8cff, transparent: true, opacity: 0.5 }));
    m.rotation.x = Math.PI / 2 + i * 0.5; m.rotation.y = i * 0.7; rings.push(m); group.add(m);
  });

  // link nodes on a sphere
  const N = 150, nodes = [], pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  const cSafe = new THREE.Color(0x2dd4a0), cBad = new THREE.Color(0xff4d6a), cWarn = new THREE.Color(0xffc247);
  for (let i = 0; i < N; i++) {
    const phi = Math.acos(1 - 2 * (i + 0.5) / N), th = Math.PI * (1 + Math.sqrt(5)) * i;
    const rad = 4.2 + (i % 5) * 0.28;
    const x = rad * Math.cos(th) * Math.sin(phi), y = rad * Math.sin(th) * Math.sin(phi), z = rad * Math.cos(phi);
    pos.set([x, y, z], i * 3);
    const k = i % 17 === 0 ? 'bad' : i % 11 === 0 ? 'warn' : 'safe';
    const c = k === 'bad' ? cBad : k === 'warn' ? cWarn : cSafe;
    col.set([c.r, c.g, c.b], i * 3); nodes.push({ x, y, z, k });
  }
  const pg = new THREE.BufferGeometry();
  pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  pg.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const pts = new THREE.Points(pg, new THREE.PointsMaterial({ size: 0.11, vertexColors: true, transparent: true, opacity: 0.95, sizeAttenuation: true }));
  group.add(pts);

  // connection lines from some nodes toward the core
  const lp = [];
  nodes.forEach((n, i) => { if (i % 6 === 0) { lp.push(n.x * 0.42, n.y * 0.42, n.z * 0.42, n.x, n.y, n.z); } });
  const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(lp, 3));
  group.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0x6c8cff, transparent: true, opacity: 0.22 })));

  // starfield
  const sp = new Float32Array(600 * 3); for (let i = 0; i < sp.length; i++) sp[i] = (Math.random() - 0.5) * 40;
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ size: 0.04, color: 0x93a0c8, transparent: true, opacity: 0.6 })));

  let mx = 0, my = 0;
  addEventListener('pointermove', e => { mx = (e.clientX / innerWidth - 0.5); my = (e.clientY / innerHeight - 0.5); });
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    group.position.x = w > 900 ? 3.1 : 0; group.position.y = w > 900 ? 0 : -1.6; group.scale.setScalar(w > 900 ? 1 : 0.72);
  }
  addEventListener('resize', resize); resize();

  let t = 0, visible = true;
  new IntersectionObserver(e => visible = e[0].isIntersecting).observe(canvas);
  function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    t += reduce ? 0 : 0.01;
    core.rotation.y = t * 0.6; core.rotation.x = t * 0.3;
    inner.rotation.y = -t * 1.1; inner.rotation.z = t * 0.5;
    glow.scale.setScalar(1 + Math.sin(t * 3) * 0.08);
    rings.forEach((r, i) => { r.rotation.z += 0.004 * (i + 1) * (i % 2 ? -1 : 1); });
    pts.rotation.y = t * 0.12; pts.rotation.x = Math.sin(t * 0.3) * 0.15;
    group.rotation.y += (mx * 0.6 - group.rotation.y) * 0.04;
    group.rotation.x += (my * 0.35 - group.rotation.x) * 0.04;
    pts.material.size = 0.11 + Math.sin(t * 4) * 0.015;
    renderer.render(scene, camera);
  }
  frame();
})();
