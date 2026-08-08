import { THREE } from '../vendor.js';
import { getDeviceTier, lerp } from '../utils.js';

/**
 * Abstract interlocking rings + geometric core — three friends motif.
 */
export function createSculptureScene(canvas) {
  if (!canvas) return null;

  const tier = getDeviceTier();
  if (tier === 'minimal') {
    canvas.style.display = 'none';
    return null;
  }

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: tier === 'high',
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, tier === 'low' ? 1.2 : 1.7));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0b0b0a, 0.035);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0.3, 7);

  scene.add(new THREE.AmbientLight(0x756b58, 0.4));
  const key = new THREE.DirectionalLight(0xe8e1d5, 1.5);
  key.position.set(4, 5, 6);
  scene.add(key);
  const fill = new THREE.PointLight(0xb9a88a, 3, 20);
  fill.position.set(-2, 1, 3);
  scene.add(fill);

  const root = new THREE.Group();
  scene.add(root);

  const gold = new THREE.MeshStandardMaterial({
    color: 0xb9a88a,
    metalness: 0.95,
    roughness: 0.22,
  });
  const bronze = new THREE.MeshStandardMaterial({
    color: 0x756b58,
    metalness: 0.9,
    roughness: 0.35,
  });
  const ivory = new THREE.MeshStandardMaterial({
    color: 0xe8e1d5,
    metalness: 0.7,
    roughness: 0.3,
  });

  // Three interlocking torus rings
  const rings = [];
  const ringConfigs = [
    { rot: [Math.PI / 2, 0, 0], mat: gold },
    { rot: [Math.PI / 2.6, Math.PI / 3, 0.2], mat: bronze },
    { rot: [Math.PI / 3.2, -Math.PI / 3.5, -0.15], mat: ivory },
  ];

  ringConfigs.forEach((cfg) => {
    const torus = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.07, 24, 100), cfg.mat);
    torus.rotation.set(...cfg.rot);
    root.add(torus);
    rings.push(torus);
  });

  // Central geometric crystal
  const crystal = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 0), gold);
  root.add(crystal);

  // Floating year digits as thin boxes forming abstract "26"
  const digitGroup = new THREE.Group();
  digitGroup.position.set(0, -2.2, 0);
  const bar = (w, h, d, x, y) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), bronze);
    m.position.set(x, y, 0);
    digitGroup.add(m);
  };
  // stylized mark
  bar(0.08, 0.9, 0.08, -0.45, 0);
  bar(0.55, 0.08, 0.08, -0.2, 0.4);
  bar(0.55, 0.08, 0.08, -0.2, 0);
  bar(0.55, 0.08, 0.08, -0.2, -0.4);
  bar(0.08, 0.9, 0.08, 0.55, 0);
  bar(0.5, 0.08, 0.08, 0.8, 0.4);
  bar(0.5, 0.08, 0.08, 0.8, -0.4);
  root.add(digitGroup);

  // Particles
  const count = tier === 'low' ? 200 : 500;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 2 + Math.random() * 4;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const points = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({
      color: 0xe8e1d5,
      size: 0.018,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    })
  );
  scene.add(points);

  const pointer = { x: 0, y: 0 };
  const smooth = { x: 0, y: 0 };
  let running = false;
  let raf = 0;
  const clock = new THREE.Clock();

  const onPointer = (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener('pointermove', onPointer, { passive: true });

  const resize = () => {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize);

  const render = () => {
    if (!running) return;
    const t = clock.getElapsedTime();
    smooth.x = lerp(smooth.x, pointer.x, 0.04);
    smooth.y = lerp(smooth.y, pointer.y, 0.04);

    root.rotation.y = t * 0.18 + smooth.x * 0.4;
    root.rotation.x = 0.2 + Math.sin(t * 0.35) * 0.08 + smooth.y * 0.2;

    crystal.rotation.x = t * 0.4;
    crystal.rotation.y = t * 0.55;

    rings.forEach((r, i) => {
      r.rotation.z += 0.0015 * (i + 1);
    });

    fill.position.x = Math.sin(t * 0.5) * 3;
    fill.position.z = 3 + Math.cos(t * 0.4) * 2;

    camera.position.x = lerp(camera.position.x, smooth.x * 0.5, 0.05);
    camera.position.y = lerp(camera.position.y, 0.3 + smooth.y * 0.3, 0.05);
    camera.lookAt(0, 0, 0);

    points.rotation.y = t * 0.05;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(render);
  };

  const io = new IntersectionObserver(
    ([entry]) => {
      running = entry.isIntersecting;
      if (running) raf = requestAnimationFrame(render);
      else cancelAnimationFrame(raf);
    },
    { threshold: 0.05 }
  );
  io.observe(canvas);

  return {
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', resize);
      renderer.dispose();
    },
  };
}
