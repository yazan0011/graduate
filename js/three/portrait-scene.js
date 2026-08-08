import { THREE } from '../vendor.js';
import { CONFIG } from '../config.js';
import { getDeviceTier, lerp, clamp } from '../utils.js';

function loadTexture(url, loader) {
  return new Promise((resolve) => {
    loader.load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        resolve(tex);
      },
      undefined,
      () => resolve(null)
    );
  });
}

export async function createPortraitScene(canvas) {
  if (!canvas) return null;

  const tier = getDeviceTier();
  if (tier === 'minimal') {
    canvas.style.display = 'none';
    return null;
  }

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: tier !== 'low',
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, tier === 'low' ? 1.2 : 1.6));
  renderer.setClearColor(0x0b0b0a, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0b0b0a, 0.06);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 8);

  scene.add(new THREE.AmbientLight(0xb9a88a, 0.45));
  const key = new THREE.DirectionalLight(0xe8e1d5, 1.1);
  key.position.set(2, 3, 4);
  scene.add(key);

  const loader = new THREE.TextureLoader();
  const textures = await Promise.all(
    CONFIG.graduates.map((g) => loadTexture(g.image, loader))
  );

  const frames = [];
  const startPositions = [
    new THREE.Vector3(-3.8, 0.6, -1.5),
    new THREE.Vector3(0, -0.3, 0.5),
    new THREE.Vector3(3.8, 0.5, -1.2),
  ];
  const endPositions = [
    new THREE.Vector3(-1.55, 0.1, 0.2),
    new THREE.Vector3(0, 0.15, 0.8),
    new THREE.Vector3(1.55, 0.05, 0.2),
  ];

  CONFIG.graduates.forEach((_, i) => {
    const group = new THREE.Group();
    const w = 1.6;
    const h = 2.1;
    const geo = new THREE.PlaneGeometry(w, h);
    const mat = new THREE.MeshStandardMaterial({
      map: textures[i],
      color: textures[i] ? 0xffffff : 0x756b58,
      roughness: 0.65,
      metalness: 0.05,
    });
    const plane = new THREE.Mesh(geo, mat);
    group.add(plane);

    // Thin gold frame edge
    const edge = new THREE.Mesh(
      new THREE.PlaneGeometry(w + 0.06, h + 0.06),
      new THREE.MeshBasicMaterial({ color: 0xb9a88a, transparent: true, opacity: 0.35 })
    );
    edge.position.z = -0.01;
    group.add(edge);

    group.position.copy(startPositions[i]);
    group.rotation.y = (i - 1) * 0.25;
    scene.add(group);
    frames.push({ group, start: startPositions[i], end: endPositions[i], baseRotY: (i - 1) * 0.25 });
  });

  // Particle field
  const count = tier === 'low' ? 120 : 320;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const points = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({
      color: 0xb9a88a,
      size: 0.02,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    })
  );
  scene.add(points);

  let progress = 0;
  let targetProgress = 0;
  let running = false;
  let raf = 0;
  const clock = new THREE.Clock();
  const pointer = { x: 0, y: 0 };

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
    progress = lerp(progress, targetProgress, 0.06);

    frames.forEach((f, i) => {
      f.group.position.lerpVectors(f.start, f.end, progress);
      f.group.rotation.y = f.baseRotY * (1 - progress * 0.85) + pointer.x * 0.08;
      f.group.rotation.x = pointer.y * 0.05;
      f.group.position.y += Math.sin(t * 0.8 + i) * 0.002;
    });

    camera.position.z = lerp(8, 5.2, progress);
    camera.position.x = lerp(camera.position.x, pointer.x * 0.3, 0.05);
    camera.lookAt(0, 0.1, 0);

    points.rotation.y = t * 0.03;
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
    setProgress(p) {
      targetProgress = clamp(p, 0, 1);
    },
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
