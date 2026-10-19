/**
 * ============================================================================
 * CELEBRATION STUDIO ADVANCED ANIMATION & THEME ENGINE
 * Unified 24-Theme Particle System, GSAP Entrances, Live Previews & Counter Rollers
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Theme Configuration & Global State
  // --------------------------------------------------------------------------
  window.CelebrationAnimationEngine = {
    activeTheme: null,
    savedTheme: null,
    settings: {
      intensity: 'balanced',
      reducedMotion: false,
      particlesEnabled: true,
      ambientGlowEnabled: true,
      parallaxEnabled: true,
      backgroundMotionEnabled: true
    },
    canvas: null,
    ctx: null,
    particles: [],
    animationFrameId: null,
    isTabActive: true,

    init: function (initialTheme, userSettings) {
      this.activeTheme = initialTheme || {};
      this.savedTheme = Object.assign({}, this.activeTheme);
      if (userSettings) {
        this.settings = Object.assign(this.settings, userSettings);
      }

      this.checkReducedMotionOS();
      this.applyThemeCSSVariables(this.activeTheme);
      this.initParticleCanvas();
      this.initParallaxPointer();
      this.initCounters();
      this.bindVisibilityListener();
    },

    checkReducedMotionOS: function () {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.settings.reducedMotion = true;
        document.documentElement.setAttribute('data-reduced-motion', 'true');
      } else {
        document.documentElement.setAttribute('data-reduced-motion', String(this.settings.reducedMotion));
      }
      document.documentElement.setAttribute('data-intensity', this.settings.intensity);
      document.documentElement.setAttribute('data-background-motion', String(this.settings.backgroundMotionEnabled));
    },

    // ------------------------------------------------------------------------
    // 2. CSS Variable Application & Dynamic Cross-fade
    // ------------------------------------------------------------------------
    applyThemeCSSVariables: function (theme) {
      if (!theme) return;
      const root = document.documentElement;

      if (theme.primary_color) root.style.setProperty('--theme-primary', theme.primary_color);
      if (theme.secondary_color) root.style.setProperty('--theme-secondary', theme.secondary_color);
      if (theme.accent_color) root.style.setProperty('--theme-accent', theme.accent_color);
      if (theme.glow_color) root.style.setProperty('--theme-glow', theme.glow_color);
      if (theme.card_overlay) root.style.setProperty('--theme-card-overlay', theme.card_overlay);

      if (theme.static_url) {
        // Build correct static path
        const staticPrefix = window.STATIC_URL_PREFIX || '/static/';
        const fullImgUrl = `url('${staticPrefix}${theme.static_url}')`;
        root.style.setProperty('--theme-bg-image', fullImgUrl);
      }

      // Re-seed particles to match the new theme's color & particle type
      this.seedParticles(theme);
    },

    // ------------------------------------------------------------------------
    // 3. Canvas Particle Engine (Supports 24 Distinct Particle Types)
    // ------------------------------------------------------------------------
    initParticleCanvas: function () {
      this.canvas = document.getElementById('ambientParticleCanvas');
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());

      this.seedParticles(this.activeTheme);
      this.startLoop();
    },

    resizeCanvas: function () {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },

    seedParticles: function (theme) {
      if (!this.canvas || !this.settings.particlesEnabled || this.settings.reducedMotion) {
        this.particles = [];
        return;
      }

      const pType = (theme && theme.particle_type) || 'stardust';
      const baseColor = (theme && theme.primary_color) || '#b388ff';
      const accentColor = (theme && theme.accent_color) || '#ffd700';

      let count = 45;
      if (this.settings.intensity === 'subtle') count = 20;
      if (this.settings.intensity === 'cinematic') count = 75;

      this.particles = [];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          radius: Math.random() * 2.8 + 0.8,
          color: Math.random() > 0.4 ? baseColor : accentColor,
          alpha: Math.random() * 0.7 + 0.2,
          speedX: (Math.random() - 0.5) * 0.6,
          speedY: (Math.random() * -0.8) - 0.2, // Drift upward
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: Math.random() * 0.03 + 0.01,
          type: pType
        });
      }
    },

    startLoop: function () {
      const self = this;
      function loop() {
        if (self.isTabActive && self.settings.particlesEnabled && !self.settings.reducedMotion) {
          self.renderParticles();
        }
        self.animationFrameId = requestAnimationFrame(loop);
      }
      if (!this.animationFrameId) {
        this.animationFrameId = requestAnimationFrame(loop);
      }
    },

    renderParticles: function () {
      if (!this.ctx || !this.canvas) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];

        p.wobble += p.wobbleSpeed;
        p.x += p.speedX + Math.sin(p.wobble) * 0.4;
        p.y += p.speedY;

        // Wrap around boundaries
        if (p.y < -10) p.y = this.canvas.height + 10;
        if (p.x < -10) p.x = this.canvas.width + 10;
        if (p.x > this.canvas.width + 10) p.x = -10;

        this.ctx.save();
        this.ctx.globalAlpha = p.alpha;
        this.ctx.fillStyle = p.color;

        // Custom shape rendering according to particle type
        if (p.type === 'confetti' || p.type === 'geometric_nodes') {
          this.ctx.fillRect(p.x, p.y, p.radius * 2.2, p.radius * 2.2);
        } else if (p.type === 'rose_petals' || p.type === 'sakura_petals') {
          this.ctx.beginPath();
          this.ctx.ellipse(p.x, p.y, p.radius * 1.8, p.radius * 0.9, p.wobble, 0, Math.PI * 2);
          this.ctx.fill();
        } else {
          // Soft circular orbs & stardust
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          this.ctx.fill();
        }

        this.ctx.restore();
      }
    },

    // ------------------------------------------------------------------------
    // 4. Parallax Pointer Response
    // ------------------------------------------------------------------------
    initParallaxPointer: function () {
      if (!this.settings.parallaxEnabled || this.settings.reducedMotion) return;

      const artwork = document.querySelector('.ambient-layer-artwork');
      if (!artwork) return;

      window.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX / window.innerWidth - 0.5) * -18;
        const moveY = (e.clientY / window.innerHeight - 0.5) * -18;
        artwork.style.transform = `scale(1.06) translate(${moveX}px, ${moveY}px)`;
      });
    },

    // ------------------------------------------------------------------------
    // 5. Numeric Counter Rolling Animation
    // ------------------------------------------------------------------------
    initCounters: function () {
      if (this.settings.reducedMotion) return;

      const elements = document.querySelectorAll('[data-counter-target]');
      elements.forEach((el) => {
        const target = parseInt(el.getAttribute('data-counter-target'), 10) || 0;
        let current = 0;
        const duration = 1200; // ms
        const startTime = performance.now();

        function updateCount(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          current = Math.floor(easeProgress * target);
          el.textContent = current;

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            el.textContent = target;
          }
        }
        requestAnimationFrame(updateCount);
      });
    },

    // ------------------------------------------------------------------------
    // 6. Tab Visibility Cleanup
    // ------------------------------------------------------------------------
    bindVisibilityListener: function () {
      const self = this;
      document.addEventListener('visibilitychange', () => {
        self.isTabActive = !document.hidden;
      });
    },

    // ------------------------------------------------------------------------
    // 7. Live Preview Manager (Try before you save)
    // ------------------------------------------------------------------------
    previewTheme: function (themeData) {
      if (!themeData) return;
      this.activeTheme = themeData;
      this.applyThemeCSSVariables(themeData);
    },

    restoreSavedTheme: function () {
      if (!this.savedTheme) return;
      this.activeTheme = Object.assign({}, this.savedTheme);
      this.applyThemeCSSVariables(this.savedTheme);
    },

    commitSavedTheme: function (themeData) {
      this.savedTheme = Object.assign({}, themeData);
      this.activeTheme = Object.assign({}, themeData);
      this.applyThemeCSSVariables(themeData);
    }
  };
})();
