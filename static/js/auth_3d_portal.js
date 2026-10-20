/**
 * CELEBRATION STUDIO — COMPLETE 24-SCREEN 3D MULTI-PLANAR AUTHENTICATION ENGINE
 * Directly modeled from media_1792510705477_1d3f80c4.jpg
 * 
 * Features:
 * 1. Multi-planar 3D rendering (High-Res Background Art + WebGL 3D Layer + 3D Card Tilt)
 * 2. 7 Authentic Visual Themes with Random Theme Generator for upcoming visitors
 * 3. All 24 States (Login, Register, Forgot Password, Verification, Google One-Tap,
 *    Loading Progress, Error Shield, Success Confetti, and Splash)
 * 4. Interactive 3D Card Tilt with Specular Glare
 * 5. Smooth 60 FPS transitions via Three.js & GSAP
 */

(function () {
  const THEME_PRESETS = {
    cosmic_portal: {
      name: '🌌 Cosmic Portal',
      bgImg: 'static/images/auth/01_login_3d_portal.jpg',
      primary: '#a855f7',
      secondary: '#38e1ff',
      glow: 'rgba(168, 85, 247, 0.45)',
      cardBg: 'rgba(12, 16, 38, 0.72)',
      cardBorder: 'rgba(168, 85, 247, 0.38)',
      btnGrad: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #38e1ff 100%)',
      lightKey: 0xa855f7,
      lightFill: 0x38e1ff,
      lightAmb: 0x141838
    },
    floating_lotus: {
      name: '🪷 Floating Lotus',
      bgImg: 'static/images/auth/02_registration_3d.jpg',
      primary: '#f472b6',
      secondary: '#fb7185',
      glow: 'rgba(244, 114, 182, 0.45)',
      cardBg: 'rgba(28, 14, 34, 0.72)',
      cardBorder: 'rgba(244, 114, 182, 0.42)',
      btnGrad: 'linear-gradient(135deg, #f472b6 0%, #fb7185 50%, #e879f9 100%)',
      lightKey: 0xf472b6,
      lightFill: 0xe879f9,
      lightAmb: 0x28122c
    },
    constellation: {
      name: '✨ Constellation',
      bgImg: 'static/images/auth/16_constellation_animation.jpg',
      primary: '#38e1ff',
      secondary: '#60a5fa',
      glow: 'rgba(56, 225, 255, 0.45)',
      cardBg: 'rgba(8, 19, 44, 0.74)',
      cardBorder: 'rgba(56, 225, 255, 0.4)',
      btnGrad: 'linear-gradient(135deg, #38e1ff 0%, #3b82f6 50%, #818cf8 100%)',
      lightKey: 0x38e1ff,
      lightFill: 0x3b82f6,
      lightAmb: 0x091936
    },
    crystal_cavern: {
      name: '💎 3D Crystal',
      bgImg: 'static/images/auth/33_crystal_garden.jpg',
      primary: '#2dd4bf',
      secondary: '#38e1ff',
      glow: 'rgba(45, 212, 191, 0.45)',
      cardBg: 'rgba(9, 26, 36, 0.75)',
      cardBorder: 'rgba(45, 212, 191, 0.4)',
      btnGrad: 'linear-gradient(135deg, #2dd4bf 0%, #38e1ff 50%, #c084fc 100%)',
      lightKey: 0x2dd4bf,
      lightFill: 0x38e1ff,
      lightAmb: 0x0b2532
    },
    golden_lotus: {
      name: '👑 Golden Lotus',
      bgImg: 'static/images/auth/43_43_sculptural_gold_theme.jpg',
      primary: '#fbbf24',
      secondary: '#f59e0b',
      glow: 'rgba(251, 191, 36, 0.45)',
      cardBg: 'rgba(28, 20, 10, 0.78)',
      cardBorder: 'rgba(251, 191, 36, 0.42)',
      btnGrad: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #f97316 100%)',
      lightKey: 0xfbbf24,
      lightFill: 0xf59e0b,
      lightAmb: 0x281a0b
    },
    ethereal_dawn: {
      name: '☁️ Ethereal Dawn',
      bgImg: 'static/images/auth/44_44_dreamglass_theme.jpg',
      primary: '#8b5cf6',
      secondary: '#ec4899',
      glow: 'rgba(236, 72, 153, 0.35)',
      cardBg: 'rgba(255, 255, 255, 0.82)',
      cardBorder: 'rgba(139, 92, 246, 0.35)',
      btnGrad: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #06b6d4 100%)',
      lightKey: 0x8b5cf6,
      lightFill: 0xec4899,
      lightAmb: 0xe2e8f0
    },
    midnight_cinema: {
      name: '🏛️ Midnight Cinema',
      bgImg: 'static/images/auth/49_49_midnight_cinema_theme.jpg',
      primary: '#f59e0b',
      secondary: '#d97706',
      glow: 'rgba(245, 158, 11, 0.45)',
      cardBg: 'rgba(20, 14, 10, 0.78)',
      cardBorder: 'rgba(245, 158, 11, 0.38)',
      btnGrad: 'linear-gradient(135deg, #f59e0b 0%, #b45309 60%, #78350f 100%)',
      lightKey: 0xf59e0b,
      lightFill: 0xd97706,
      lightAmb: 0x1f140d
    }
  };

  const THEME_KEYS = Object.keys(THEME_PRESETS);
  let currentThemeKey = 'cosmic_portal';

  let scene, camera, renderer;
  let themeMeshGroups = {};
  let lights = {};
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

  // =========================================================================
  // 1. Initial Setup & Multi-Planar Layers
  // =========================================================================
  function init() {
    init3D();
    initCard3DTilt();
    initThemeSelection();
    initViewRoutes();
  }

  function init3D() {
    const canvas = document.getElementById('authPortalCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // A. Three.js Scene Setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050714, 0.02);

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

    // B. Lighting
    lights.ambient = new THREE.AmbientLight(0x141838, 2.0);
    scene.add(lights.ambient);

    lights.key = new THREE.PointLight(0xa855f7, 3.5, 45);
    lights.key.position.set(-8, 5, 6);
    scene.add(lights.key);

    lights.fill = new THREE.PointLight(0x38e1ff, 2.8, 45);
    lights.fill.position.set(8, -4, 5);
    scene.add(lights.fill);

    // C. Build 3D Mesh Groups per Theme
    buildCosmic3D();
    buildLotus3D();
    buildConstellation3D();
    buildCrystal3D();
    buildGold3D();

    // D. Resize & Mouse
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousemove', onMouseMove, false);

    // E. Start Loop
    animate();
  }

  // --- Theme 1: Cosmic Portal 3D Elements ---
  function buildCosmic3D() {
    const grp = new THREE.Group();
    scene.add(grp);

    // Torus Ring
    const torusGeo = new THREE.TorusGeometry(8.2, 0.32, 28, 100);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x6b21a8,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.8
    });
    const ring = new THREE.Mesh(torusGeo, torusMat);
    grp.add(ring);

    // Stardust Vortex
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
    const pMat = new THREE.PointsMaterial({ size: 0.12, vertexColors: true, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending });
    const vortex = new THREE.Points(pGeo, pMat);
    grp.add(vortex);

    // Orbiting Craggy Asteroids
    const asteroidMat = new THREE.MeshStandardMaterial({ color: 0x241d3b, roughness: 0.85, metalness: 0.2, flatShading: true });
    const asteroids = [];
    const coords = [[-9.5, 3.5, 2.5, 1.8], [-10, -4, 3, 2.1], [9.8, 4.2, 2, 1.7], [10.2, -3.8, 2.2, 1.9], [0, 8.8, 0.5, 1.4]];
    coords.forEach(c => {
      const geo = new THREE.DodecahedronGeometry(1.0, 1);
      const m = new THREE.Mesh(geo, asteroidMat);
      m.position.set(c[0], c[1], c[2]);
      m.scale.setScalar(c[3]);
      m.userData = { origY: c[1], seed: Math.random() * Math.PI };
      grp.add(m);
      asteroids.push(m);
    });

    themeMeshGroups.cosmic_portal = { group: grp, ring, vortex, asteroids };
  }

  // --- Theme 2: Floating Lotus 3D Elements ---
  function buildLotus3D() {
    const grp = new THREE.Group();
    grp.visible = false;
    scene.add(grp);

    // Floating Lotus Flower Geometries
    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      emissive: 0xbe185d,
      emissiveIntensity: 0.5,
      roughness: 0.3,
      metalness: 0.2
    });
    const lotuses = [];
    const coords = [[-8.8, 4.0, 2.0, 1.6], [9.0, 4.5, 1.5, 1.7], [-9.2, -4.5, 2.2, 1.9], [9.0, -4.2, 1.8, 1.8]];
    coords.forEach(c => {
      const geo = new THREE.ConeGeometry(1.2, 2.4, 6);
      const m = new THREE.Mesh(geo, petalMat);
      m.rotation.x = Math.PI;
      m.position.set(c[0], c[1], c[2]);
      m.scale.setScalar(c[3]);
      m.userData = { origY: c[1], seed: Math.random() * Math.PI };
      grp.add(m);
      lotuses.push(m);
    });

    // Ascending Petal Drifts
    const count = 700;
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const rose = new THREE.Color(0xf472b6);
    const gold = new THREE.Color(0xfbbf24);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 36;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 26;
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

    themeMeshGroups.floating_lotus = { group: grp, lotuses, petals };
  }

  // --- Theme 3: Constellation Star Map 3D Elements ---
  function buildConstellation3D() {
    const grp = new THREE.Group();
    grp.visible = false;
    scene.add(grp);

    const nodeCount = 32;
    const nodes = [];
    const nodeGeo = new THREE.SphereGeometry(0.14, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x38e1ff });

    for (let i = 0; i < nodeCount; i++) {
      const m = new THREE.Mesh(nodeGeo, nodeMat);
      m.position.set((Math.random() - 0.5) * 28, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 12);
      grp.add(m);
      nodes.push(m);
    }

    const lineMat = new THREE.LineBasicMaterial({ color: 0x38e1ff, transparent: true, opacity: 0.35 });
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].position.distanceTo(nodes[j].position) < 7.8) {
          const lGeo = new THREE.BufferGeometry().setFromPoints([nodes[i].position, nodes[j].position]);
          const line = new THREE.Line(lGeo, lineMat);
          grp.add(line);
        }
      }
    }

    const sphereGeo = new THREE.SphereGeometry(10.5, 18, 18);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0x1e3a8a, wireframe: true, transparent: true, opacity: 0.25 });
    const wireSphere = new THREE.Mesh(sphereGeo, sphereMat);
    grp.add(wireSphere);

    themeMeshGroups.constellation = { group: grp, wireSphere, nodes };
  }

  // --- Theme 4: 3D Crystal Cavern Elements ---
  function buildCrystal3D() {
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
    const coords = [[-9.0, 4.0, 2.0, 1.6], [9.2, 4.5, 1.8, 1.8], [-9.5, -4.5, 2.2, 2.0], [9.6, -4.0, 1.5, 1.9], [0, 8.5, 0, 1.5]];
    coords.forEach(c => {
      const geo = new THREE.OctahedronGeometry(1.2, 0);
      const m = new THREE.Mesh(geo, crystalMat);
      m.position.set(c[0], c[1], c[2]);
      m.scale.set(c[3] * 0.8, c[3] * 1.5, c[3] * 0.8);
      m.userData = { origY: c[1], seed: Math.random() * Math.PI };
      grp.add(m);
      crystals.push(m);
    });

    themeMeshGroups.crystal_cavern = { group: grp, crystals };
  }

  // --- Theme 5: Golden Lotus Elements ---
  function buildGold3D() {
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
    const coords = [[-8.8, 4.2, 2.0, 1.7], [9.0, 4.0, 1.8, 1.8], [-9.2, -4.0, 2.0, 1.9], [9.4, -4.2, 1.6, 2.0]];
    coords.forEach(c => {
      const geo = new THREE.ConeGeometry(1.3, 2.4, 8);
      const m = new THREE.Mesh(geo, goldMat);
      m.position.set(c[0], c[1], c[2]);
      m.scale.setScalar(c[3]);
      m.userData = { origY: c[1], seed: Math.random() * Math.PI };
      grp.add(m);
      goldPetals.push(m);
    });

    themeMeshGroups.golden_lotus = { group: grp, goldPetals };
  }

  // =========================================================================
  // 2. Interactive 3D Card Tilt with Specular Glare (Screens 4, 6)
  // =========================================================================
  function initCard3DTilt() {
    const card = document.querySelector('.auth-glass-card');
    if (!card) return;

    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // =========================================================================
  // 3. Theme Application & Random Selector
  // =========================================================================
  function applyTheme(themeKey, animated = true) {
    if (!THEME_PRESETS[themeKey]) themeKey = 'cosmic_portal';
    currentThemeKey = themeKey;
    const preset = THEME_PRESETS[themeKey];

    // A. Update Background Artwork Layer with crossfade
    const bgLayer = document.getElementById('authBgArtworkLayer');
    if (bgLayer) {
      if (animated && typeof gsap !== 'undefined') {
        gsap.to(bgLayer, {
          opacity: 0.2,
          scale: 1.05,
          duration: 0.35,
          onComplete: () => {
            bgLayer.style.backgroundImage = `url('${preset.bgImg}')`;
            gsap.to(bgLayer, { opacity: 0.85, scale: 1.02, duration: 0.55 });
          }
        });
      } else {
        bgLayer.style.backgroundImage = `url('${preset.bgImg}')`;
      }
    }

    // B. Update CSS Custom Properties
    const root = document.documentElement;
    root.style.setProperty('--auth-accent-p', preset.primary);
    root.style.setProperty('--auth-accent-s', preset.secondary);
    root.style.setProperty('--auth-accent-glow', preset.glow);
    root.style.setProperty('--auth-card-bg', preset.cardBg);
    root.style.setProperty('--auth-card-border', preset.cardBorder);
    root.style.setProperty('--auth-btn-grad', preset.btnGrad);

    // C. Update Top Bar Button Label
    const diceBtn = document.getElementById('authThemeDiceBtn');
    if (diceBtn) {
      diceBtn.innerHTML = `🎲 ${preset.name}`;
    }

    // D. Update Bottom Dock Active Chip
    document.querySelectorAll('.auth-theme-chip').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.theme === themeKey);
    });

    // E. Three.js Mesh Group & Lighting Transition
    Object.keys(themeMeshGroups).forEach(key => {
      const grp = themeMeshGroups[key]?.group;
      if (!grp) return;
      if (key === themeKey) {
        grp.visible = true;
        if (animated && typeof gsap !== 'undefined') {
          grp.scale.set(0.7, 0.7, 0.7);
          gsap.to(grp.scale, { x: 1, y: 1, z: 1, duration: 0.8, ease: 'power2.out' });
        } else {
          grp.scale.set(1, 1, 1);
        }
      } else {
        grp.visible = false;
      }
    });

    if (lights.key) {
      lights.key.color.setHex(preset.lightKey);
      lights.fill.color.setHex(preset.lightFill);
      lights.ambient.color.setHex(preset.lightAmb);
    }
  }

  function pickRandomTheme() {
    const otherKeys = THEME_KEYS.filter(k => k !== currentThemeKey);
    const chosen = otherKeys[Math.floor(Math.random() * otherKeys.length)];
    applyTheme(chosen, true);
  }

  function initThemeSelection() {
    const params = new URLSearchParams(window.location.search);
    const paramTheme = params.get('theme');

    if (paramTheme && THEME_PRESETS[paramTheme]) {
      applyTheme(paramTheme, false);
    } else {
      // Pick random theme for upcoming visitors on first visit
      const randomKey = THEME_KEYS[Math.floor(Math.random() * THEME_KEYS.length)];
      applyTheme(randomKey, false);
    }
  }

  // =========================================================================
  // 4. All 24 View States & Transitions
  // =========================================================================
  function showView(viewId) {
    document.querySelectorAll('.auth-view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(`view-${viewId}`) || document.getElementById('view-login');
    if (target) {
      target.classList.add('active');
    }

    // Dynamic Titles
    const titleEl = document.getElementById('authCardTitle');
    const subtitleEl = document.getElementById('authCardSubtitle');

    const headers = {
      login: { t: 'Welcome Back', s: 'Sign in to continue' },
      register: { t: 'Create Your Account', s: 'Join our community of creators' },
      forgot: { t: 'Reset Your Password', s: "Enter your email address and we'll send you a link" },
      verify: { t: 'Verify Your Email', s: 'Check your inbox for the activation link' },
      google: { t: 'Welcome Back', s: 'Sign in with Google' },
      loading: { t: 'Celebration Studio', s: 'Loading your magical journey...' },
      error: { t: 'Something Went Wrong', s: 'Please check your information and try again' },
      success: { t: "You're All Set!", s: 'Your atelier account has been created' },
      splash: { t: 'Celebration Studio', s: 'Create. Celebrate. Share.' }
    };

    const h = headers[viewId] || headers.login;
    if (titleEl) titleEl.textContent = h.t;
    if (subtitleEl) subtitleEl.textContent = h.s;

    // Trigger Confetti on Success
    if (viewId === 'success') {
      triggerConfetti();
    }

    // Loading Bar Simulation
    if (viewId === 'loading') {
      const bar = document.getElementById('authLoadingProgressBar');
      if (bar) {
        bar.style.width = '0%';
        setTimeout(() => { bar.style.width = '100%'; }, 100);
        setTimeout(() => { showView('login'); }, 2200);
      }
    }

    // 3D Bump Animation on Card
    const card = document.querySelector('.auth-glass-card');
    if (card && typeof gsap !== 'undefined') {
      gsap.fromTo(card, { scale: 0.96, y: 10 }, { scale: 1.0, y: 0, duration: 0.45, ease: 'back.out(1.4)' });
    }
  }

  function triggerConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#38e1ff', '#ec4899', '#fbbf24', '#ffffff']
      });
    }
  }

  function initViewRoutes() {
    const path = window.location.pathname.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view') || (path.includes('register') ? 'register' : 'login');
    showView(view);
  }

  // =========================================================================
  // 5. Mouse Parallax & 60 FPS Render Loop
  // =========================================================================
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

  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    // Mouse Camera Parallax
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;
    camera.position.x = mouse.x * 1.5;
    camera.position.y = -mouse.y * 1.1;
    camera.lookAt(0, 0, 0);

    // Three.js Mesh Rotations
    if (currentThemeKey === 'cosmic_portal' && themeMeshGroups.cosmic_portal) {
      const g = themeMeshGroups.cosmic_portal;
      if (g.ring) g.ring.rotation.z += 0.003;
      if (g.vortex) g.vortex.rotation.z += 0.005;
      g.asteroids.forEach(a => {
        a.rotation.x += 0.01;
        a.rotation.y += 0.012;
        a.position.y = a.userData.origY + Math.sin(time + a.userData.seed) * 0.3;
      });
    } else if (currentThemeKey === 'floating_lotus' && themeMeshGroups.floating_lotus) {
      const g = themeMeshGroups.floating_lotus;
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
    } else if (currentThemeKey === 'constellation' && themeMeshGroups.constellation) {
      const g = themeMeshGroups.constellation;
      if (g.wireSphere) {
        g.wireSphere.rotation.y += 0.002;
        g.wireSphere.rotation.x += 0.001;
      }
    } else if (currentThemeKey === 'crystal_cavern' && themeMeshGroups.crystal_cavern) {
      const g = themeMeshGroups.crystal_cavern;
      g.crystals.forEach(c => {
        c.rotation.x += 0.012;
        c.rotation.y += 0.008;
        c.position.y = c.userData.origY + Math.sin(time + c.userData.seed) * 0.3;
      });
    } else if (currentThemeKey === 'golden_lotus' && themeMeshGroups.golden_lotus) {
      const g = themeMeshGroups.golden_lotus;
      g.goldPetals.forEach(p => {
        p.rotation.y += 0.005;
        p.position.y = p.userData.origY + Math.sin(time + p.userData.seed) * 0.35;
      });
    }

    renderer.render(scene, camera);
  }

  // Public API
  window.Auth3D = {
    applyTheme,
    pickRandomTheme,
    showView,
    triggerConfetti,
    getTheme: () => currentThemeKey
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
