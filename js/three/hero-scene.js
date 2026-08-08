import { THREE } from '../vendor.js';
import { getDeviceTier, lerp } from '../utils.js';

export function createHeroScene(canvas) {
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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, tier === 'low' ? 1.25 : 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0b0b0a, 0.045);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.2, 6.5);

  // Lights
  const ambient = new THREE.AmbientLight(0xb9a88a, 0.35);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xe8e1d5, 1.4);
  key.position.set(3, 4, 5);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x756b58, 0.7);
  rim.position.set(-4, -1, -3);
  scene.add(rim);

  const point = new THREE.PointLight(0xb9a88a, 2.2, 18);
  point.position.set(0, 1.2, 2);
  scene.add(point);

  const group = new THREE.Group();
  scene.add(group);

  // Metallic material
  const metal = new THREE.MeshStandardMaterial({
    color: 0xb9a88a,
    metalness: 0.92,
    roughness: 0.28,
    envMapIntensity: 1,
  });

  const darkMetal = new THREE.MeshStandardMaterial({
    color: 0x3a3630,
    metalness: 0.85,
    roughness: 0.4,
  });

  // Abstract graduation-cap inspired form (sculptural)
  const brim = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.06, 2.4), metal);
  brim.position.y = 0.55;
  group.add(brim);

  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.7, 0.55, 32), darkMetal);
  crown.position.y = 0.25;
  group.add(crown);

  const tasselCord = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.9, 8),
    metal
  );
  tasselCord.position.set(0.9, 0.2, 0.9);
  tasselCord.rotation.z = 0.35;
  group.add(tasselCord);

  const tassel = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), metal);
  tassel.position.set(1.05, -0.2, 1.05);
  group.add(tassel);

  // Floating glass shards / abstract planes
  const glassMat =
    tier === 'high'
      ? new THREE.MeshPhysicalMaterial({
          color: 0xe8e1d5,
          metalness: 0.05,
          roughness: 0.12,
          transmission: 0.7,
          thickness: 0.35,
          transparent: true,
          opacity: 0.55,
        })
      : new THREE.MeshStandardMaterial({
          color: 0xe8e1d5,
          metalness: 0.35,
          roughness: 0.2,
          transparent: true,
          opacity: 0.22,
        });

  const shards = [];
  const shardCount = tier === 'low' ? 3 : tier === 'medium' ? 5 : 8;
  for (let i = 0; i < shardCount; i++) {
    const geo = new THREE.PlaneGeometry(0.6 + Math.random() * 0.8, 0.8 + Math.random() * 0.6);
    const mesh = new THREE.Mesh(geo, glassMat.clone());
    mesh.position.set(
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 3,
      (Math.random() - 0.5) * 4 - 1
    );
    mesh.rotation.set(Math.random() * 0.5, Math.random() * Math.PI, Math.random() * 0.4);
    group.add(mesh);
    shards.push({
      mesh,
      speed: 0.15 + Math.random() * 0.25,
      amp: 0.15 + Math.random() * 0.2,
      phase: Math.random() * Math.PI * 2,
    });
  }

  // Thin glowing rings
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xb9a88a,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide,
  });
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(1.8 + i * 0.45, 1.82 + i * 0.45, 64), ringMat);
    ring.rotation.x = Math.PI / 2.4 + i * 0.15;
    ring.position.y = -0.3 + i * 0.15;
    group.add(ring);
  }

  // Particles
  const count = tier === 'low' ? 180 : tier === 'medium' ? 420 : 700;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0xb9a88a,
    size: tier === 'low' ? 0.018 : 0.022,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const points = new THREE.Points(pGeo, pMat);
  scene.add(points);

  // Soft ground plane reflection hint
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(4, 48),
    new THREE.MeshStandardMaterial({
      color: 0x141412,
      metalness: 0.7,
      roughness: 0.55,
      transparent: true,
      opacity: 0.35,
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.1;
  scene.add(floor);

  group.position.y = 0.15;
  group.rotation.x = 0.15;

  const pointer = { x: 0, y: 0 };
  const smooth = { x: 0, y: 0 };
  let running = true;
  let raf = 0;
  const clock = new THREE.Clock();

  const onPointer = (e) => {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    pointer.x = (x / window.innerWidth) * 2 - 1;
    pointer.y = (y / window.innerHeight) * 2 - 1;
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

    group.rotation.y = t * 0.12 + smooth.x * 0.35;
    group.rotation.x = 0.15 + smooth.y * 0.15;
    group.position.y = 0.15 + Math.sin(t * 0.6) * 0.08;

    point.position.x = Math.sin(t * 0.4) * 2 + smooth.x * 1.5;
    point.position.z = 2 + Math.cos(t * 0.35) * 1.2;

    camera.position.x = lerp(camera.position.x, smooth.x * 0.6, 0.05);
    camera.position.y = lerp(camera.position.y, 0.2 + smooth.y * 0.25, 0.05);
    camera.lookAt(0, 0.2, 0);

    shards.forEach((s) => {
      s.mesh.position.y += Math.sin(t * s.speed + s.phase) * 0.0015;
      s.mesh.rotation.y += 0.0015 * s.speed;
    });

    points.rotation.y = t * 0.02;
    points.rotation.x = Math.sin(t * 0.1) * 0.05;

    renderer.render(scene, camera);
    raf = requestAnimationFrame(render);
  };

  // Pause when off-screen
  const io = new IntersectionObserver(
    ([entry]) => {
      running = entry.isIntersecting;
      if (running) {
        clock.start();
        raf = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(raf);
      }
    },
    { threshold: 0.05 }
  );
  io.observe(canvas);
  raf = requestAnimationFrame(render);

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
