(() => {
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  // Email de contacto (el mismo que usa la web actual)
  const CONTACT_EMAIL = 'samuelvillamancueto@gmail.com';
  $('#yr').textContent = new Date().getFullYear();

  // scroll progress + nav
  const prog = $('#progress'), nav = $('#nav'), fill = $('#lineFill'), steps = $('.steps');
  const onScroll = () => {
    const h = document.documentElement;
    prog.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
    nav.classList.toggle('s', h.scrollTop > 30);
    if (steps) {
      const r = steps.getBoundingClientRect(), vh = innerHeight;
      const p = Math.min(1, Math.max(0, (vh * .6 - r.top) / r.height));
      fill.style.height = (p * 100) + '%';
    }
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // reveal
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); if (e.target.classList.contains('step')) e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .15 });
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 90 + 'ms'; io.observe(el); });
  setTimeout(() => $$('.hero .reveal').forEach(el => el.classList.add('in')), 80);

  // counters
  const co = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; co.unobserve(e.target);
    const t = +e.target.dataset.count, t0 = performance.now();
    const tick = n => { const k = Math.min(1, (n - t0) / 1300); e.target.textContent = Math.round(t * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }));
  $$('[data-count]').forEach(el => co.observe(el));

  // spotlight cards + cursor glow
  $$('.spot').forEach(c => c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));
  const cur = $('#cursor');
  addEventListener('pointermove', e => { cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px'; });

  // phone tilt
  const ph = $('#phone'), stage = $('.hero-stage');
  stage.addEventListener('pointermove', e => {
    const r = stage.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    ph.style.transform = `perspective(900px) rotateY(${x * 18}deg) rotateX(${-y * 14}deg)`;
  });
  stage.addEventListener('pointerleave', () => ph.style.transform = '');

  // magnetic buttons
  $$('.magnetic').forEach(b => {
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .15}px,${(e.clientY - r.top - r.height / 2) * .25}px)`; });
    b.addEventListener('pointerleave', () => b.style.transform = '');
  });

  // mobile menu
  const bg = $('#burger'), lk = $('#links');
  bg.addEventListener('click', () => { const o = lk.classList.toggle('open'); bg.setAttribute('aria-expanded', o); });
  $$('#links a').forEach(a => a.addEventListener('click', () => { lk.classList.remove('open'); bg.setAttribute('aria-expanded', false); }));

  // form -> mailto
  $('#form').addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.target);
    if (!f.get('nombre').trim()) { $('#fine').textContent = 'Escribe tu nombre para continuar.'; return; }
    const body = `Nombre: ${f.get('nombre')}\nNegocio: ${f.get('negocio')}\nInversión mensual: ${f.get('inversion')}\n\n${f.get('msg')}`;
    $('#fine').textContent = 'Abriendo tu correo…';
    location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Llamada gratuita - ' + f.get('nombre'))}&body=${encodeURIComponent(body)}`;
  });
})();
