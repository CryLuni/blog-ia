// ============== Cursor glow ==============
const cursorGlow = document.getElementById('cursorGlow');
let mx = window.innerWidth / 2, my = window.innerHeight / 2;
let gx = mx, gy = my;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
});
function animateGlow() {
  gx += (mx - gx) * 0.1;
  gy += (my - gy) * 0.1;
  if (cursorGlow) {
    cursorGlow.style.left = gx + 'px';
    cursorGlow.style.top = gy + 'px';
  }
  requestAnimationFrame(animateGlow);
}
animateGlow();

// ============== Progress bar ==============
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  progressBar.style.width = scrolled + '%';
});

// ============== Reveal on scroll ==============
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => io.observe(el));

// ============== Counter animation ==============
const counters = document.querySelectorAll('.stat-num');
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterIO.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

counters.forEach(c => counterIO.observe(c));

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();

  const isLarge = target > 1000;

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    el.textContent = isLarge
      ? current.toLocaleString('en-US') + suffix
      : current + suffix;

    if (progress < 1) requestAnimationFrame(tick);
    else {
      el.textContent = isLarge
        ? target.toLocaleString('en-US') + suffix
        : target + suffix;
    }
  }
  requestAnimationFrame(tick);
}

// ============== Metric bars ==============
const bars = document.querySelectorAll('.bar-fill');
const barsIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target.dataset.fill;
      setTimeout(() => {
        entry.target.style.width = fill + '%';
      }, 200);
      barsIO.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

bars.forEach(b => barsIO.observe(b));

// ============== Risk filters ==============
const filters = document.querySelectorAll('.filter');
const riskCards = document.querySelectorAll('.risk-card');

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(f => f.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.filter;

    riskCards.forEach((card, i) => {
      const matches = cat === 'all' || card.dataset.cat === cat;
      if (matches) {
        card.classList.remove('hidden');
        card.style.animation = 'none';
        // re-trigger
        void card.offsetWidth;
        card.style.animation = `riskIn 0.5s ${i * 0.05}s both cubic-bezier(0.22, 1, 0.36, 1)`;
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// add keyframe dynamically
const styleSheet = document.createElement('style');
styleSheet.textContent = `
@keyframes riskIn {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
`;
document.head.appendChild(styleSheet);

// ============== Theme toggle ==============
const themeBtn = document.getElementById('themeBtn');
themeBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  if (current === 'light') {
    document.documentElement.removeAttribute('data-theme');
    themeBtn.textContent = '◐';
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    themeBtn.textContent = '◑';
  }
});

// ============== Smooth scroll active nav highlight ==============
const sections = document.querySelectorAll('section[id], header[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    const top = s.offsetTop - 120;
    if (window.scrollY >= top) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

// add active style for nav
const activeStyle = document.createElement('style');
activeStyle.textContent = `
.nav-links a.active {
  color: var(--text);
  background: var(--bg-card);
}
`;
document.head.appendChild(activeStyle);

// ============== Parallax orbs ==============
window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 30;
  document.querySelectorAll('.orb').forEach((orb, i) => {
    const factor = (i + 1) * 0.5;
    orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
  });
});

// ============== Card 3D tilt ==============
const tiltCards = document.querySelectorAll('.card, .dataset-card, .model-card, .arch, .member, .video-card');
tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -4;
    const rotY = ((x - cx) / cx) * 4;
    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
