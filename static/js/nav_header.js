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

  // 2. Synchronize logged in user and authentication state
  if (window.CelebrationDB) {
    const isAuth = window.CelebrationDB.isAuthenticated();
    const user = window.CelebrationDB.getUser();
    const protectedPages = ['dashboard.html', 'create.html', 'editor.html', 'profile.html', 'media-vault.html', 'recipients.html'];
    const isProtected = protectedPages.includes(currentPath);

    if (!isAuth) {
      if (isProtected) {
        window.location.replace('login.html?next=' + encodeURIComponent(currentPath + window.location.search + window.location.hash));
        return;
      }
      // On public pages, show Sign In / Register buttons in header
      const navActions = document.querySelector('.nav-actions');
      if (navActions) {
        navActions.innerHTML = `
          <a href="login.html" class="btn btn-ghost btn-sm" style="color: #fdf2f8; border-radius: 999px; padding: 5px 14px;">Sign In</a>
          <a href="register.html" class="btn btn-primary btn-sm" style="border-radius: 999px;">Register Free</a>
        `;
      }

      const drawerList = document.querySelector('#mobileNavDrawer ul');
      if (drawerList) {
        drawerList.innerHTML = `
          <li><a href="index.html" class="nav-link">✨ Home</a></li>
          <li><a href="templates.html" class="nav-link">🏛️ Templates</a></li>
          <li><a href="login.html" class="nav-link">🔑 Sign In</a></li>
          <li><a href="register.html" class="nav-link" style="color: var(--theme-primary);">✦ Register Free</a></li>
        `;
      }
    } else {
      // Authenticated: display user name
      document.querySelectorAll('#headerUserDisplay, .user-name-display').forEach(el => {
        el.textContent = user.fullName || user.username || 'Atelier Creator';
      });

      // Add one-click quick Sign Out button next to profile badge if not already present
      const navActions = document.querySelector('.nav-actions');
      if (navActions && !document.getElementById('headerLogoutBtn')) {
        const logoutBtn = document.createElement('a');
        logoutBtn.id = 'headerLogoutBtn';
        logoutBtn.href = '#';
        logoutBtn.title = 'Sign Out of Atelier';
        logoutBtn.innerHTML = '🚪 Sign Out';
        logoutBtn.className = 'btn btn-ghost btn-sm';
        logoutBtn.style.cssText = 'color: #fca5a5; font-size: 0.78rem; padding: 4px 10px; border-radius: 999px; border: 1px solid rgba(239, 68, 68, 0.25); text-decoration: none; display: inline-flex; align-items: center; gap: 4px;';
        logoutBtn.onclick = function (e) {
          e.preventDefault();
          if (confirm('Are you sure you want to sign out of Celebration Studio?')) {
            window.CelebrationDB.logout();
          }
        };
        const targetBtn = navActions.querySelector('.btn-primary') || null;
        if (targetBtn) {
          navActions.insertBefore(logoutBtn, targetBtn);
        } else {
          navActions.appendChild(logoutBtn);
        }
      }

      const drawerList = document.querySelector('#mobileNavDrawer ul');
      if (drawerList && !document.getElementById('mobileNavLogout')) {
        const li = document.createElement('li');
        li.id = 'mobileNavLogout';
        li.innerHTML = '<a href="#" class="nav-link" style="color: #fca5a5;">🚪 Sign Out</a>';
        li.querySelector('a').onclick = function (e) {
          e.preventDefault();
          if (confirm('Are you sure you want to sign out of Celebration Studio?')) {
            window.CelebrationDB.logout();
          }
        };
        drawerList.appendChild(li);
      }
    }
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
