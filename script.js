/* ════════════════════════════════════════════
   KANDULA SOWMYA — PORTFOLIO JS
   ════════════════════════════════════════════ */

'use strict';

// ──────────────────────────────────────────
// UTILITY
// ──────────────────────────────────────────
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// ──────────────────────────────────────────
// CUSTOM CURSOR
// ──────────────────────────────────────────
(function initCursor() {
  const cursor   = $('#cursor');
  const follower = $('#cursor-follower');
  if (!cursor || !follower) return;

  let mx = 0, my = 0;
  let fx = 0, fy = 0;
  let raf;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function animate() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    raf = requestAnimationFrame(animate);
  })();

  // Grow on interactive elements
  $$('a, button, .proj-card, .cert-card, .skill-box').forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('hovering'));
    el.addEventListener('mouseleave', () => follower.classList.remove('hovering'));
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  });
})();

// ──────────────────────────────────────────
// SCROLL PROGRESS BAR
// ──────────────────────────────────────────
(function initScrollBar() {
  const bar = $('#scroll-bar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrolled = document.documentElement.scrollTop;
    const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    bar.style.width = (scrolled / max * 100) + '%';
  }, { passive: true });
})();

// ──────────────────────────────────────────
// BACK TO TOP
// ──────────────────────────────────────────
(function initBTT() {
  const btn = $('#btt');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// ──────────────────────────────────────────
// THEME TOGGLE
// ──────────────────────────────────────────
(function initTheme() {
  const btn  = $('#theme-btn');
  const icon = $('#theme-icon');
  const html = document.documentElement;

  const saved = localStorage.getItem('ks-theme') || 'dark';
  applyTheme(saved);

  btn && btn.addEventListener('click', () => {
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('ks-theme', next);
  });

  function applyTheme(t) {
    html.dataset.theme = t;
    if (icon) {
      icon.className = t === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }
})();

// ──────────────────────────────────────────
// MOBILE DRAWER
// ──────────────────────────────────────────
(function initDrawer() {
  const hamburger = $('#hamburger');
  const drawer    = $('#drawer');
  const overlay   = $('#drawer-overlay');
  const closeBtn  = $('#drawer-close');
  if (!hamburger || !drawer) return;

  function open()  { drawer.classList.add('open'); overlay.classList.add('visible'); document.body.style.overflow = 'hidden'; }
  function close() { drawer.classList.remove('open'); overlay.classList.remove('visible'); document.body.style.overflow = ''; }

  hamburger.addEventListener('click', open);
  closeBtn  && closeBtn.addEventListener('click', close);
  overlay   && overlay.addEventListener('click', close);
  $$('.drawer-link').forEach(a => a.addEventListener('click', close));
})();

// ──────────────────────────────────────────
// NAV ACTIVE LINKS & SHRINK ON SCROLL
// ──────────────────────────────────────────
(function initNav() {
  const nav   = $('#nav');
  const links = $$('[data-nav]');
  const sections = $$('section[id]');

  window.addEventListener('scroll', () => {
    // shrink
    nav && nav.classList.toggle('scrolled', window.scrollY > 60);

    // active
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(a => {
      const matches = a.getAttribute('href') === '#' + current;
      a.classList.toggle('active', matches);
    });
  }, { passive: true });
})();

// ──────────────────────────────────────────
// HERO CANVAS — PARTICLES
// ──────────────────────────────────────────
(function initHeroCanvas() {
  const canvas = $('#hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const particles = [];
  const COUNT = 90;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); });

  class P {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x  = Math.random() * canvas.width;
      this.y  = init ? Math.random() * canvas.height : canvas.height + 10;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = -(Math.random() * 0.6 + 0.1);
      this.r  = Math.random() * 1.8 + 0.3;
      this.a  = Math.random() * 0.45 + 0.05;
      this.c  = Math.random() > 0.55 ? '94,184,255' : Math.random() > 0.5 ? '139,92,246' : '34,211,160';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.c},${this.a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new P());

  // Mouse parallax
  let mx = canvas.width / 2, my = canvas.height / 2;
  document.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mx = e.clientX - rect.left;
    my = e.clientY - rect.top;
  });

  function connect() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(94,184,255,${0.06 * (1 - d / 110)})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  (function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connect();
    requestAnimationFrame(loop);
  })();
})();

// ──────────────────────────────────────────
// HERO ROLE TICKER
// ──────────────────────────────────────────
(function initRoleTicker() {
  const roles = $$('.role');
  if (!roles.length) return;
  let idx = 0;

  function next() {
    roles[idx].classList.remove('active');
    idx = (idx + 1) % roles.length;
    roles[idx].classList.add('active');
  }
  setInterval(next, 2500);
})();

// ──────────────────────────────────────────
// SCROLL REVEAL
// ──────────────────────────────────────────
(function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  $$('.reveal').forEach(el => obs.observe(el));
})();

// ──────────────────────────────────────────
// ANIMATED COUNTERS (hero stats)
// ──────────────────────────────────────────
(function initCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      obs.unobserve(e.target);
      const el     = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const isFloat = !Number.isInteger(target);
      let start;

      function tick(ts) {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / 1400, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        const current  = eased * target;
        el.textContent = (isFloat ? current.toFixed(1) : Math.round(current)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => obs.observe(el));
})();

// ──────────────────────────────────────────
// CP SKILL BARS
// ──────────────────────────────────────────
(function initCPBars() {
  const bars = $$('.cp-bar-fill');
  if (!bars.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      obs.unobserve(e.target);
      const w = e.target.dataset.w || 0;
      setTimeout(() => { e.target.style.width = w + '%'; }, 200);
    });
  }, { threshold: 0.3 });

  bars.forEach(b => obs.observe(b));
})();

// ──────────────────────────────────────────
// PROJECT FILTER
// ──────────────────────────────────────────
(function initProjectFilter() {
  const btns  = $$('.pf-btn');
  const cards = $$('.proj-card');
  if (!btns.length || !cards.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.cat === filter;
        card.classList.toggle('hidden', !show);
        if (show) {
          card.style.animation = 'none';
          card.offsetHeight; // reflow
          card.style.animation = '';
        }
      });
    });
  });
})();

// ──────────────────────────────────────────
// CONTACT FORM
// ──────────────────────────────────────────
(function initContactForm() {
  const form    = $('#contact-form');
  const success = $('#form-success');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = $('#f-name')?.value.trim();
    const email   = $('#f-email')?.value.trim();
    const subject = $('#f-subject')?.value.trim();
    const msg     = $('#f-msg')?.value.trim();

    if (!name || !email || !msg) {
      shakeForm(form);
      return;
    }
    if (!isValidEmail(email)) {
      const fi = $('#f-email');
      fi && fi.classList.add('error');
      setTimeout(() => fi && fi.classList.remove('error'), 2000);
      return;
    }

    // Simulate send
    const btn = form.querySelector('.form-btn');
    if (btn) {
      btn.textContent = 'Sending…';
      btn.disabled = true;
    }
    setTimeout(() => {
      form.reset();
      if (btn) { btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message'; btn.disabled = false; }
      if (success) { success.classList.add('show'); setTimeout(() => success.classList.remove('show'), 5000); }
    }, 1200);
  });

  function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
  function shakeForm(el) {
    el.style.animation = 'shake 0.4s ease';
    setTimeout(() => el.style.animation = '', 400);
  }
})();

// ──────────────────────────────────────────
// RESUME DOWNLOAD
// ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const dlBtn = $('#dl-resume');
  dlBtn && dlBtn.addEventListener('click', e => {
    // If resume.pdf exists in same folder, this will work automatically.
    // Otherwise show a friendly message.
    const link = document.createElement('a');
    link.href = 'resume.pdf';
    link.download = 'Kandula_Sowmya_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});

// ──────────────────────────────────────────
// SMOOTH SECTION LINKS
// ──────────────────────────────────────────
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ──────────────────────────────────────────
// TILT EFFECT — Project Cards
// ──────────────────────────────────────────
(function initTilt() {
  const cards = $$('.proj-card, .cert-card, .edu-card');
  if (window.matchMedia('(hover:none)').matches) return; // skip touch

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r   = card.getBoundingClientRect();
      const x   = e.clientX - r.left;
      const y   = e.clientY - r.top;
      const mx  = r.width  / 2;
      const my  = r.height / 2;
      const rx  = ((y - my) / my) * 4;   // max 4 deg
      const ry  = ((x - mx) / mx) * -4;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// ──────────────────────────────────────────
// GRADIENT ORBS (ambient background)
// ──────────────────────────────────────────
(function initOrbs() {
  if (window.innerWidth < 768) return;

  const orbs = [
    { color: 'rgba(94,184,255,0.04)', size: 600, x: '10%',  y: '20%' },
    { color: 'rgba(139,92,246,0.04)', size: 500, x: '80%', y: '60%' },
    { color: 'rgba(34,211,160,0.03)', size: 400, x: '50%',  y: '80%' },
  ];

  orbs.forEach(orb => {
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed; pointer-events:none; z-index:0; border-radius:50%;
      width:${orb.size}px; height:${orb.size}px;
      left:${orb.x}; top:${orb.y};
      transform:translate(-50%,-50%);
      background:radial-gradient(circle, ${orb.color}, transparent 70%);
      filter:blur(40px);
    `;
    document.body.appendChild(el);
  });
})();

// ──────────────────────────────────────────
// KEYBOARD ACCESSIBILITY
// ──────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const drawer  = $('#drawer');
    const overlay = $('#drawer-overlay');
    if (drawer && drawer.classList.contains('open')) {
      drawer.classList.remove('open');
      overlay && overlay.classList.remove('visible');
      document.body.style.overflow = '';
    }
  }
});

// ──────────────────────────────────────────
// ADD SHAKE KEYFRAME DYNAMICALLY
// ──────────────────────────────────────────
(function addShakeKeyframe() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX(6px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(4px); }
    }
    .fi.error { border-color: #f87171 !important; box-shadow: 0 0 0 3px rgba(248,113,113,0.15) !important; }
    #nav.scrolled { box-shadow: 0 4px 30px rgba(0,0,0,0.3); }
  `;
  document.head.appendChild(style);
})();

console.log('%c Portfolio by Kandula Sowmya ', 'background:#5eb8ff;color:#000;padding:4px 8px;border-radius:4px;font-weight:bold;');
console.log('%c Full Stack Developer · CGPA 9.2 · CodeChef 3★ ', 'color:#8b5cf6;font-size:12px;');
