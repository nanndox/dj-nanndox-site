// =========================================================
// CONFIGURAÇÃO SUPABASE (Opcional — para armazenamento na nuvem)
// =========================================================
const SUPABASE_URL = '';
const SUPABASE_ANON_KEY = '';
const supabaseClient = (SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase)
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Credenciais do Painel Admin (Nanndoxadm)
const ADMIN_CREDENTIALS = {
  user: 'Nanndoxadm',
  pass: 'nanndox2027'
};

// Dados iniciais
const DEFAULT_TRACKS = [
  {
    id: 1,
    title: 'Fire Warm Up Vol. 1 (Club Edit)',
    category: 'set',
    genre: 'Tech House & Afro House • 125 BPM',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 2,
    title: 'Lisboa Nightlife (DJ Nanndox Afro Bootleg)',
    category: 'remix',
    genre: 'Afro-Latin • 124 BPM',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: 3,
    title: 'Midnight Groove (Original Beat)',
    category: 'beat',
    genre: 'Tech House • 126 BPM',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
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

const DEFAULT_SHOWS = [
  { date: 'TEMPORADA 2027', venue: 'Clubes, Bares & Residências', city: 'Portugal & Europa', status: 'AGENDAMENTO ABERTO' },
  { date: 'VERÃO 2027', venue: 'Sunsets, Beach Clubs & Festivais', city: 'Nacional & Internacional', status: 'DATAS DISPONÍVEIS' },
  { date: 'ANO TODO 2027', venue: 'Eventos Privados, Casamentos & Festas Exclusivas', city: 'Sob Consulta', status: 'RESERVAS ABERTAS' }
];

// Estado da Aplicação
let tracks = JSON.parse(localStorage.getItem('nanndox_tracks')) || DEFAULT_TRACKS;
let scSets = JSON.parse(localStorage.getItem('nanndox_sc')) || DEFAULT_SC_SETS;
let ytVideos = JSON.parse(localStorage.getItem('nanndox_yt')) || DEFAULT_YT_VIDEOS;
let shows = JSON.parse(localStorage.getItem('nanndox_shows_2027')) || DEFAULT_SHOWS;

function saveState() {
  localStorage.setItem('nanndox_tracks', JSON.stringify(tracks));
  localStorage.setItem('nanndox_sc', JSON.stringify(scSets));
  localStorage.setItem('nanndox_yt', JSON.stringify(ytVideos));
  localStorage.setItem('nanndox_shows_2027', JSON.stringify(shows));
}

// =========================================================
// RENDERIZAÇÃO DE FAIXAS & AUDIO PLAYER
// =========================================================
const tracksGrid = document.getElementById('tracksGrid');
const audioEngine = document.getElementById('audioEngine');
const playPauseMain = document.getElementById('playPauseMain');
const currentTrackTitle = document.getElementById('currentTrackTitle');
const currentTrackMeta = document.getElementById('currentTrackMeta');
const seekBar = document.getElementById('seekBar');
const currentTimeEl = document.getElementById('currentTime');
const durationTimeEl = document.getElementById('durationTime');

function formatTime(sec) {
  if (isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function renderTracks(filter = 'all') {
  tracksGrid.innerHTML = '';
  const filtered = filter === 'all' ? tracks : tracks.filter(t => t.category === filter);

  if (filtered.length === 0) {
    tracksGrid.innerHTML = '<p style="color:#888;">Nenhuma faixa nesta categoria ainda.</p>';
    return;
  }

  filtered.forEach(track => {
    const row = document.createElement('div');
    row.className = 'track-row';
    row.innerHTML = `
      <div class="track-left">
        <button class="track-play-btn" data-id="${track.id}" title="Ouvir Prévia">
          <i class="fa-solid fa-play"></i>
        </button>
        <div class="track-meta">
          <span class="track-badge">${track.category}</span>
          <h4>${track.title}</h4>
          <p>${track.genre}</p>
        </div>
      </div>
      <a href="${track.url}" download="${track.title}.mp3" target="_blank" rel="noopener" class="dl-btn">
        <i class="fa-solid fa-download"></i> FREE DOWNLOAD
      </a>
    `;
    tracksGrid.appendChild(row);
  });

  document.querySelectorAll('.track-play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = tracks.find(t => t.id == btn.dataset.id);
      if (selected) playTrack(selected);
    });
  });
}

function playTrack(track) {
  audioEngine.src = track.url;
  currentTrackTitle.textContent = track.title;
  currentTrackMeta.textContent = track.genre;
  audioEngine.play();
  playPauseMain.innerHTML = '<i class="fa-solid fa-pause"></i>';
}

playPauseMain.addEventListener('click', () => {
  if (!audioEngine.src) return;
  if (audioEngine.paused) {
    audioEngine.play();
    playPauseMain.innerHTML = '<i class="fa-solid fa-pause"></i>';
  } else {
    audioEngine.pause();
    playPauseMain.innerHTML = '<i class="fa-solid fa-play"></i>';
  }
});

audioEngine.addEventListener('timeupdate', () => {
  if (!audioEngine.duration) return;
  seekBar.value = (audioEngine.currentTime / audioEngine.duration) * 100;
  currentTimeEl.textContent = formatTime(audioEngine.currentTime);
  durationTimeEl.textContent = formatTime(audioEngine.duration);
});

seekBar.addEventListener('input', () => {
  if (!audioEngine.duration) return;
  audioEngine.currentTime = (seekBar.value / 100) * audioEngine.duration;
});

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTracks(btn.dataset.filter);
  });
});

// =========================================================
// SOUNDCLOUD, YOUTUBE & AGENDAMENTO 2027 RENDER
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

  const message = `Olá DJ Nanndox! Gostava de verificar disponibilidade para booking em 2027:%0A• *Nome/Clube:* ${name}%0A• *Local:* ${location}%0A• *Data:* ${date}%0A• *Formato:* ${pack}`;
  window.open(`https://wa.me/351964505531?text=${message}`, '_blank');
});

// =========================================================
// PAINEL ADMIN (LOGIN + UPLOAD DE FAIXAS, SOUNDCLOUD, YOUTUBE E AGENDA)
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

document.getElementById('addTrackForm').addEventListener('submit', async e => {
  e.preventDefault();
  const title = document.getElementById('trackTitle').value;
  const category = document.getElementById('trackCategory').value;
  const genre = document.getElementById('trackGenre').value;
  const fileInput = document.getElementById('trackFile').files[0];
  let finalUrl = document.getElementById('trackUrl').value;

  if (fileInput) {
    if (supabaseClient) {
      const fileName = `${Date.now()}_${fileInput.name.replace(/\s+/g, '_')}`;
      const { error } = await supabaseClient.storage.from('nanndox-audio').upload(fileName, fileInput);
      if (!error) {
        const { data } = supabaseClient.storage.from('nanndox-audio').getPublicUrl(fileName);
        finalUrl = data.publicUrl;
      }
    } else {
      finalUrl = URL.createObjectURL(fileInput);
    }
  }

  if (!finalUrl) {
    alert('Seleciona um ficheiro MP3/WAV ou cola um link direto.');
    return;
  }

  tracks.unshift({ id: Date.now(), title, category, genre, url: finalUrl });
  saveState();
  renderTracks();
  e.target.reset();
  alert('Faixa publicada com sucesso para Free Download!');
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
  const blob = new Blob([JSON.stringify({ tracks, scSets, ytVideos, shows }, null, 2)], { type: 'application/json' });
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
renderShows();