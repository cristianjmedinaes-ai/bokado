(function () {
  const P = new URLSearchParams(location.search);
  const cat = P.get('c') || '', name = P.get('n') || 'Restaurante';
  const slug = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const id = cat + '__' + slug(name);
  const $ = x => document.getElementById(x);
  const money = n => '$' + n.toLocaleString('es-CO');

  // ---------- Carta (ver cartas.js y carta.js) ----------
  $('rName').textContent = name; document.title = name + ' - BOKADO Yopal';
  $('rAddr').textContent = P.get('a') || 'Por confirmar'; $('rTel').textContent = P.get('t') || 'Por confirmar';
  $('rRating').textContent = P.get('r') || '';
  if (P.get('i')) $('rImg').src = P.get('i'); else $('rImg').style.display = 'none';
  $('btnBack').onclick = e => { e.preventDefault(); history.length > 1 ? history.back() : location.href = (cat || 'INDEX') + '.html'; };
  mountCarta($('cartaBook'), id, cat, name);

  // ---------- Comentarios ----------
  let user = null, rating = 0;
  const box = $('reviewBox');
  const stars = n => '★'.repeat(n) + '☆'.repeat(5 - n);

  function drawForm() {
    box.innerHTML = '';
    if (!user) {
      box.innerHTML = '<div class="login-lock"><p>Inicia sesión para dejar tu opinión sobre este restaurante.</p><button type="button" id="lockBtn">Iniciar sesión</button></div>';
      $('lockBtn').onclick = () => $('btnOpenLogin').click();
      return;
    }
    box.innerHTML = '<div class="stars-input" id="starsIn"></div><div class="form-group"><label for="rvAspect">¿Sobre qué quieres opinar?</label><select id="rvAspect" class="form-control"><option>Comida</option><option>Atención</option><option>Ambiente</option><option>Precio</option><option>General</option></select></div><div class="form-group"><label for="rvText">Tu comentario</label><textarea id="rvText" class="form-control" maxlength="600" placeholder="Cuéntanos tu experiencia..."></textarea></div><button type="button" class="btn-submit" id="rvSend">Publicar opinión</button>';
    for (let i = 1; i <= 5; i++) {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = '★'; b.setAttribute('aria-label', i + ' estrellas');
      b.onclick = () => { rating = i; [...$('starsIn').children].forEach((x, k) => x.classList.toggle('on', k < i)); };
      $('starsIn').appendChild(b);
    }
    $('rvSend').onclick = async () => {
      const texto = $('rvText').value.trim();
      if (!rating) return alert('Elige una calificación de 1 a 5 estrellas.');
      if (texto.length < 5) return alert('Escribe un comentario un poco más largo.');
      const { error } = await supabaseClient.from('comentarios').insert({
        restaurante: id, user_id: user.id, user_name: (user.user_metadata && user.user_metadata.full_name) || user.email.split('@')[0],
        aspecto: $('rvAspect').value, calificacion: rating, texto
      });
      if (error) return alert('No se pudo publicar: ' + error.message);
      rating = 0; drawForm(); loadReviews();
    };
  }

  async function loadReviews() {
    const list = $('reviewList');
    const { data, error } = await supabaseClient.from('comentarios').select('*').eq('restaurante', id).order('created_at', { ascending: false });
    list.innerHTML = '';
    if (error) { list.innerHTML = '<p class="no-comments-msg">No se pudieron cargar las opiniones.</p>'; return; }
    if (!data.length) { list.innerHTML = '<p class="no-comments-msg">Aún no hay opiniones. Sé la primera persona en comentar.</p>'; $('rAvg').textContent = ''; return; }
    $('rAvg').textContent = '· ' + (data.reduce((s, c) => s + c.calificacion, 0) / data.length).toFixed(1) + ' de ' + data.length + ' opiniones';
    data.forEach(c => {
      const el = document.createElement('div'); el.className = 'comment-item reveal in';
      el.innerHTML = '<div class="comment-header"><span class="comment-author"></span><div class="review-meta"><span class="rating-stars"></span><span class="tag"></span></div></div><div class="comment-date"></div><div class="comment-text"></div>';
      el.querySelector('.comment-author').textContent = c.user_name;
      el.querySelector('.rating-stars').textContent = stars(c.calificacion);
      el.querySelector('.tag').textContent = c.aspecto;
      el.querySelector('.comment-date').textContent = new Date(c.created_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
      el.querySelector('.comment-text').textContent = c.texto;
      if (user && user.id === c.user_id) {
        const d = document.createElement('button'); d.className = 'btn-delete-comment'; d.textContent = 'Eliminar';
        d.onclick = async () => { if (confirm('¿Eliminar tu comentario?')) { await supabaseClient.from('comentarios').delete().eq('id', c.id); loadReviews(); } };
        el.appendChild(d);
      }
      list.appendChild(el);
    });
  }

  function setUser(u) { user = u; drawForm(); loadReviews(); }
  if (typeof supabaseClient !== 'undefined') {
    supabaseClient.auth.getSession().then(({ data }) => setUser(data.session ? data.session.user : null));
    supabaseClient.auth.onAuthStateChange((_e, s) => { const u = s ? s.user : null; if ((u && u.id) !== (user && user.id)) setUser(u); });
  } else drawForm();
})();