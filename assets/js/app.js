/* === NORVIA — APP.JS === */

const BASE = (() => {
  const parts = window.location.pathname.split('/').filter(Boolean);
  if (window.location.hostname.includes('github.io') && parts.length > 0) {
    return '/' + parts[0];
  }
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && parts.length > 0) {
    return '/' + parts[0];
  }
  return '';
})();

let allArticles = [];
let activeFilter = 'all';
let searchQuery = '';

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  initNav();
  loadArticles();
  initSearch();
  initFilters();
  initModal();
  initContactForm();
  initAreaCards();
});

// === NAV ===
function initNav() {
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');

  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  window.addEventListener('scroll', () => {
    const nav = document.getElementById('nav');
    nav.style.background = window.scrollY > 40
      ? 'rgba(10,10,11,0.97)'
      : 'rgba(10,10,11,0.85)';
  });
}

// === LOAD ARTICLES ===
async function loadArticles() {
  try {
    const res = await fetch(`${BASE}/articulos/index.json`);
    if (!res.ok) throw new Error('No se pudo cargar el índice');
    allArticles = await res.json();
    allArticles.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    renderLatest();
    renderArticulos();
    renderAreaCounts();
  } catch (err) {
    document.getElementById('latestCard').innerHTML =
      '<div class="latest-card-loader">No se pudieron cargar los artículos.</div>';
    document.getElementById('articulosGrid').innerHTML =
      '<p class="loading-msg">No se pudieron cargar los artículos.</p>';
  }
}

// === LATEST ARTICLE ===
function renderLatest() {
  if (!allArticles.length) return;
  const art = allArticles[0];
  const card = document.getElementById('latestCard');
  card.innerHTML = `
    <div class="latest-card-inner">
      <div class="latest-card-body">
        <div>
          <div class="latest-card-meta">
            <span class="tag">${art.categoria}</span>
            <span class="latest-date">${formatDate(art.fecha)}</span>
          </div>
          <h2 class="latest-title">${art.titulo}</h2>
          <p class="latest-resumen">${art.resumen}</p>
        </div>
        <div class="latest-cta">Leer artículo</div>
      </div>
      <div class="latest-card-deco">
        <div class="latest-deco-inner">
          <svg viewBox="0 0 100 120" fill="none" stroke="currentColor" stroke-width="0.8">
            <rect x="10" y="5" width="80" height="110" rx="2"/>
            <line x1="22" y1="28" x2="78" y2="28"/>
            <line x1="22" y1="40" x2="78" y2="40"/>
            <line x1="22" y1="52" x2="78" y2="52"/>
            <line x1="22" y1="64" x2="60" y2="64"/>
            <line x1="22" y1="82" x2="78" y2="82"/>
            <line x1="22" y1="94" x2="55" y2="94"/>
          </svg>
        </div>
      </div>
    </div>
  `;
  card.addEventListener('click', () => openArticle(art));
}

// === RENDER ARTICLES GRID ===
function renderArticulos() {
  const grid = document.getElementById('articulosGrid');
  const noResults = document.getElementById('noResults');

  const filtered = allArticles.filter(art => {
    const matchFilter = activeFilter === 'all' || art.categoria === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      art.titulo.toLowerCase().includes(q) ||
      art.resumen.toLowerCase().includes(q) ||
      art.categoria.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  if (!filtered.length) {
    grid.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }
  noResults.style.display = 'none';

  grid.innerHTML = filtered.map(art => `
    <article class="art-card" data-file="${art.archivo}">
      <div class="art-card-top">
        <span class="tag">${art.categoria}</span>
        <span class="art-card-date">${formatDate(art.fecha)}</span>
      </div>
      <h3 class="art-card-title">${art.titulo}</h3>
      <p class="art-card-resumen">${art.resumen}</p>
      <div class="art-card-footer">
        <span class="art-card-author">${art.autor}</span>
        <span class="art-card-link">Leer →</span>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.art-card').forEach((card, i) => {
    card.addEventListener('click', () => openArticle(filtered[i]));
  });
}

// === AREA COUNTS ===
function renderAreaCounts() {
  document.querySelectorAll('.area-count').forEach(el => {
    const cat = el.dataset.cat;
    const count = allArticles.filter(a => a.categoria === cat).length;
    el.textContent = `${count} artículo${count !== 1 ? 's' : ''}`;
  });
}

// === AREA CARDS CLICK ===
function initAreaCards() {
  document.querySelectorAll('.area-card').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.dataset.cat;
      document.getElementById('articulos').scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        setFilter(cat);
      }, 500);
    });
  });
}

// === SEARCH ===
function initSearch() {
  const input = document.getElementById('searchInput');
  const clearBtn = document.getElementById('searchClear');

  input.addEventListener('input', () => {
    searchQuery = input.value.trim();
    clearBtn.classList.toggle('visible', searchQuery.length > 0);
    renderArticulos();
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    searchQuery = '';
    clearBtn.classList.remove('visible');
    renderArticulos();
    input.focus();
  });
}

// === FILTERS ===
function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
  });
}

function setFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  renderArticulos();
}

// === MODAL ===
function initModal() {
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

async function openArticle(art) {
  const overlay = document.getElementById('modalOverlay');
  const content = document.getElementById('modalContent');

  content.innerHTML = '<p style="color:var(--text-muted);padding:20px 0">Cargando…</p>';
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  try {
    const url = `${window.location.origin}${BASE}/articulos/${art.archivo}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error();
    const raw = await res.text();
    const body = stripFrontmatter(raw);
    const html = marked.parse(body);

    content.innerHTML = `
      <div class="art-modal-tag">
        <span class="tag">${art.categoria}</span>
      </div>
      <h1>${art.titulo}</h1>
      <p class="modal-meta">Por ${art.autor} · ${formatDate(art.fecha)}</p>
      ${html}
    `;
  } catch {
    content.innerHTML = '<p style="color:var(--text-muted)">No se pudo cargar el artículo.</p>';
  }
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function stripFrontmatter(text) {
  if (!text.startsWith('---')) return text;
  const end = text.indexOf('---', 3);
  return end !== -1 ? text.slice(end + 3).trim() : text;
}

// === CONTACT FORM ===
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    btn.textContent = 'Enviando…';
    btn.disabled = true;

    try {
      const data = new FormData(form);
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        form.reset();
        document.getElementById('formOk').style.display = 'block';
        btn.textContent = 'Enviado ✓';
      } else {
        btn.textContent = 'Error al enviar';
        btn.disabled = false;
      }
    } catch {
      btn.textContent = 'Error al enviar';
      btn.disabled = false;
    }
  });
}

// === UTILS ===
function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-');
  const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
}
