/**
 * CELEBRATION STUDIO — MODERN 3D UI & UX ENGINE
 * Universal 3D perspective card tilt, specular holographic reflection,
 * magnetic micro-interactions, cursor starlight follower, and tactile depth.
 */

(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  class Modern3DUIEngine {
    constructor() {
      this.cards = [];
      this.cursorGlow = null;
    }

    init() {
      if (prefersReducedMotion) return;

      this.initCursorGlow();
      this.init3DCardTilt();
      this.initMagneticButtons();
      this.initRippleEffects();

      // Observe dynamic card additions
      const observer = new MutationObserver(() => {
        this.bindCards();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    // 1. Ambient Starlight Cursor Glow Follower
    initCursorGlow() {
      const glow = document.createElement('div');
      glow.className = 'ambient-glow-cursor';
      document.body.appendChild(glow);
      this.cursorGlow = glow;

      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 2;
      let curX = mouseX;
      let curY = mouseY;

      window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      }, { passive: true });

      function animateGlow() {
        curX += (mouseX - curX) * 0.12;
        curY += (mouseY - curY) * 0.12;
        glow.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
        requestAnimationFrame(animateGlow);
      }
      requestAnimationFrame(animateGlow);
    }

    // 2. 3D Perspective Card Tilt & Specular Glare
    init3DCardTilt() {
      this.bindCards();
    }

    bindCards() {
      const selector = '.studio-project-card, .template-card-item, .engine-interactive-card, .metric-glass-tile, .recipient-card, .media-card, .theme-card';
      const elements = document.querySelectorAll(selector);

      elements.forEach(card => {
        if (card.dataset.tiltBound) return;
        card.dataset.tiltBound = 'true';

        // Add specular glare overlay
        let glare = card.querySelector('.specular-glare-overlay');
        if (!glare) {
          glare = document.createElement('div');
          glare.className = 'specular-glare-overlay';
          card.appendChild(glare);
        }

        const handleMove = (e) => {
          const rect = card.getBoundingClientRect();
          const clientX = e.clientX || (e.touches && e.touches[0].clientX);
          const clientY = e.clientY || (e.touches && e.touches[0].clientY);
          if (!clientX || !clientY) return;

          const x = (clientX - rect.left) / rect.width;
          const y = (clientY - rect.top) / rect.height;

          const tiltX = (y - 0.5) * -16;
          const tiltY = (x - 0.5) * 16;

          card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateZ(12px) scale3d(1.02, 1.02, 1.02)`;

          glare.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 65%)`;
          glare.style.opacity = '1';
        };

        const handleLeave = () => {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0) scale3d(1, 1, 1)';
          glare.style.opacity = '0';
        };

        card.addEventListener('mousemove', handleMove, { passive: true });
        card.addEventListener('mouseleave', handleLeave);
        card.addEventListener('touchmove', handleMove, { passive: true });
        card.addEventListener('touchend', handleLeave);
      });
    }

    // 3. Magnetic 3D Buttons
    initMagneticButtons() {
      const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .aura-btn');
      magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const x = (e.clientX - rect.left - rect.width / 2) * 0.35;
          const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
          btn.style.transform = `translate3d(${x}px, ${y}px, 14px) scale(1.03)`;
        });

        btn.addEventListener('mouseleave', () => {
          btn.style.transform = 'translate3d(0, 0, 0) scale(1)';
        });
      });
    }

    // 4. Starlight Tactile Ripple Effect
    initRippleEffects() {
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn, .studio-tab-btn, .aura-btn, .template-cat-pill');
        if (!btn) return;

        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.top = `${y}px`;
        ripple.style.left = `${x}px`;
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(56,225,255,0.3) 50%, transparent 70%)';
        ripple.style.transform = 'translate(-50%, -50%) scale(0)';
        ripple.style.pointerEvents = 'none';
        ripple.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease';
        ripple.style.zIndex = '20';

        btn.appendChild(ripple);
        requestAnimationFrame(() => {
          ripple.style.transform = 'translate(-50%, -50%) scale(15)';
          ripple.style.opacity = '0';
        });

        setTimeout(() => {
          ripple.remove();
        }, 650);
      });
    }
  }

  // Auto-boot on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    window.Modern3DUI = new Modern3DUIEngine();
    window.Modern3DUI.init();
  });
})();
