/**
 * CELEBRATION STUDIO — COMPLETE 3D MULTI-THEME AUTHENTICATION ENGINE
 * Grounded in the 24-screen grid (media_1792507936303_d2d61440.jpg)
 * Supports 6 dynamic 3D themes, random theme generation, Three.js WebGL scenes,
 * and 60 FPS transitions across all authentication states.
 */

(function () {
  const THEMES = [
    'cosmic_portal',
    'floating_lotus',
    'constellation',
    'crystal_cavern',
    'golden_lotus',
    'ethereal_light'
  ];

  let currentTheme = 'cosmic_portal';
  let scene, camera, renderer;
  let themeGroups = {};
  let lights = {};
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let isTransitioning = false;

  // Initialize WebGL Scene
  function init3D() {
    const canvas = document.getElementById('authPortalCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // 1. Scene & Camera
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070919, 0.022);

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

    // 2. Dynamic Lighting Rig
    lights.ambient = new THREE.AmbientLight(0x1a1c38, 1.8);
    scene.add(lights.ambient);

    lights.key = new THREE.PointLight(0xa855f7, 3.5, 45);
    lights.key.position.set(-8, 5, 6);
    scene.add(lights.key);

    lights.fill = new THREE.PointLight(0x38e1ff, 2.5, 45);
    lights.fill.position.set(8, -4, 5);
    scene.add(lights.fill);

    // 3. Build All 6 Dynamic 3D Theme Environments
    buildCosmicPortalGroup();
    buildFloatingLotusGroup();
    buildConstellationGroup();
    buildCrystalCavernGroup();
    buildGoldenLotusGroup();
    buildEtherealLightGroup();

    // 4. Determine Initial Theme (Random or Saved or Query Param)
    const params = new URLSearchParams(window.location.search);
    const paramTheme = params.get('theme');
    let chosenTheme = paramTheme;

    if (!chosenTheme) {
      // Pick random theme for upcoming users as requested
      const randomIdx = Math.floor(Math.random() * THEMES.length);
      chosenTheme = THEMES[randomIdx];
    }

    applyTheme(chosenTheme, false);

    // 5. Setup View State (Login, Register, Forgot)
    const path = window.location.pathname.toLowerCase();
    const mode = params.get('mode') || (path.includes('register') ? 'register' : 'login');
    showView(mode);

    // 6. Listeners
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousemove', onMouseMove, false);

    // 7. Start Render Loop
    animate();
  }

  // =========================================================================
  // THEME 1: Cosmic Castle Portal (Screens 1, 2, 3)
  // =========================================================================
  function buildCosmicPortalGroup() {
    const grp = new THREE.Group();
    scene.add(grp);

    // Portal Torus Ring
    const torusGeo = new THREE.TorusGeometry(8.2, 0.35, 32, 100);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x6b21a8,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.8
    });
    const ring = new THREE.Mesh(torusGeo, torusMat);
    grp.add(ring);

    // Cosmic Particles Vortex
    const count = 900;
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c1 = new THREE.Color(0xa855f7);
    const c2 = new THREE.Color(0x38e1ff);

    for (let i = 0; i < count; i++) {
      const r = 1.0 + Math.random() * 7.5;
      const a = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = Math.sin(a) * r;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5.0;

      const c = Math.random() < 0.5 ? c1 : c2;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.12, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const vortex = new THREE.Points(pGeo, pMat);
    grp.add(vortex);

    // Craggy 3D Asteroids
    const asteroidMat = new THREE.MeshStandardMaterial({ color: 0x221834, roughness: 0.85, metalness: 0.2, flatShading: true });
    const asteroids = [];
    const astCoords = [
      [-9.5, 3.5, 2.5, 1.8], [-10, -4, 3, 2.1], [9.8, 4.2, 2, 1.7], [10.2, -3.8, 2.2, 1.9], [0, 8.8, 0.5, 1.4]
    ];
    astCoords.forEach(c => {
      const geo = new THREE.DodecahedronGeometry(1.0, 1);
      const m = new THREE.Mesh(geo, asteroidMat);
      m.position.set(c[0], c[1], c[2]);
      m.scale.setScalar(c[3]);
      m.userData = { origY: c[1], seed: Math.random() * Math.PI };
      grp.add(m);
      asteroids.push(m);
    });

    themeGroups.cosmic_portal = { group: grp, ring, vortex, asteroids };
  }

  // =========================================================================
  // THEME 2: Floating Lotus & Romantic Petals (Screens 6, 16)
  // =========================================================================
  function buildFloatingLotusGroup() {
    const grp = new THREE.Group();
    grp.visible = false;
    scene.add(grp);

    // Floating Lotus Blossom Meshes
    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      emissive: 0xdb2777,
      emissiveIntensity: 0.5,
      roughness: 0.3,
      metalness: 0.2
    });
    const lotuses = [];
    const lotusCoords = [
      [-8.5, 4.0, 2.0, 1.5], [8.8, 4.5, 1.5, 1.6], [-9.2, -4.5, 2.2, 1.8], [9.0, -4.2, 1.8, 1.7]
    ];
    lotusCoords.forEach(c => {
      const geo = new THREE.ConeGeometry(1.2, 2.2, 6);
      const m = new THREE.Mesh(geo, petalMat);
      m.rotation.x = Math.PI;
      m.position.set(c[0], c[1], c[2]);
      m.scale.setScalar(c[3]);
      m.userData = { origY: c[1], seed: Math.random() * Math.PI };
      grp.add(m);
      lotuses.push(m);
    });

    // Ascending Blossom Petals
    const pCount = 750;
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(pCount * 3);
    const col = new Float32Array(pCount * 3);
    const rose = new THREE.Color(0xf472b6);
    const gold = new THREE.Color(0xfbbf24);

    for (let i = 0; i < pCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      const c = Math.random() < 0.6 ? rose : gold;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.16, vertexColors: true, transparent: true, opacity: 0.85 });
    const petals = new THREE.Points(pGeo, pMat);
    grp.add(petals);

    themeGroups.floating_lotus = { group: grp, lotuses, petals };
  }

  // =========================================================================
  // THEME 3: Constellation Star Map (Screen 17)
  // =========================================================================
  function buildConstellationGroup() {
    const grp = new THREE.Group();
    grp.visible = false;
    scene.add(grp);

    // Constellation Nodes & Connecting Lines
    const nodeCount = 30;
    const nodes = [];
    const nodeGeo = new THREE.SphereGeometry(0.14, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x38e1ff });

    for (let i = 0; i < nodeCount; i++) {
      const m = new THREE.Mesh(nodeGeo, nodeMat);
      m.position.set(
        (Math.random() - 0.5) * 28,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 12
      );
      grp.add(m);
      nodes.push(m);
    }

    // Connect close nodes with lines
    const lineMat = new THREE.LineBasicMaterial({ color: 0x38e1ff, transparent: true, opacity: 0.35 });
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = nodes[i].position.distanceTo(nodes[j].position);
        if (d < 8.0) {
          const lGeo = new THREE.BufferGeometry().setFromPoints([nodes[i].position, nodes[j].position]);
          const line = new THREE.Line(lGeo, lineMat);
          grp.add(line);
        }
      }
    }

    // Rotating Celestial Wireframe Sphere
    const sphereGeo = new THREE.SphereGeometry(10.5, 18, 18);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0x1e3a8a, wireframe: true, transparent: true, opacity: 0.25 });
    const wireSphere = new THREE.Mesh(sphereGeo, sphereMat);
    grp.add(wireSphere);

    themeGroups.constellation = { group: grp, wireSphere, nodes };
  }

  // =========================================================================
  // THEME 4: 3D Crystal Cavern (Screen 15)
  // =========================================================================
  function buildCrystalCavernGroup() {
    const grp = new THREE.Group();
    grp.visible = false;
    scene.add(grp);

    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x2dd4bf,
      emissive: 0x0f766e,
      emissiveIntensity: 0.7,
      roughness: 0.1,
      metalness: 0.9,
      flatShading: true
    });

    const crystals = [];
    const crystalCoords = [
      [-9.0, 4.0, 2.0, 1.6], [9.2, 4.5, 1.8, 1.8], [-9.5, -4.5, 2.2, 2.0], [9.6, -4.0, 1.5, 1.9], [0, 8.5, 0, 1.5]
    ];
    crystalCoords.forEach(c => {
      const geo = new THREE.OctahedronGeometry(1.2, 0);
      const m = new THREE.Mesh(geo, crystalMat);
      m.position.set(c[0], c[1], c[2]);
      m.scale.set(c[3] * 0.8, c[3] * 1.5, c[3] * 0.8);
      m.userData = { origY: c[1], seed: Math.random() * Math.PI };
      grp.add(m);
      crystals.push(m);
    });

    themeGroups.crystal_cavern = { group: grp, crystals };
  }

  // =========================================================================
  // THEME 5: Golden Lotus (Screen 18)
  // =========================================================================
  function buildGoldenLotusGroup() {
    const grp = new THREE.Group();
    grp.visible = false;
    scene.add(grp);

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xb45309,
      emissiveIntensity: 0.45,
      roughness: 0.25,
      metalness: 0.95
    });

    const goldPetals = [];
    const coords = [
      [-8.8, 4.2, 2.0, 1.7], [9.0, 4.0, 1.8, 1.8], [-9.2, -4.0, 2.0, 1.9], [9.4, -4.2, 1.6, 2.0]
    ];
    coords.forEach(c => {
      const geo = new THREE.ConeGeometry(1.3, 2.4, 8);
      const m = new THREE.Mesh(geo, goldMat);
      m.position.set(c[0], c[1], c[2]);
      m.scale.setScalar(c[3]);
      m.userData = { origY: c[1], seed: Math.random() * Math.PI };
      grp.add(m);
      goldPetals.push(m);
    });

    // Golden dust particles
    const gCount = 600;
    const gGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(gCount * 3);
    for (let i = 0; i < gCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 32;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    gGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const gMat = new THREE.PointsMaterial({ color: 0xfbbf24, size: 0.14, transparent: true, opacity: 0.85 });
    const dust = new THREE.Points(gGeo, gMat);
    grp.add(dust);

    themeGroups.golden_lotus = { group: grp, goldPetals, dust };
  }

  // =========================================================================
  // THEME 6: Ethereal Light Dawn (Screen 14)
  // =========================================================================
  function buildEtherealLightGroup() {
    const grp = new THREE.Group();
    grp.visible = false;
    scene.add(grp);

    const pastelMat = new THREE.MeshStandardMaterial({
      color: 0xc4b5fd,
      roughness: 0.6,
      metalness: 0.1
    });

    const clouds = [];
    const coords = [
      [-9.0, 4.5, 2.0, 1.8], [9.2, 4.8, 1.5, 2.0], [-9.5, -4.5, 2.0, 2.2], [9.2, -4.2, 1.8, 2.1]
    ];
    coords.forEach(c => {
      const geo = new THREE.DodecahedronGeometry(1.2, 1);
      const m = new THREE.Mesh(geo, pastelMat);
      m.position.set(c[0], c[1], c[2]);
      m.scale.setScalar(c[3]);
      m.userData = { origY: c[1], seed: Math.random() * Math.PI };
      grp.add(m);
      clouds.push(m);
    });

    themeGroups.ethereal_light = { group: grp, clouds };
  }

  // =========================================================================
  // Dynamic Theme Application & Seamless Transition
  // =========================================================================
  function applyTheme(themeName, animated = true) {
    if (!THEMES.includes(themeName)) themeName = 'cosmic_portal';
    currentTheme = themeName;
    document.body.setAttribute('data-auth-theme', themeName);

    // Update Theme Indicator Button text
    const themeBtn = document.getElementById('authThemeDiceBtn');
    if (themeBtn) {
      const labelMap = {
        cosmic_portal: '🌌 Cosmic Portal',
        floating_lotus: '🪷 Floating Lotus',
        constellation: '✨ Constellation',
        crystal_cavern: '💎 Crystal Cavern',
        golden_lotus: '👑 Golden Lotus',
        ethereal_light: '☁️ Ethereal Dawn'
      };
      themeBtn.innerHTML = `🎲 ${labelMap[themeName] || 'Theme'}`;
    }

    // Toggle 3D groups
    Object.keys(themeGroups).forEach(key => {
      const grp = themeGroups[key]?.group;
      if (!grp) return;
      if (key === themeName) {
        grp.visible = true;
        if (animated && typeof gsap !== 'undefined') {
          grp.scale.set(0.8, 0.8, 0.8);
          gsap.to(grp.scale, { x: 1, y: 1, z: 1, duration: 0.9, ease: 'power2.out' });
        } else {
          grp.scale.set(1, 1, 1);
        }
      } else {
        grp.visible = false;
      }
    });

    // Adjust light colors per theme
    const lightProfiles = {
      cosmic_portal: { key: 0xa855f7, fill: 0x38e1ff, amb: 0x1a1c38, fog: 0x070919 },
      floating_lotus: { key: 0xf472b6, fill: 0xe879f9, amb: 0x2e1136, fog: 0x15091a },
      constellation: { key: 0x38e1ff, fill: 0x3b82f6, amb: 0x0a1636, fog: 0x050b1d },
      crystal_cavern: { key: 0x2dd4bf, fill: 0x38e1ff, amb: 0x0c2530, fog: 0x061118 },
      golden_lotus: { key: 0xfbbf24, fill: 0xf59e0b, amb: 0x2a1c0d, fog: 0x120d06 },
      ethereal_light: { key: 0x8b5cf6, fill: 0xec4899, amb: 0xe2e8f0, fog: 0xf1f5f9 }
    };

    const p = lightProfiles[themeName];
    if (p && lights.key) {
      lights.key.color.setHex(p.key);
      lights.fill.color.setHex(p.fill);
      lights.ambient.color.setHex(p.amb);
      if (scene && scene.fog) scene.fog.color.setHex(p.fog);
    }
  }

  // Pick Next / Random Theme
  function cycleRandomTheme() {
    const currentIndex = THEMES.indexOf(currentTheme);
    let nextIndex = (currentIndex + 1) % THEMES.length;
    applyTheme(THEMES[nextIndex], true);
  }

  // =========================================================================
  // View State Management (Login, Register, Forgot, Verify, Success)
  // =========================================================================
  function showView(viewId) {
    document.querySelectorAll('.auth-view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(`view-${viewId}`) || document.getElementById('view-login');
    if (target) {
      target.classList.add('active');
    }

    // Dynamic Card Title & Subtitle update
    const titleEl = document.getElementById('authCardTitle');
    const subtitleEl = document.getElementById('authCardSubtitle');

    if (viewId === 'register') {
      if (titleEl) titleEl.textContent = 'Create Your Account';
      if (subtitleEl) subtitleEl.textContent = 'Join our community of creators';
    } else if (viewId === 'forgot') {
      if (titleEl) titleEl.textContent = 'Reset Your Password';
      if (subtitleEl) subtitleEl.textContent = "Enter your email address and we'll send you a link";
    } else if (viewId === 'verify') {
      if (titleEl) titleEl.textContent = 'Verify Your Email';
      if (subtitleEl) subtitleEl.textContent = 'Check your inbox for the activation link';
    } else if (viewId === 'success') {
      if (titleEl) titleEl.textContent = "You're All Set!";
      if (subtitleEl) subtitleEl.textContent = 'Your atelier account has been created';
      triggerConfetti();
    } else {
      if (titleEl) titleEl.textContent = 'Welcome Back';
      if (subtitleEl) subtitleEl.textContent = 'Sign in to continue';
    }

    // Smooth card perspective bump
    const card = document.querySelector('.auth-glass-card');
    if (card && typeof gsap !== 'undefined') {
      gsap.fromTo(card, { scale: 0.96, y: 8 }, { scale: 1.0, y: 0, duration: 0.5, ease: 'back.out(1.5)' });
    }
  }

  // Trigger Celebratory Confetti on Success (Screen 20)
  function triggerConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#38e1ff', '#f472b6', '#fbbf24']
      });
    }
  }

  // Mouse & Resize Handlers
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

  // 60 FPS Render Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    // Smooth Mouse Camera Parallax
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;
    camera.position.x = mouse.x * 1.6;
    camera.position.y = -mouse.y * 1.2;
    camera.lookAt(0, 0, 0);

    // Active Theme Mesh Rotations & Floats
    if (currentTheme === 'cosmic_portal' && themeGroups.cosmic_portal) {
      const g = themeGroups.cosmic_portal;
      if (g.ring) g.ring.rotation.z += 0.003;
      if (g.vortex) g.vortex.rotation.z += 0.005;
      g.asteroids.forEach(a => {
        a.rotation.x += 0.01;
        a.rotation.y += 0.012;
        a.position.y = a.userData.origY + Math.sin(time + a.userData.seed) * 0.3;
      });
    } else if (currentTheme === 'floating_lotus' && themeGroups.floating_lotus) {
      const g = themeGroups.floating_lotus;
      g.lotuses.forEach(l => {
        l.rotation.y += 0.006;
        l.position.y = l.userData.origY + Math.sin(time * 0.8 + l.userData.seed) * 0.35;
      });
      if (g.petals) {
        const arr = g.petals.geometry.attributes.position.array;
        for (let i = 1; i < arr.length; i += 3) {
          arr[i] += 0.035;
          if (arr[i] > 14) arr[i] = -14;
        }
        g.petals.geometry.attributes.position.needsUpdate = true;
      }
    } else if (currentTheme === 'constellation' && themeGroups.constellation) {
      const g = themeGroups.constellation;
      if (g.wireSphere) {
        g.wireSphere.rotation.y += 0.002;
        g.wireSphere.rotation.x += 0.001;
      }
    } else if (currentTheme === 'crystal_cavern' && themeGroups.crystal_cavern) {
      const g = themeGroups.crystal_cavern;
      g.crystals.forEach(c => {
        c.rotation.x += 0.012;
        c.rotation.y += 0.008;
        c.position.y = c.userData.origY + Math.sin(time + c.userData.seed) * 0.3;
      });
    } else if (currentTheme === 'golden_lotus' && themeGroups.golden_lotus) {
      const g = themeGroups.golden_lotus;
      g.goldPetals.forEach(p => {
        p.rotation.y += 0.005;
        p.position.y = p.userData.origY + Math.sin(time + p.userData.seed) * 0.35;
      });
    }

    renderer.render(scene, camera);
  }

  // Public Interface
  window.Auth3D = {
    applyTheme,
    cycleRandomTheme,
    showView,
    triggerConfetti,
    getTheme: () => currentTheme
  };

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init3D);
  } else {
    init3D();
  }
})();
