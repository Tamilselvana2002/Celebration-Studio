/**
 * CELEBRATION STUDIO — 3D AUTHENTICATION PORTAL & DREAMSCAPE ENGINE
 * Directly inspired by 01_login_3d_portal.jpg & 02_registration_3d.jpg
 * Built with Three.js & GSAP for 60 FPS hardware-accelerated 3D transitions.
 */

(function () {
  let scene, camera, renderer;
  let portalGroup, dreamGroup;
  let portalRing, portalVortex, asteroids = [], dreamIslands = [], petalParticles;
  let ambientLight, cyanRimLight, purpleBackLight, dreamLight;
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let currentMode = 'login'; // 'login' or 'register'
  let isTransitioning = false;

  function init() {
    const canvas = document.getElementById('authPortalCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // 1. Scene & Camera Setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060814, 0.025);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 18);

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Lighting Setup
    ambientLight = new THREE.AmbientLight(0x0c142b, 1.8);
    scene.add(ambientLight);

    cyanRimLight = new THREE.PointLight(0x38e1ff, 3.5, 40);
    cyanRimLight.position.set(-8, 5, 6);
    scene.add(cyanRimLight);

    purpleBackLight = new THREE.PointLight(0xa855f7, 3.0, 40);
    purpleBackLight.position.set(8, -4, 4);
    scene.add(purpleBackLight);

    dreamLight = new THREE.DirectionalLight(0xfed7aa, 0); // Off in login, on in register
    dreamLight.position.set(0, 10, 10);
    scene.add(dreamLight);

    // 3. Build The Cosmic Portal (Login Mode)
    buildCosmicPortal();

    // 4. Build The Whimsical Dreamscape (Register Mode)
    buildDreamscape();

    // 5. Event Listeners
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousemove', onMouseMove, false);

    // 6. Check URL query parameters or page name
    const path = window.location.pathname.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    const initialMode = params.get('mode') || (path.includes('register') ? 'register' : 'login');
    setModeImmediate(initialMode);

    // 7. Start Render Loop
    animate();
  }

  // --- Build Cosmic Portal (01_login_3d_portal.jpg) ---
  function buildCosmicPortal() {
    portalGroup = new THREE.Group();
    scene.add(portalGroup);

    // A. Luminous Torus Portal Ring
    const torusGeo = new THREE.TorusGeometry(8.2, 0.35, 32, 100);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0x38e1ff,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.85
    });
    portalRing = new THREE.Mesh(torusGeo, torusMat);
    portalGroup.add(portalRing);

    // Outer Halo Ring
    const haloGeo = new THREE.TorusGeometry(8.5, 0.08, 16, 100);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.65
    });
    const haloRing = new THREE.Mesh(haloGeo, haloMat);
    portalGroup.add(haloRing);

    // B. Inner Cosmic Starlight Vortex
    const vortexCount = 900;
    const vortexGeo = new THREE.BufferGeometry();
    const vortexPositions = new Float32Array(vortexCount * 3);
    const vortexColors = new Float32Array(vortexCount * 3);
    const colorCyan = new THREE.Color(0x38e1ff);
    const colorPurple = new THREE.Color(0xa855f7);
    const colorWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < vortexCount; i++) {
      const radius = 1.0 + Math.random() * 7.2;
      const angle = Math.random() * Math.PI * 2;
      const z = (Math.random() - 0.5) * 5.0;

      vortexPositions[i * 3] = Math.cos(angle) * radius;
      vortexPositions[i * 3 + 1] = Math.sin(angle) * radius;
      vortexPositions[i * 3 + 2] = z;

      const mixChoice = Math.random();
      const c = mixChoice < 0.5 ? colorCyan.clone().lerp(colorPurple, Math.random()) : colorWhite;
      vortexColors[i * 3] = c.r;
      vortexColors[i * 3 + 1] = c.g;
      vortexColors[i * 3 + 2] = c.b;
    }

    vortexGeo.setAttribute('position', new THREE.BufferAttribute(vortexPositions, 3));
    vortexGeo.setAttribute('color', new THREE.BufferAttribute(vortexColors, 3));

    const vortexMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    portalVortex = new THREE.Points(vortexGeo, vortexMat);
    portalGroup.add(portalVortex);

    // C. Craggy 3D Orbiting Asteroids (Matching 01_login_3d_portal.jpg)
    const asteroidMat = new THREE.MeshStandardMaterial({
      color: 0x1f293d,
      roughness: 0.88,
      metalness: 0.22,
      flatShading: true
    });

    // Preset positions around the card for dramatic framing
    const asteroidConfigs = [
      { x: -9.5, y: 3.2, z: 2.5, scale: 1.8, rx: 0.01, ry: 0.015 },
      { x: -10.2, y: -4.0, z: 3.0, scale: 2.1, rx: 0.012, ry: 0.008 },
      { x: 9.8, y: 4.2, z: 1.8, scale: 1.6, rx: 0.009, ry: 0.014 },
      { x: 10.4, y: -3.5, z: 2.2, scale: 1.9, rx: 0.015, ry: 0.011 },
      { x: -7.2, y: -0.5, z: -1.5, scale: 1.2, rx: 0.008, ry: 0.01 },
      { x: 7.5, y: 1.0, z: -2.0, scale: 1.3, rx: 0.011, ry: 0.007 },
      { x: 0.0, y: 8.8, z: 0.5, scale: 1.4, rx: 0.007, ry: 0.012 }
    ];

    asteroidConfigs.forEach((cfg, idx) => {
      // Perturbed Dodecahedron creates craggy realistic asteroid geometry
      const geo = new THREE.DodecahedronGeometry(1.0, 1);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const vx = pos.getX(i);
        const vy = pos.getY(i);
        const vz = pos.getZ(i);
        const factor = 0.85 + Math.random() * 0.3;
        pos.setXYZ(i, vx * factor, vy * factor, vz * factor);
      }
      geo.computeVertexNormals();

      const mesh = new THREE.Mesh(geo, asteroidMat);
      mesh.position.set(cfg.x, cfg.y, cfg.z);
      mesh.scale.setScalar(cfg.scale);
      mesh.userData = {
        origX: cfg.x,
        origY: cfg.y,
        origZ: cfg.z,
        rotSpeedX: cfg.rx,
        rotSpeedY: cfg.ry,
        floatSeed: Math.random() * Math.PI * 2
      };

      portalGroup.add(mesh);
      asteroids.push(mesh);
    });
  }

  // --- Build Whimsical Dreamscape (02_registration_3d.jpg) ---
  function buildDreamscape() {
    dreamGroup = new THREE.Group();
    dreamGroup.position.set(0, 0, -12); // Positioned slightly behind/through portal
    dreamGroup.visible = false;
    scene.add(dreamGroup);

    // A. Floating Fairytale Islands / Stones
    const islandMat = new THREE.MeshStandardMaterial({
      color: 0x937c76,
      roughness: 0.8,
      metalness: 0.15,
      flatShading: true
    });

    const islandConfigs = [
      { x: -9.0, y: 4.5, z: 2.0, scale: 1.6 },
      { x: 9.2, y: 5.0, z: 1.5, scale: 1.8 },
      { x: -8.5, y: -4.2, z: 1.0, scale: 2.0 },
      { x: 8.8, y: -4.0, z: 2.2, scale: 1.7 },
      { x: 0.0, y: 8.5, z: -1.0, scale: 1.4 }
    ];

    islandConfigs.forEach(cfg => {
      const geo = new THREE.DodecahedronGeometry(1.0, 1);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const vx = pos.getX(i);
        const vy = pos.getY(i);
        const vz = pos.getZ(i);
        // Flatter top, tapered bottom like floating island
        const taper = vy < 0 ? (1 + vy * 0.4) : 1.1;
        pos.setXYZ(i, vx * taper, vy, vz * taper);
      }
      geo.computeVertexNormals();

      const mesh = new THREE.Mesh(geo, islandMat);
      mesh.position.set(cfg.x, cfg.y, cfg.z);
      mesh.scale.set(cfg.scale * 1.2, cfg.scale * 0.9, cfg.scale * 1.2);
      mesh.userData = {
        origY: cfg.y,
        floatSeed: Math.random() * Math.PI * 2
      };

      dreamGroup.add(mesh);
      dreamIslands.push(mesh);
    });

    // B. Floating Petal Drift & Golden Spores
    const petalCount = 700;
    const petalGeo = new THREE.BufferGeometry();
    const petalPositions = new Float32Array(petalCount * 3);
    const petalColors = new Float32Array(petalCount * 3);
    const colorRose = new THREE.Color(0xf472b6);
    const colorGold = new THREE.Color(0xfbbf24);
    const colorPeach = new THREE.Color(0xfecdd3);

    for (let i = 0; i < petalCount; i++) {
      petalPositions[i * 3] = (Math.random() - 0.5) * 35;
      petalPositions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      petalPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const pick = Math.random();
      const col = pick < 0.4 ? colorRose : pick < 0.7 ? colorPeach : colorGold;
      petalColors[i * 3] = col.r;
      petalColors[i * 3 + 1] = col.g;
      petalColors[i * 3 + 2] = col.b;
    }

    petalGeo.setAttribute('position', new THREE.BufferAttribute(petalPositions, 3));
    petalGeo.setAttribute('color', new THREE.BufferAttribute(petalColors, 3));

    const petalMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.NormalBlending
    });

    petalParticles = new THREE.Points(petalGeo, petalMat);
    dreamGroup.add(petalParticles);
  }

  // --- Immediate Mode Set (On Page Load) ---
  function setModeImmediate(mode) {
    currentMode = mode;
    const flipper = document.getElementById('authFlipperWrap');
    const dreamOverlay = document.querySelector('.auth-dream-overlay');
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');

    if (mode === 'register') {
      if (flipper) flipper.classList.add('is-register');
      if (tabLogin) tabLogin.classList.remove('active');
      if (tabRegister) tabRegister.classList.add('active');
      if (dreamOverlay) dreamOverlay.style.opacity = '1';

      camera.position.set(0, 0, 14);
      portalGroup.visible = false;
      dreamGroup.visible = true;
      dreamGroup.position.set(0, 0, 0);
      ambientLight.color.setHex(0x38283e);
      dreamLight.intensity = 2.0;
      document.body.style.backgroundColor = '#160d21';
    } else {
      if (flipper) flipper.classList.remove('is-register');
      if (tabLogin) tabLogin.classList.add('active');
      if (tabRegister) tabRegister.classList.remove('active');
      if (dreamOverlay) dreamOverlay.style.opacity = '0';

      camera.position.set(0, 0, 18);
      portalGroup.visible = true;
      dreamGroup.visible = false;
      ambientLight.color.setHex(0x0c142b);
      dreamLight.intensity = 0;
      document.body.style.backgroundColor = '#060814';
    }
  }

  // --- Smooth 3D Transition Between Modes ---
  function transitionTo(mode) {
    if (mode === currentMode || isTransitioning) return;
    isTransitioning = true;
    currentMode = mode;

    const flipper = document.getElementById('authFlipperWrap');
    const dreamOverlay = document.querySelector('.auth-dream-overlay');
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');

    if (mode === 'register') {
      // 1. Flip card to Registration Face
      if (flipper) flipper.classList.add('is-register');
      if (tabLogin) tabLogin.classList.remove('active');
      if (tabRegister) tabRegister.classList.add('active');
      if (dreamOverlay) dreamOverlay.style.opacity = '1';

      dreamGroup.visible = true;

      // 2. Animate 3D Camera & Scene forward through the portal
      if (typeof gsap !== 'undefined') {
        gsap.timeline({
          onComplete: () => {
            portalGroup.visible = false;
            isTransitioning = false;
          }
        })
        .to(camera.position, { z: 12, duration: 1.0, ease: 'power2.inOut' })
        .to(portalRing.scale, { x: 2.2, y: 2.2, duration: 0.9, ease: 'power2.in' }, 0)
        .to(portalGroup.position, { z: 8, duration: 1.0, ease: 'power2.in' }, 0)
        .to(dreamGroup.position, { z: 0, duration: 1.1, ease: 'power2.out' }, 0.2)
        .to(dreamLight, { intensity: 2.2, duration: 0.9 }, 0.2)
        .to(document.body, { backgroundColor: '#160d21', duration: 1.0 }, 0);
      } else {
        setModeImmediate('register');
        isTransitioning = false;
      }

      // Update URL without page reload
      try {
        history.replaceState({ mode: 'register' }, '', 'register.html');
      } catch (e) {}

    } else {
      // 1. Flip card to Login Face
      if (flipper) flipper.classList.remove('is-register');
      if (tabLogin) tabLogin.classList.add('active');
      if (tabRegister) tabRegister.classList.remove('active');
      if (dreamOverlay) dreamOverlay.style.opacity = '0';

      portalGroup.visible = true;

      // 2. Animate 3D Camera & Scene back to Cosmic Portal
      if (typeof gsap !== 'undefined') {
        gsap.timeline({
          onComplete: () => {
            dreamGroup.visible = false;
            isTransitioning = false;
          }
        })
        .to(camera.position, { z: 18, duration: 1.0, ease: 'power2.inOut' })
        .to(portalRing.scale, { x: 1.0, y: 1.0, duration: 1.0, ease: 'power2.out' }, 0.1)
        .to(portalGroup.position, { z: 0, duration: 1.0, ease: 'power2.out' }, 0)
        .to(dreamGroup.position, { z: -12, duration: 0.9, ease: 'power2.in' }, 0)
        .to(dreamLight, { intensity: 0, duration: 0.8 }, 0)
        .to(document.body, { backgroundColor: '#060814', duration: 1.0 }, 0);
      } else {
        setModeImmediate('login');
        isTransitioning = false;
      }

      // Update URL without page reload
      try {
        history.replaceState({ mode: 'login' }, '', 'login.html');
      } catch (e) {}
    }
  }

  // --- Interaction & Mouse Parallax ---
  function onMouseMove(e) {
    mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  function onWindowResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // --- Animation Render Loop ---
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Smooth mouse interpolation
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // Camera Parallax
    camera.position.x = mouse.x * 1.5;
    camera.position.y = -mouse.y * 1.2;
    camera.lookAt(0, 0, 0);

    // 1. Cosmic Portal Animations
    if (portalGroup && portalGroup.visible) {
      if (portalRing) {
        portalRing.rotation.z += 0.003;
      }

      if (portalVortex) {
        portalVortex.rotation.z += 0.006;
      }

      // Tumble & Bob Asteroids
      asteroids.forEach(ast => {
        ast.rotation.x += ast.userData.rotSpeedX;
        ast.rotation.y += ast.userData.rotSpeedY;
        ast.position.y = ast.userData.origY + Math.sin(elapsedTime + ast.userData.floatSeed) * 0.35;
      });
    }

    // 2. Dreamscape Animations
    if (dreamGroup && dreamGroup.visible) {
      dreamIslands.forEach(island => {
        island.position.y = island.userData.origY + Math.sin(elapsedTime * 0.8 + island.userData.floatSeed) * 0.4;
        island.rotation.y += 0.002;
      });

      if (petalParticles) {
        const positions = petalParticles.geometry.attributes.position.array;
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] += 0.03; // Drift upwards
          if (positions[i] > 15) positions[i] = -15; // Loop
        }
        petalParticles.geometry.attributes.position.needsUpdate = true;
      }
    }

    renderer.render(scene, camera);
  }

  // Public API
  window.Auth3D = {
    transitionTo: transitionTo,
    setModeImmediate: setModeImmediate,
    getMode: () => currentMode
  };

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
