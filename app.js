// Credenciais do Painel Admin (Nanndoxadm)
const ADMIN_CREDENTIALS = {
  user: 'Nanndoxadm',
  pass: 'nanndox2027'
};

// Links Externos de Música / Sets / Bootlegs (Sem faixas fictícias)
const DEFAULT_TRACKS = [
  {
    id: 1,
    title: 'DJ Nanndox — Sets, Remixes & Free Downloads Oficiais',
    category: 'set',
    genre: 'SoundCloud Oficial • Streaming & Download Direto',
    url: 'https://soundcloud.com/nanndox'
  }
];

const DEFAULT_SC_SETS = [
  { title: 'DJ Nanndox — Perfil Oficial & Todos os Sets', url: 'https://soundcloud.com/nanndox' },
  { title: 'Fire Warm Up Vol. 1 — Afro & Tech House Session', url: 'https://soundcloud.com/nanndox' }
];

const DEFAULT_YT_VIDEOS = [
  { title: 'Canal Oficial @djnanndox — Subscreve & Assiste', url: 'https://www.youtube.com/@djnanndox' },
  { title: 'Fire Warm Up Vol. 1 — Live DJ Set', url: 'https://www.youtube.com/@djnanndox' }
];

const DEFAULT_IG_POSTS = [
  { title: 'Perfil Oficial @djnanndox — Segue no Instagram', url: 'https://instagram.com/djnanndox' },
  { title: 'Reels & Bastidores de Cabine — @djnanndox', url: 'https://instagram.com/djnanndox' }
];

const DEFAULT_SHOWS = [
  { date: 'TEMPORADA 2027', venue: 'Clubes, Bares & Residências', city: 'Portugal & Europa', status: 'AGENDAMENTO ABERTO' },
  { date: 'VERÃO 2027', venue: 'Sunsets, Beach Clubs & Festivais', city: 'Nacional & Internacional', status: 'SOB CONSULTA' },
  { date: 'ANO TODO 2027', venue: 'Casamentos, Batizados & Eventos Privados', city: 'Com Opção de Aluguer de Som', status: 'RESERVAS ABERTAS' }
];

// Estado da Aplicação
let tracks = JSON.parse(localStorage.getItem('nanndox_ext_tracks')) || DEFAULT_TRACKS;
let scSets = JSON.parse(localStorage.getItem('nanndox_sc')) || DEFAULT_SC_SETS;
let ytVideos = JSON.parse(localStorage.getItem('nanndox_yt')) || DEFAULT_YT_VIDEOS;
let igPosts = JSON.parse(localStorage.getItem('nanndox_ig')) || DEFAULT_IG_POSTS;
let shows = JSON.parse(localStorage.getItem('nanndox_shows_2027')) || DEFAULT_SHOWS;

function saveState() {
  localStorage.setItem('nanndox_ext_tracks', JSON.stringify(tracks));
  localStorage.setItem('nanndox_sc', JSON.stringify(scSets));
  localStorage.setItem('nanndox_yt', JSON.stringify(ytVideos));
  localStorage.setItem('nanndox_ig', JSON.stringify(igPosts));
  localStorage.setItem('nanndox_shows_2027', JSON.stringify(shows));
}

// =========================================================
// RENDERIZAÇÃO DE LINKS EXTERNOS DE MÚSICA / FREE DOWNLOAD
// =========================================================
const tracksGrid = document.getElementById('tracksGrid');

function renderTracks(filter = 'all') {
  tracksGrid.innerHTML = '';
  const filtered = filter === 'all' ? tracks : tracks.filter(t => t.category === filter);

  if (filtered.length === 0) {
    tracksGrid.innerHTML = '<p style="color:#888;">Ainda sem links publicados nesta categoria. Adiciona pelo painel ADMIN.</p>';
    return;
  }

  filtered.forEach(track => {
    const row = document.createElement('div');
    row.className = 'track-row';
    row.innerHTML = `
      <div class="track-meta">
        <span class="track-badge">${track.category}</span>
        <h4>${track.title}</h4>
        <p>${track.genre}</p>
      </div>
      <a href="${track.url}" target="_blank" rel="noopener" class="dl-btn">
        <i class="fa-solid fa-arrow-up-right-from-square"></i> OUVIR / FREE DOWNLOAD
      </a>
    `;
    tracksGrid.appendChild(row);
  });
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTracks(btn.dataset.filter);
  });
});

// =========================================================
// SOUNDCLOUD, YOUTUBE, INSTAGRAM & AGENDAMENTO 2027 RENDER
// =========================================================
function renderSoundCloud() {
  const container = document.getElementById('scLinksContainer');
  container.innerHTML = '';
  scSets.forEach(item => {
    const div = document.createElement('div');
    div.className = 'sc-item';
    div.innerHTML = `
      <span>${item.title}</span>
      <a href="${item.url}" target="_blank" rel="noopener">OUVIR <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
    `;
    container.appendChild(div);
  });
}

function renderYouTube() {
  const container = document.getElementById('ytLinksContainer');
  container.innerHTML = '';
  ytVideos.forEach(item => {
    const div = document.createElement('div');
    div.className = 'yt-item';
    div.innerHTML = `
      <span>${item.title}</span>
      <a href="${item.url}" target="_blank" rel="noopener">VER VÍDEO <i class="fa-brands fa-youtube"></i></a>
    `;
    container.appendChild(div);
  });
}

function renderInstagram() {
  const container = document.getElementById('igLinksContainer');
  container.innerHTML = '';
  igPosts.forEach(item => {
    const div = document.createElement('div');
    div.className = 'sc-item';
    div.innerHTML = `
      <span>${item.title}</span>
      <a href="${item.url}" target="_blank" rel="noopener">VER NO IG <i class="fa-brands fa-instagram"></i></a>
    `;
    container.appendChild(div);
  });
}

function renderShows() {
  const list = document.getElementById('showsList');
  list.innerHTML = '';
  shows.forEach(show => {
    const div = document.createElement('div');
    div.className = 'show-item';
    div.innerHTML = `
      <span class="show-date">${show.date}</span>
      <strong>${show.venue}</strong>
      <span>${show.city}</span>
      <span class="show-status">${show.status}</span>
    `;
    list.appendChild(div);
  });
}

// =========================================================
// FORMULÁRIO DE BOOKING DIRETO PARA WHATSAPP
// =========================================================
document.getElementById('bookingForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('clientName').value;
  const location = document.getElementById('eventLocation').value;
  const date = document.getElementById('eventDate').value;
  const pack = document.getElementById('eventPack').value;

  const message = `Olá DJ Nanndox! Gostava de pedir orçamento e disponibilidade para 2027:%0A• *Nome/Evento:* ${name}%0A• *Local:* ${location}%0A• *Data:* ${date}%0A• *Serviço:* ${pack}`;
  window.open(`https://wa.me/351964505531?text=${message}`, '_blank');
});

// =========================================================
// PAINEL ADMIN (LOGIN + LINKS EXTERNOS, REDES E AGENDA)
// =========================================================
const adminModal = document.getElementById('adminModal');
const openAdminBtn = document.getElementById('openAdminBtn');
const closeAdminBtn = document.getElementById('closeAdminBtn');
const adminLoginView = document.getElementById('adminLoginView');
const adminDashboardView = document.getElementById('adminDashboardView');

openAdminBtn.addEventListener('click', () => adminModal.classList.add('open'));
closeAdminBtn.addEventListener('click', () => adminModal.classList.remove('open'));

document.getElementById('adminLoginForm').addEventListener('submit', e => {
  e.preventDefault();
  const u = document.getElementById('adminUser').value.trim();
  const p = document.getElementById('adminPass').value.trim();
  if (u === ADMIN_CREDENTIALS.user && p === ADMIN_CREDENTIALS.pass) {
    adminLoginView.classList.add('hidden');
    adminDashboardView.classList.remove('hidden');
  } else {
    alert('Credenciais inválidas.');
  }
});

document.getElementById('logoutAdminBtn').addEventListener('click', () => {
  adminDashboardView.classList.add('hidden');
  adminLoginView.classList.remove('hidden');
  adminModal.classList.remove('open');
});

document.querySelectorAll('.adm-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.adm-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.adm-panel').forEach(p => p.classList.add('hidden'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.target).classList.remove('hidden');
  });
});

document.getElementById('addTrackForm').addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('trackTitle').value;
  const category = document.getElementById('trackCategory').value;
  const genre = document.getElementById('trackGenre').value;
  const url = document.getElementById('trackUrl').value;

  tracks.unshift({ id: Date.now(), title, category, genre, url });
  saveState();
  renderTracks();
  e.target.reset();
  alert('Link externo publicado com sucesso!');
});

document.getElementById('addScForm').addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('scTitle').value;
  const url = document.getElementById('scLink').value;
  scSets.unshift({ title, url });
  saveState();
  renderSoundCloud();
  e.target.reset();
  alert('Set adicionado à secção SoundCloud!');
});

document.getElementById('addYtForm').addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('ytTitle').value;
  const url = document.getElementById('ytLink').value;
  ytVideos.unshift({ title, url });
  saveState();
  renderYouTube();
  e.target.reset();
  alert('Vídeo adicionado à secção YouTube!');
});

document.getElementById('addIgForm').addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('igTitle').value;
  const url = document.getElementById('igLink').value;
  igPosts.unshift({ title, url });
  saveState();
  renderInstagram();
  e.target.reset();
  alert('Publicação adicionada à secção Instagram!');
});

document.getElementById('addShowForm').addEventListener('submit', e => {
  e.preventDefault();
  const date = document.getElementById('showDate').value;
  const venue = document.getElementById('showVenue').value;
  const city = document.getElementById('showCity').value;
  const status = document.getElementById('showStatus').value;
  shows.push({ date, venue, city, status });
  saveState();
  renderShows();
  e.target.reset();
  alert('Entrada publicada na Agenda 2027!');
});

document.getElementById('exportJsonBtn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({ tracks, scSets, ytVideos, igPosts, shows }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'dj-nanndox-backup.json';
  a.click();
});

document.getElementById('mobileToggle').addEventListener('click', () => {
  document.getElementById('navMenu').classList.toggle('show');
});

// Inicializar Página
renderTracks();
renderSoundCloud();
renderYouTube();
renderInstagram();
renderShows();