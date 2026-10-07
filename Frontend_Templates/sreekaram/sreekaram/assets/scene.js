/* Farmer <-> Customer direct link, rendered with three.js */
function skScene(canvas, zoom) {
  if (!window.THREE) return;
  const T = THREE;
  const renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 2.6, zoom || 10);
  camera.lookAt(0, 1.2, 0);
  scene.add(new T.HemisphereLight(0xcdf7dd, 0x1b3a26, 0.95));
  const key = new T.DirectionalLight(0xffefc2, 1.2);
  key.position.set(3, 7, 6);
  scene.add(key);

  const std = (c, o) => new T.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.65 }, o));
  const add = (g, geo, mat, x, y, z) => { const m = new T.Mesh(geo, mat); m.position.set(x, y, z); g.add(m); return m; };

  function person(shirt, hatColor, skin) {
    const p = new T.Group();
    add(p, new T.CylinderGeometry(0.34, 0.42, 0.9, 20), std(shirt), 0, 1.15, 0);          // torso
    add(p, new T.SphereGeometry(0.28, 24, 24), std(skin), 0, 1.85, 0);                    // head
    add(p, new T.CylinderGeometry(0.17, 0.17, 0.75, 12), std(0x2c3e50), -0.17, 0.4, 0);   // legs
    add(p, new T.CylinderGeometry(0.17, 0.17, 0.75, 12), std(0x2c3e50), 0.17, 0.4, 0);
    p.userData.armL = add(p, new T.CylinderGeometry(0.09, 0.09, 0.75, 10), std(shirt), -0.5, 1.2, 0);
    p.userData.armR = add(p, new T.CylinderGeometry(0.09, 0.09, 0.75, 10), std(shirt), 0.5, 1.2, 0);
    if (hatColor) {
      add(p, new T.CylinderGeometry(0.5, 0.5, 0.04, 28), std(hatColor), 0, 2.07, 0);      // hat brim
      add(p, new T.CylinderGeometry(0.2, 0.26, 0.2, 20), std(hatColor), 0, 2.18, 0);      // hat crown
    }
    return p;
  }
  const platform = (c) => { const g = new T.Group(); add(g, new T.CylinderGeometry(1.5, 1.7, 0.25, 48), std(c), 0, -0.12, 0); return g; };

  // Farmer (left): straw hat, green shirt, standing among crops
  const farmerG = platform(0x2f8a56);
  const farmer = person(0x3aa564, 0xd9b86a, 0xc68642);
  farmerG.add(farmer);
  for (let i = 0; i < 9; i++) {
    const c = new T.Mesh(new T.ConeGeometry(0.09, 0.45, 6), std(i % 3 ? 0x9bf0b8 : 0xd9b86a));
    const a = (i / 9) * Math.PI * 2;
    c.position.set(Math.cos(a) * 1.15, 0.22, Math.sin(a) * 1.15);
    c.userData.s = i;
    farmerG.add(c);
  }
  farmerG.position.set(-3.4, 0, 0);
  farmerG.rotation.y = 0.5;
  scene.add(farmerG);

  // Customer (right): white shirt, holding a basket
  const custG = platform(0xb9923f);
  const cust = person(0xe8eef2, null, 0xe0ac69);
  custG.add(cust);
  add(custG, new T.CylinderGeometry(0.4, 0.3, 0.3, 16), std(0x8b5a2b), 0.65, 0.95, 0.3);
  custG.position.set(3.4, 0, 0);
  custG.rotation.y = -0.5;
  scene.add(custG);

  // Direct links: produce flows to the customer, payment flows back, nothing in between
  const A = new T.Vector3(-2.7, 1.9, 0), B = new T.Vector3(2.7, 1.9, 0);
  function link(lift, color) {
    const curve = new T.CatmullRomCurve3([A, new T.Vector3(0, 1.9 + lift, 0), B]);
    const tube = new T.Mesh(new T.TubeGeometry(curve, 60, 0.025, 8, false),
      new T.MeshBasicMaterial({ color, transparent: true, opacity: 0.55 }));
    scene.add(tube);
    return curve;
  }
  const up = link(1.1, 0x5fd38d), down = link(-0.5, 0xd9b86a);
  const pulse = (c) => { const m = new T.Mesh(new T.SphereGeometry(0.11, 16, 16), new T.MeshBasicMaterial({ color: c })); scene.add(m); return m; };
  const goods = [0, 1, 2, 3].map(() => pulse(0x9bf0b8)), money = [0, 1, 2, 3].map(() => pulse(0xf3d98b));

  let mx = 0;
  addEventListener("mousemove", (e) => { mx = e.clientX / innerWidth - 0.5; });
  function fit() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  addEventListener("resize", fit);
  fit();

  (function loop(t) {
    t = (t || 0) / 1000;
    scene.rotation.y = Math.sin(t * 0.4) * 0.18 + mx * 0.5;
    goods.forEach((m, i) => m.position.copy(up.getPoint(((t * 0.25 + i / 4) % 1))));
    money.forEach((m, i) => m.position.copy(down.getPoint(1 - ((t * 0.25 + i / 4) % 1))));
    farmer.userData.armR.rotation.z = -0.9 + Math.sin(t * 2) * 0.25;
    cust.userData.armL.rotation.z = 0.9 - Math.sin(t * 2 + 1) * 0.25;
    farmerG.position.y = Math.sin(t) * 0.06;
    custG.position.y = Math.sin(t + 1) * 0.06;
    farmerG.children.forEach((c) => { if (c.userData.s !== undefined) c.scale.y = 1 + Math.sin(t * 2 + c.userData.s) * 0.18; });
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  })();
}
