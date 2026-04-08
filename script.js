/* ============================================================
                             script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* ==================================. Custom Cursor================================*/
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
    let mx = 0,
      my = 0,
      fx = 0,
      fy = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    });

    const animCursor = () => {
      fx += (mx - fx) * 0.12;
      fy += (my - fy) * 0.12;
      follower.style.left = fx + 'px';
      follower.style.top = fy + 'px';
      requestAnimationFrame(animCursor);
    };
    animCursor();

    // Scale on hoverable elements
    document
      .querySelectorAll('a, button, .srv-card, .testi-card')
      .forEach((el) => {
        el.addEventListener('mouseenter', () => {
          cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
          follower.style.transform = 'translate(-50%,-50%) scale(1.5)';
          follower.style.opacity = '.4';
        });
        el.addEventListener('mouseleave', () => {
          cursor.style.transform = 'translate(-50%,-50%) scale(1)';
          follower.style.transform = 'translate(-50%,-50%) scale(1)';
          follower.style.opacity = '1';
        });
      });
  }

  /* ========================== Navbar scroll =======================================*/
  const nav = document.getElementById('mainNav');
  window.addEventListener(
    'scroll',
    () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    },
    { passive: true }
  );

  /* ============================. Active nav link ================================*/
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener(
    'scroll',
    () => {
      let cur = '';
      sections.forEach((s) => {
        if (window.scrollY >= s.offsetTop - 120) cur = s.id;
      });
      navLinks.forEach((l) => {
        l.classList.toggle('active', l.getAttribute('href') === `#${cur}`);
      });
    },
    { passive: true }
  );

  /* ==================================== Reveal on scroll (IntersectionObserver) ==========================================*/
  const revealEls = document.querySelectorAll('[data-reveal]');

  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('revealed'), delay);
        revealObs.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach((el) => revealObs.observe(el));

  /* =========================== Animated counters =============================*/
  const counters = document.querySelectorAll('[data-count]');

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animCount = (el) => {
    const target = parseInt(el.dataset.count);
    const dur = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.floor(easeOut(p) * target);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };
    requestAnimationFrame(tick);
  };

  const countObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        animCount(e.target);
        countObs.unobserve(e.target);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => countObs.observe(el));

  /* ============================Progress bars ====================================*/
  const fills = document.querySelectorAll('.wm-fill[data-w]');

  const barObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        setTimeout(() => {
          e.target.style.width = e.target.dataset.w + '%';
        }, 300);
        barObs.unobserve(e.target);
      });
    },
    { threshold: 0.4 }
  );

  fills.forEach((f) => {
    f.style.width = '0';
    barObs.observe(f);
  });

  /* ================Mobile nav: close on link click =======================*/
  const menuEl = document.getElementById('navMenu');
  const bsCol = new bootstrap.Collapse(menuEl, { toggle: false });
  document
    .querySelectorAll('#navMenu .nav-link, #navMenu .nav-cta')
    .forEach((l) => {
      l.addEventListener('click', () => {
        if (menuEl.classList.contains('show')) bsCol.hide();
      });
    });

  /* ======================= Newsletter subscribe===============================*/
  const nlBtn = document.getElementById('nlBtn');
  const nlEmail = document.getElementById('nlEmail');
  if (nlBtn && nlEmail) {
    nlBtn.addEventListener('click', () => {
      const val = nlEmail.value.trim();
      if (!val || !val.includes('@')) {
        nlEmail.style.borderColor = '#ef4444';
        setTimeout(() => (nlEmail.style.borderColor = ''), 2000);
        return;
      }
      nlBtn.textContent = '✓ Done!';
      nlBtn.style.background = '#22c55e';
      nlEmail.value = '';
      setTimeout(() => {
        nlBtn.textContent = 'Subscribe';
        nlBtn.style.background = '';
      }, 3500);
    });
  }

  /*==========================Parallax on hero collage images ===============================*/
  const hcMain = document.querySelector('.hc-main img');
  if (hcMain) {
    window.addEventListener(
      'scroll',
      () => {
        const scrolled = window.scrollY;
        hcMain.style.transform = `scale(1.04) translateY(${scrolled * 0.06}px)`;
      },
      { passive: true }
    );
  }
});
