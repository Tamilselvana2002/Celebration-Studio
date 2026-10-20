/**
 * CELEBRATION STUDIO — MASTER NAV & ATMOSPHERE CONTROLLER
 * Synchronizes header navigation, user profile display,
 * mobile drawer, and ambient particle backdrop across all static pages.
 */

document.addEventListener('DOMContentLoaded', function () {
  // 1. Highlight active navigation link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links .nav-link, .mobile-nav-drawer .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 2. Synchronize logged in user name
  if (window.CelebrationDB) {
    const user = window.CelebrationDB.getUser();
    document.querySelectorAll('#headerUserDisplay, .user-name-display').forEach(el => {
      el.textContent = user.username || 'Atelier Creator';
    });
  }

  // 3. Mobile Navigation Drawer Toggle
  const header = document.querySelector('.studio-header');
  const toggleBtn = document.getElementById('navMobileToggle');
  const drawer = document.getElementById('mobileNavDrawer');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', function () {
      const isOpen = drawer.classList.toggle('open');
      toggleBtn.classList.toggle('open', isOpen);
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
      drawer.setAttribute('aria-hidden', String(!isOpen));
    });

    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        toggleBtn.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('aria-hidden', 'true');
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        toggleBtn.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // 4. Header Glassmorphism Scroll State
  function checkScroll() {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();

  // 5. Ambient Particle Canvas Animation
  const canvas = document.getElementById('ambientParticleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(50, Math.floor(width / 25));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 0.8,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1,
        alpha: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;
        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${currentAlpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';
        ctx.fill();
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }
});
