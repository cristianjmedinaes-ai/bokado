(function () {
  // Carga el tema (sobrescribe style.css sin tocar cada página)
  if (!document.querySelector('link[href="theme.css"]')) {
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'theme.css'; document.head.appendChild(l);
  }
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const go = () => {
    // ---- Resumen en el header ----
    const header = document.querySelector('header'), logo = header && header.querySelector('.logo');
    if (logo && !header.querySelector('.header-tagline')) {
      const t = document.createElement('p'); t.className = 'header-tagline';

      logo.after(t);
    }
 
    // ---- Animación de inicio (solo en el inicio, una vez por sesión) ----
    if (document.getElementById('categoriesGrid') && logo && !sessionStorage.getItem('bk_splash')) {
      sessionStorage.setItem('bk_splash', '1');
      const sp = document.createElement('div'); sp.id = 'splash';
      const sl = document.createElement('div'); sl.className = 'splash-logo';
      sl.innerHTML = 'BOKADO<small>YOPAL, CASANARE</small>'; sl.style.letterSpacing = '.1em';
      document.body.append(sp, sl); logo.classList.add('hidden');
      setTimeout(() => {
        const r = logo.getBoundingClientRect();
        const s = parseFloat(getComputedStyle(logo).fontSize) / parseFloat(getComputedStyle(sl).fontSize);
        sl.classList.add('go');
        sl.style.left = r.left + 'px'; sl.style.top = r.top + 'px';
        sl.style.transform = 'translate(0,0) scale(' + s + ')';
        sp.classList.add('out');
        setTimeout(() => { logo.classList.remove('hidden'); sl.remove(); sp.remove(); }, 1100);
      }, 2200);
    }
 
    // ---- Descripciones al pasar el cursor (inicio) ----
    const D = {
      'comidallanera.html': ['Fogón, brasa y sabana en cada plato.', ['Mamona', 'Carne a la perra', 'Tungos', 'Hayacas', 'Chigüiro']],
      'comidadelmar.html': ['Del río y del mar a tu mesa.', ['Ceviches', 'Mojarra frita', 'Cazuela de mariscos', 'Camarones']],
      'almuerzoydesayunos.html': ['Para arrancar el día o resolver el almuerzo.', ['Caldos criollos', 'Calentado', 'Ejecutivos', 'Platos del día']],
      'comidasrapidas.html': ['Antojos para cualquier hora, sobre todo de noche.', ['Hamburguesas', 'Perros calientes', 'Pizza', 'Alitas', 'Salchipapas']],
      'comidamexicana.html': ['Picante, maíz y mucho queso.', ['Tacos', 'Burritos', 'Quesadillas', 'Nachos', 'Guacamole']],
      'postreriaypasteleria.html': ['Lo dulce de Yopal, con buen café.', ['Café de especialidad', 'Tortas', 'Postres', 'Helados', 'Donas']],
      'experienciasnuevas.html': ['Propuestas nuevas y cocina de autor.', ['Cocina de autor', 'Maridajes', 'Temáticos']]
    };
    document.querySelectorAll('#categoriesGrid a.card').forEach(c => {
      const d = D[(c.getAttribute('href') || '').toLowerCase()]; if (!d) return;
      const box = document.createElement('div'); box.className = 'card-desc';
      box.innerHTML = '<p></p><ul></ul>'; box.querySelector('p').textContent = d[0];
      d[1].forEach(x => { const li = document.createElement('li'); li.textContent = x; box.querySelector('ul').appendChild(li); });
      c.appendChild(box);
      if (matchMedia('(hover:none)').matches) c.addEventListener('click', e => {
        if (!c.classList.contains('tap')) { e.preventDefault(); document.querySelectorAll('.card.tap').forEach(x => x.classList.remove('tap')); c.classList.add('tap'); }
      });
    });
 
    // ---- Cada restaurante abre su carta y comentarios ----
    const cat = page.replace('.html', '');
    document.querySelectorAll('.restaurant-card').forEach(card => {
      const img = card.querySelector('.card-img'); if (!img) return;
      const txt = i => { const el = card.querySelectorAll('.info-item')[i]; return el ? el.textContent.replace(/^[^:]+:/, '').trim() : ''; };
      const q = new URLSearchParams({
        c: cat, n: card.querySelector('.restaurant-title').textContent.trim(),
        a: txt(0), t: txt(1), r: (card.querySelector('.rating-stars') || {}).textContent || '', i: img.getAttribute('src') || ''
      });
      const href = 'restaurante.html?' + q;
      const a = card.querySelector('.card-link');
      if (a) { a.classList.add('alt'); a.textContent = 'Ver ubicación'; }
      const b = document.createElement('a'); b.href = href; b.className = 'card-link'; b.textContent = 'Ver carta y opiniones';
      card.querySelector('.card-body').insertBefore(b, a);
      card.addEventListener('click', e => { if (!e.target.closest('a')) location.href = href; });
    });
 
    // ---- Aparición al hacer scroll ----
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); setTimeout(() => { e.target.style.transitionDelay = ''; }, 1000); }
    }), { threshold: .12 });
    document.querySelectorAll('.card,.restaurant-card,.about-card,.review-box,.rest-section .menu-item').forEach((el, i) => {
      el.classList.add('reveal'); el.style.transitionDelay = (i % 3) * 90 + 'ms'; io.observe(el);
    });
  };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', go) : go();
})();