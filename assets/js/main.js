/* Maria Cosmetics — interactivity */
(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Year
  const yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // Sticky header shadow on scroll
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (window.scrollY > 12) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('mobileNav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      if (open) {
        mobileNav.hidden = true;
      } else {
        mobileNav.hidden = false;
      }
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        mobileNav.hidden = true;
      });
    });
  }

  // Reveal-on-scroll
  if ('IntersectionObserver' in window) {
    const items = document.querySelectorAll('.reveal');
    let staggerIndex = 0;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(el => {
      const delay = parseInt(el.dataset.delay || '0', 10);
      if (delay) el.style.transitionDelay = `${delay}ms`;
      io.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  }

  // Service card pointer-glow
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width) * 100;
      const my = ((e.clientY - r.top) / r.height) * 100;
      card.style.setProperty('--mx', mx + '%');
      card.style.setProperty('--my', my + '%');
    });
  });

  // Hero parallax tilt — desktop only, motion-safe
  if (!reduceMotion && window.matchMedia('(min-width: 980px) and (pointer:fine)').matches) {
    const stage = document.querySelector('.hero-stage');
    const card = document.querySelector('.hero-card');
    if (stage && card) {
      let raf = 0;
      let tx = 0, ty = 0;
      const onMove = (e) => {
        const w = window.innerWidth, h = window.innerHeight;
        const nx = (e.clientX / w - 0.5);
        const ny = (e.clientY / h - 0.5);
        tx = nx * 18;
        ty = ny * 14;
        if (!raf) raf = requestAnimationFrame(apply);
      };
      const apply = () => {
        card.style.transform = `translateY(-50%) rotateY(${-tx}deg) rotateX(${ty}deg)`;
        raf = 0;
      };
      window.addEventListener('pointermove', onMove);
    }
  }

  // Hero scroll parallax for orbs
  if (!reduceMotion) {
    const orbs = document.querySelectorAll('.orb');
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          orbs.forEach((o, i) => {
            const speed = (i + 1) * 0.05;
            o.style.transform = `translate3d(0, ${y * speed}px, 0)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // Smooth-scroll offset for sticky header
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      const offset = header ? header.offsetHeight + 8 : 0;
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });
})();

// Contact form -> WhatsApp deep link
function mcSubmit(e) {
  e.preventDefault();
  const f = e.target;
  const name = (f.name?.value || '').trim();
  const phone = (f.phone?.value || '').trim();
  const service = (f.service?.value || '').trim();
  const message = (f.message?.value || '').trim();
  const text =
    `שלום מריה 👋%0A` +
    `שמי: ${encodeURIComponent(name)}%0A` +
    `טלפון: ${encodeURIComponent(phone)}%0A` +
    `מתעניינ/ת בטיפול: ${encodeURIComponent(service)}%0A` +
    (message ? `הודעה: ${encodeURIComponent(message)}%0A` : '') +
    `(נשלח דרך האתר)`;
  window.open(`https://wa.me/972505945549?text=${text}`, '_blank', 'noopener');
  return false;
}
