function mountCarta(box, key, cat, name) {
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = n => '$' + Number(n).toLocaleString('es-CO');
  const secs = CARTAS[key] || CARTAS_BASE[cat] || [];
  const emoji = k => (k === 'bebida' ? '🥤' : '🍽️');
  const art = (img, tag) => '<div class="pg-art">' + (img ? '<img src="' + esc(img) + '" alt="" onerror="this.remove()">' : '') + (tag ? '<span class="pg-tag">' + tag + '</span>' : '') + '</div>';

  // Armar páginas: portada + una por sección (máx. 5 platos) + cierre
  const pages = [{ type: 'cover', label: 'Portada' }];
  secs.forEach(s => {
    for (let i = 0; i < s.items.length; i += 5) pages.push({ type: 'sec', s, items: s.items.slice(i, i + 5), cont: i > 0, label: s.t, first: i === 0 });
  });
  pages.push({ type: 'end', label: 'Fin' });

  const html = p => {
    if (p.type === 'cover') {
      const names = secs.map(s => '<li>' + emoji(s.k) + ' ' + esc(s.t) + '</li>').join('');
      return art(secs[0] && secs[0].img, '') + '<div class="pg-txt"><h3>' + esc(name) + '</h3><p class="lead">Nuestra carta</p><ul class="chips">' + names + '</ul><p class="hint">Toca el lado derecho para abrir →</p></div>';
    }
    if (p.type === 'end') {
      const last = secs[secs.length - 1];
      return art(last && last.img, '') + '<div class="pg-txt"><h3>Buen provecho</h3><p class="lead">¿Ya lo probaste? Cuéntanos qué tal estuvo la comida y la atención.</p><a class="cta" href="#opiniones">Dejar mi opinión</a></div>';
    }
    const li = p.items.map(i => '<li><div><b>' + esc(i[0]) + '</b><p>' + esc(i[1]) + '</p></div><span class="price">' + money(i[2]) + '</span></li>').join('');
    return art(p.s.img, emoji(p.s.k) + ' ' + esc(p.s.t)) + '<div class="pg-txt"><h3>' + esc(p.s.t) + (p.cont ? ' <small style="font-size:.9rem;opacity:.7">(cont.)</small>' : '') + '</h3><ul class="items">' + li + '</ul></div>';
  };

  box.innerHTML = '<div class="carta-tabs"></div><div class="carta-wrap"><button type="button" class="carta-nav" id="cPrev" aria-label="Página anterior">‹</button><div class="book"><div class="sheet" id="cSheet"></div></div><button type="button" class="carta-nav" id="cNext" aria-label="Página siguiente">›</button></div><p class="carta-count" id="cCount"></p>';
  const sheet = box.querySelector('#cSheet'), tabs = box.querySelector('.carta-tabs'), prev = box.querySelector('#cPrev'), next = box.querySelector('#cNext'), count = box.querySelector('#cCount');
  let cur = 0, busy = false;

  // Pestañas: portada + cada sección
  const tabPages = pages.map((p, i) => ({ p, i })).filter(x => x.p.type === 'cover' || (x.p.type === 'sec' && x.p.first));
  tabPages.forEach(x => {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = x.p.type === 'cover' ? 'Portada' : (emoji(x.p.s.k) + ' ' + x.p.s.t);
    b.onclick = e => { e.stopPropagation(); flip(x.i); }; x.btn = b; tabs.appendChild(b);
  });

  function paint() {
    sheet.innerHTML = html(pages[cur]);
    prev.disabled = cur === 0; next.disabled = cur === pages.length - 1;
    count.textContent = 'Página ' + (cur + 1) + ' de ' + pages.length;
    const act = tabPages.filter(x => x.i <= cur).pop();
    tabPages.forEach(x => x.btn.classList.toggle('on', x === act));
  }
  // Giro de página: gira hasta de canto, cambia contenido y termina de abrir
  function flip(to) {
    if (busy || to < 0 || to >= pages.length || to === cur) return;
    busy = true; const dir = to > cur ? 1 : -1;
    sheet.style.transition = 'transform .32s ease-in'; sheet.style.transform = 'rotateY(' + (-90 * dir) + 'deg)';
    setTimeout(() => {
      cur = to; paint();
      sheet.style.transition = 'none'; sheet.style.transform = 'rotateY(' + (90 * dir) + 'deg)'; void sheet.offsetWidth;
      sheet.style.transition = 'transform .32s ease-out'; sheet.style.transform = 'rotateY(0)';
      setTimeout(() => { busy = false; }, 330);
    }, 320);
  }
  prev.onclick = e => { e.stopPropagation(); flip(cur - 1); };
  next.onclick = e => { e.stopPropagation(); flip(cur + 1); };
  // Clic en la mitad derecha = siguiente, izquierda = anterior
  box.querySelector('.book').addEventListener('click', e => {
    if (e.target.closest('a')) return;
    const r = e.currentTarget.getBoundingClientRect(); flip(cur + (e.clientX > r.left + r.width / 2 ? 1 : -1));
  });
  box.tabIndex = 0;
  box.addEventListener('keydown', e => { if (e.key === 'ArrowRight') flip(cur + 1); if (e.key === 'ArrowLeft') flip(cur - 1); });
  let sx = null;
  sheet.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  sheet.addEventListener('touchend', e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 50) { e.preventDefault(); flip(cur + (dx < 0 ? 1 : -1)); } });
  paint();
}