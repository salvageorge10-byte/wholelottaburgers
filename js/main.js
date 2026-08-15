/* =========================================================
   WHOLE LOTTA BURGERS — interacciones
   Vanilla JS, sin dependencias. Todo es mejora progresiva:
   si el JS no carga, la página sigue siendo navegable.

   Cada función de abajo es una feature aislada, ejecutada a
   través de run(). Si una revienta (falta un elemento, cambió
   un id, lo que sea), las demás no se enteran: run() atrapa el
   error, lo deja en consola y sigue con la próxima. Antes todo
   esto vivía en un único bloque de arriba a abajo, así que un
   solo fallo — por ejemplo en el lightbox — se llevaba puestas
   las tabs del menú y todo lo que viniera después, aunque no
   tuvieran nada que ver entre sí.
   ========================================================= */
(() => {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const run = (name, fn) => {
    try { fn(); }
    catch (err) { console.error(`[main.js] "${name}" falló, sigo con el resto:`, err); }
  };

  /* ---------- año del footer ---------- */
  function initYear() {
    const yr = $('#yr');
    if (yr) yr.textContent = new Date().getFullYear();
  }

  /* ---------- header y botón flotante al hacer scroll ---------- */
  function initScrollHeader() {
    const hdr = $('#hdr');
    const fab = $('#fab');
    const hero = $('#inicio');
    const footer = $('.ft');
    if (!hdr) return;
    let atFooter = false;

    // En páginas sin hero grande (menu.html) no hay de qué tomar el 75%:
    // se muestra a partir de un scroll fijo, chico, en vez de nunca.
    const showAt = hero ? () => hero.offsetHeight * 0.75 : () => 240;

    let ticking = false;
    const onScroll = () => {
      const y = scrollY;
      hdr.classList.toggle('is-stuck', y > 24);
      if (fab) fab.classList.toggle('is-on', !atFooter && y > showAt());
      ticking = false;
    };
    addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();

    if (footer && fab && 'IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => { atFooter = e.isIntersecting; onScroll(); },
        { rootMargin: '0px 0px -35% 0px' }).observe(footer);
    }
  }

  /* ---------- navegación móvil ---------- */
  function initMobileNav() {
    const burger = $('#burger');
    const nav = $('#nav');
    if (!burger || !nav) return;

    const closeNav = () => {
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Abrir menú de navegación');
      nav.classList.remove('is-open');
      document.body.classList.remove('nav-open');
    };
    burger.addEventListener('click', () => {
      const open = burger.getAttribute('aria-expanded') === 'true';
      if (open) return closeNav();
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Cerrar menú de navegación');
      nav.classList.add('is-open');
      document.body.classList.add('nav-open');
    });
    $$('a', nav).forEach(a => a.addEventListener('click', closeNav));
    addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { closeNav(); burger.focus(); }
    });
  }

  /* ---------- marquee: duplicar para loop continuo ---------- */
  function initMarquee() {
    const track = $('#marqTrack');
    if (track && !reduced) track.innerHTML += track.innerHTML;
  }

  /* ---------- fila de fotos "se come con los ojos" ----------
     Se duplica el contenido para que el translateX(-50%) del keyframe
     cierre el bucle sin salto. La duración se ajusta al ancho real de
     una vuelta, así la velocidad no cambia si se agregan o sacan fotos. */
  function initShowReel() {
    if (reduced) return;
    const row = $('[data-reel]');
    const track = row && $('.show-track', row);
    if (!track) return;
    track.innerHTML += track.innerHTML;
    const anchoUnaVuelta = track.scrollWidth / 2;
    if (anchoUnaVuelta > 0) track.style.animationDuration = `${anchoUnaVuelta / 46}s`;
  }

  /* ---------- estado abierto / cerrado (hora de Argentina) ---------- */
  function initStatusPill() {
    // Verificado: todos los días de 12 a 16 y de 20 a 00.
    const RANGES = [[720, 960], [1200, 1440]];
    const pill = $('#status');
    const pillTxt = $('#statusTxt');
    if (!pill || !pillTxt) return;

    const minutesInBA = () => {
      try {
        const p = new Intl.DateTimeFormat('es-AR', {
          timeZone: 'America/Argentina/Buenos_Aires',
          hour: '2-digit', minute: '2-digit', hour12: false
        }).formatToParts(new Date());
        const h = +p.find(x => x.type === 'hour').value % 24;
        const m = +p.find(x => x.type === 'minute').value;
        return h * 60 + m;
      } catch {
        const d = new Date();
        return d.getHours() * 60 + d.getMinutes();
      }
    };

    const now = minutesInBA();
    const isOpen = RANGES.some(([a, b]) => now >= a && now < b);
    pill.hidden = false;
    if (isOpen) {
      pill.classList.add('is-open');
      pillTxt.textContent = 'Abierto ahora';
    } else {
      pillTxt.textContent = now < 720 ? 'Cerrado · Abrimos 12:00'
                          : now < 1200 ? 'Cerrado · Abrimos 20:00'
                          : 'Cerrado · Abrimos 12:00';
    }
  }

  /* ---------- reveal al scroll ----------
     Se revisa por posición en lugar de con IntersectionObserver: con un scroll
     rápido el observer puede saltearse elementos y dejarlos invisibles para
     siempre. Acá cualquier elemento que ya pasó el borde inferior se muestra,
     sin importar a qué velocidad se haya scrolleado. */
  const revealAll = scope => $$('.rv', scope).forEach(el => el.classList.add('is-in'));

  function initReveal() {
    if (reduced) { revealAll(document); return; }

    let pending = $$('.rv');
    if (!pending.length) return;

    const flush = () => {
      const limit = innerHeight * 0.94;
      const still = [];
      pending.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top >= limit) { still.push(el); return; }
        const sibs = [...el.parentElement.children].filter(n => n.classList.contains('rv'));
        // el tope evita que el último de una grilla larga tarde una eternidad
        el.style.transitionDelay = `${Math.min(sibs.indexOf(el), 7) * 80}ms`;
        el.classList.add('is-in');
      });
      pending = still;
    };

    // Throttle con setTimeout, no con requestAnimationFrame: una pestaña en
    // segundo plano o con throttling puede tardar en darle un frame a rAF,
    // y mientras tanto el contenido quedaría invisible. El timer sí corre.
    let queued = false;
    const schedule = () => {
      if (queued || !pending.length) return;
      queued = true;
      setTimeout(() => { flush(); queued = false; }, 80);
    };
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule, { passive: true });

    // Segundo disparador en paralelo: si por lo que sea el scroll no llega,
    // el observer igual muestra el elemento. Escribir is-in dos veces no molesta.
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        if (entries.some(e => e.isIntersecting)) flush();
      }, { rootMargin: '0px 0px -6% 0px' });
      pending.forEach(el => io.observe(el));
    }

    flush();
  }

  /* ---------- tabs del menú ---------- */
  function initTabs() {
    const tabs = $$('.tab');
    const panels = $$('.menu-panel');
    if (!tabs.length || !panels.length) return;

    const selectTab = (tab, focus = false) => {
      tabs.forEach(t => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.classList.toggle('is-on', on);
      });
      panels.forEach(p => { p.hidden = p.id !== tab.getAttribute('aria-controls'); });

      const panel = $('#' + tab.getAttribute('aria-controls'));
      if (panel) revealAll(panel);              // el panel estaba oculto: mostramos su contenido
      if (focus) tab.focus();
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => selectTab(tab));
      tab.addEventListener('keydown', e => {
        const map = { ArrowRight: 1, ArrowLeft: -1, Home: 'first', End: 'last' };
        if (!(e.key in map)) return;
        e.preventDefault();
        const next = map[e.key] === 'first' ? tabs[0]
                   : map[e.key] === 'last'  ? tabs[tabs.length - 1]
                   : tabs[(i + map[e.key] + tabs.length) % tabs.length];
        selectTab(next, true);
      });
    });
  }

  /* ---------- scrollspy ---------- */
  function initScrollspy() {
    const links = $$('.nav-list a');
    if (!links.length || !('IntersectionObserver' in window)) return;

    const sections = links
      .map(a => ({ a, sec: $(a.getAttribute('href')) }))
      .filter(x => x.sec);
    if (!sections.length) return;

    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(a => a.classList.remove('is-active'));
        const hit = sections.find(x => x.sec === entry.target);
        if (hit) hit.a.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(x => spy.observe(x.sec));
  }

  /* ---------- lightbox de la galería ---------- */
  function initLightbox() {
    const lb = $('#lb');
    const lbImg = $('#lbImg');
    const lbCap = $('#lbCap');
    const lbClose = $('#lbClose');
    const lbPrev = $('#lbPrev');
    const lbNext = $('#lbNext');
    const figures = $$('#galGrid .g');
    if (!lb || !lbImg || !lbClose || !figures.length) return;

    let idx = 0;
    let lastFocus = null;

    const show = i => {
      idx = (i + figures.length) % figures.length;
      const fig = figures[idx];
      const img = $('img', fig);
      const cap = $('figcaption', fig);
      if (!img) return;
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
      if (lbCap) lbCap.textContent = cap ? cap.textContent : '';
    };

    const openLb = i => {
      lastFocus = document.activeElement;
      show(i);
      lb.hidden = false;
      void lb.offsetWidth;
      lb.classList.add('is-on');
      document.body.style.overflow = 'hidden';
      lbClose.focus();
    };

    const closeLb = () => {
      lb.classList.remove('is-on');
      document.body.style.overflow = '';
      setTimeout(() => { lb.hidden = true; lbImg.src = ''; }, 300);
      if (lastFocus) lastFocus.focus();
    };

    figures.forEach((fig, i) => {
      const img = $('img', fig);
      fig.setAttribute('role', 'button');
      fig.setAttribute('tabindex', '0');
      fig.setAttribute('aria-label', `Ampliar foto: ${img ? img.alt : ''}`);
      fig.addEventListener('click', () => openLb(i));
      fig.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(i); }
      });
    });

    lbClose.addEventListener('click', closeLb);
    if (lbPrev) lbPrev.addEventListener('click', () => show(idx - 1));
    if (lbNext) lbNext.addEventListener('click', () => show(idx + 1));
    lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
    addEventListener('keydown', e => {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
      if (e.key === 'Tab') {                       // atrapamos el foco dentro del diálogo
        const f = $$('button', lb);
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  function initParallax() {
    if (reduced) return;
    const band = $('.band-media');
    const heroImg = $('.hero-media img');
    if (!band && !heroImg) return;

    let ticking = false;
    const update = () => {
      if (band) {
        const section = band.closest('.band');
        const r = section.getBoundingClientRect();
        const centerDelta = (innerHeight / 2) - (r.top + r.height / 2);
        const offset = Math.max(-36, Math.min(36, centerDelta * 0.08));
        band.style.transform = `translateY(${offset.toFixed(1)}px)`;
      }
      // Foto del hero: se desplaza apenas más lento que el scroll (efecto
      // de profundidad clásico). El scale(1.06) de la propia foto (en CSS)
      // da margen para que este desplazamiento no deje ver el borde.
      if (heroImg) {
        const offset = Math.max(0, Math.min(50, scrollY * 0.14));
        heroImg.style.setProperty('--py', `${offset.toFixed(1)}px`);
      }
      ticking = false;
    };
    addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------- arranque: cada feature corre aislada ---------- */
  run('año',        initYear);
  run('header',     initScrollHeader);
  run('nav móvil',  initMobileNav);
  run('marquee',    initMarquee);
  run('fotos',      initShowReel);
  run('estado',     initStatusPill);
  run('reveal',     initReveal);
  run('tabs',       initTabs);
  run('scrollspy',  initScrollspy);
  run('lightbox',   initLightbox);
  run('parallax',   initParallax);
})();
