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

// ---------- v2 ----------
(() => {
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // manifesto: words light up with scroll
  const mt = $('#mtext');
  if (mt) {
    const key = ['promesa', 'clara', 'tres', 'segundos', 'siguiente', 'paso'];
    mt.innerHTML = mt.textContent.split(' ').map(w => `<span${key.some(k => w.toLowerCase().startsWith(k)) ? ' class="k"' : ''}>${w}</span>`).join(' ');
    const ws = $$('span', mt);
    const upd = () => {
      const r = mt.getBoundingClientRect(), vh = innerHeight;
      const p = Math.min(1, Math.max(0, (vh * .85 - r.top) / (r.height + vh * .35)));
      const n = Math.round(p * ws.length * 1.15);
      ws.forEach((w, i) => w.classList.toggle('on', i < n || reduce));
    };
    addEventListener('scroll', upd, { passive: true }); upd();
  }

  // method: scenes follow the active step
  const steps = $$('.mstep'), scenes = $$('.scene');
  if (steps.length) {
    const so = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      const i = +e.target.dataset.i;
      steps.forEach(s => s.classList.toggle('on', s === e.target));
      scenes.forEach((s, k) => s.classList.toggle('on', k === i - 1));
    }), { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach(s => so.observe(s));
  }

  // simulator
  const D = {
    sector: {
      clinica: { biz: 'tu clínica', srv: 'un tratamiento facial', offer: 'Diagnóstico gratuito', cta: 'Reserva tu cita' },
      resto: { biz: 'tu restaurante', srv: 'una cena en el local', offer: 'Menú degustación', cta: 'Reserva tu mesa' },
      inmo: { biz: 'tu inmobiliaria', srv: 'la visita a un piso', offer: 'Valoración gratuita', cta: 'Pide tu valoración' },
      gym: { biz: 'tu gimnasio', srv: 'tu primer mes', offer: 'Clase de prueba', cta: 'Apúntate a la prueba' }
    },
    format: {
      antes: s => [`Antes y después de ${s.srv}`, 'La diferencia se ve en 5 segundos', s.cta],
      testi: s => ['“No esperaba que fuera tan fácil”', `Un cliente cuenta cómo fue ${s.srv}`, s.cta],
      oferta: s => [`${s.offer}. Solo esta semana`, 'Qué incluye, cuánto cuesta y cómo reservar', s.cta],
      bts: s => [`Lo que no ves de ${s.biz}`, 'Un día normal, sin filtros', s.cta]
    }
  };
  const st = { sector: 'clinica', format: 'antes' };
  const txt = $('#simTxt'); if (!txt) return;
  const tag = $('#simTag'), cta = $('#simCta'), tm = $('#simTime'), bg = $('.simbg'), bars = $$('#simBars i'), list = $('#scriptList');
  const tags = ['HOOK', 'PROMESA', 'LLAMADA A LA ACCIÓN'];
  let timers = [], beat = 0, visible = false;
  const clear = () => { timers.forEach(clearTimeout); timers = []; };
  const script = () => D.format[st.format](D.sector[st.sector]);
  function render() {
    list.innerHTML = script().map((l, i) => `<li data-i="${i}">${l}</li>`).join('');
  }
  function play() {
    clear(); const sc = script(); bg.dataset.f = st.format;
    bars.forEach(b => { b.className = ''; });
    cta.classList.remove('show'); txt.innerHTML = '';
    const run = i => {
      beat = i; tag.textContent = tags[i]; tm.textContent = `0:0${i * 3} / 0:09`;
      bars.forEach((b, k) => { b.className = k < i ? 'done' : k === i ? 'run' : ''; });
      $$('#scriptList li').forEach((li, k) => li.classList.toggle('cur', k === i));
      if (i < 2) { txt.innerHTML = sc[i].split(' ').map((w, k) => `<span class="w" style="animation-delay:${k * 90}ms">${w}</span>`).join(' '); cta.classList.remove('show'); }
      else { txt.innerHTML = ''; cta.textContent = sc[2]; cta.classList.add('show'); }
      timers.push(setTimeout(() => run((i + 1) % 3), 3000));
    };
    run(0);
  }
  function pick(group, key) {
    $$(`#${group} button`).forEach(b => b.setAttribute('aria-checked', b.dataset.v === st[key]));
  }
  [['pSector', 'sector'], ['pFormat', 'format']].forEach(([id, key]) => {
    $$(`#${id} button`).forEach(b => b.addEventListener('click', () => { st[key] = b.dataset.v; pick(id, key); render(); play(); }));
  });
  $('#tCaps').addEventListener('change', e => txt.classList.toggle('caps-off', !e.target.checked));
  $('#replay').addEventListener('click', play);
  render();
  new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && !visible) { visible = true; play(); }
    else if (!e.isIntersecting && visible) { visible = false; clear(); }
  }), { threshold: .3 }).observe($('.simbox'));
})();

// videos: play when visible, pause otherwise
(() => {
  const vs = [...document.querySelectorAll('.vframe video')];
  if (!vs.length || !('IntersectionObserver' in window)) return;
  const o = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target; if (e.isIntersecting && e.intersectionRatio > .6) { v.play().catch(() => {}); } else v.pause();
  }), { threshold: [0, .6] });
  vs.forEach(v => o.observe(v));
})();
