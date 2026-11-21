const ADMIN_CREDENTIALS = {
  user: 'Nanndoxadm',
  pass: 'nanndox2027'
};

const DEFAULT_SC = [
  { title: 'DJ Nanndox — Perfil Oficial & Todos os Sets', url: 'https://soundcloud.com/nanndox' }
];

const DEFAULT_YT = [
  { title: 'Canal Oficial @djnanndox — Subscreve & Assiste', url: 'https://www.youtube.com/@djnanndox' }
];

const DEFAULT_IG = [
  { title: 'Perfil Oficial @djnanndox — Segue no Instagram', url: 'https://instagram.com/djnanndox' }
];

const DEFAULT_SHOWS = [
  { date: 'TEMPORADA 2027', venue: 'Clubes, Bares & Residências', city: 'Portugal & Europa', status: 'AGENDAMENTO ABERTO' },
  { date: 'VERÃO 2027', venue: 'Sunsets, Beach Clubs & Festivais', city: 'Nacional & Internacional', status: 'SOB CONSULTA' },
  { date: 'ANO TODO 2027', venue: 'Casamentos, Batizados & Eventos Privados', city: 'Com Opção de Aluguer de Som', status: 'RESERVAS ABERTAS' }
];

let scSets = JSON.parse(localStorage.getItem('nanndox_final_sc')) || DEFAULT_SC;
let ytVideos = JSON.parse(localStorage.getItem('nanndox_final_yt')) || DEFAULT_YT;
let igPosts = JSON.parse(localStorage.getItem('nanndox_final_ig')) || DEFAULT_IG;
let shows = JSON.parse(localStorage.getItem('nanndox_final_shows')) || DEFAULT_SHOWS;

function saveState() {
  localStorage.setItem('nanndox_final_sc', JSON.stringify(scSets));
  localStorage.setItem('nanndox_final_yt', JSON.stringify(ytVideos));
  localStorage.setItem('nanndox_final_ig', JSON.stringify(igPosts));
  localStorage.setItem('nanndox_final_shows', JSON.stringify(shows));
}

function renderList(containerId, items, btnLabel, iconClass) {
  const el = document.getElementById(containerId);
  el.innerHTML = '';
  const rowClass = containerId === 'ytLinksContainer' ? 'yt-item' : 'sc-item';

  items.forEach(item => {
    const div = document.createElement('div');
    div.className = rowClass;
    div.innerHTML = `
      <span>${item.title}</span>
      <a href="${item.url}" target="_blank" rel="noopener">${btnLabel} <i class="${iconClass}"></i></a>
    `;
    el.appendChild(div);
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

document.getElementById('bookingForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('clientName').value;
  const location = document.getElementById('eventLocation').value;
  const date = document.getElementById('eventDate').value;
  const pack = document.getElementById('eventPack').value;

  const message = `Olá DJ Nanndox! Gostava de pedir orçamento e disponibilidade para 2027:%0A• *Nome/Evento:* ${name}%0A• *Local:* ${location}%0A• *Data:* ${date}%0A• *Serviço:* ${pack}`;
  window.open(`https://wa.me/351964505531?text=${message}`, '_blank');
});

const adminModal = document.getElementById('adminModal');
document.getElementById('openAdminBtn').addEventListener('click', () => adminModal.classList.add('open'));
document.getElementById('closeAdminBtn').addEventListener('click', () => adminModal.classList.remove('open'));

document.getElementById('adminLoginForm').addEventListener('submit', e => {
  e.preventDefault();
  const u = document.getElementById('adminUser').value.trim();
  const p = document.getElementById('adminPass').value.trim();
  if (u === ADMIN_CREDENTIALS.user && p === ADMIN_CREDENTIALS.pass) {
    document.getElementById('adminLoginView').classList.add('hidden');
    document.getElementById('adminDashboardView').classList.remove('hidden');
  } else {
    alert('Credenciais inválidas.');
  }
});

document.getElementById('logoutAdminBtn').addEventListener('click', () => {
  document.getElementById('adminDashboardView').classList.add('hidden');
  document.getElementById('adminLoginView').classList.remove('hidden');
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

document.getElementById('addScForm').addEventListener('submit', e => {
  e.preventDefault();
  scSets.unshift({
    title: document.getElementById('scTitle').value,
    url: document.getElementById('scLink').value
  });
  saveState();
  renderList('scLinksContainer', scSets, 'OUVIR', 'fa-solid fa-arrow-up-right-from-square');
  e.target.reset();
  alert('Link adicionado à secção SoundCloud!');
});

document.getElementById('addYtForm').addEventListener('submit', e => {
  e.preventDefault();
  ytVideos.unshift({
    title: document.getElementById('ytTitle').value,
    url: document.getElementById('ytLink').value
  });
  saveState();
  renderList('ytLinksContainer', ytVideos, 'VER VÍDEO', 'fa-brands fa-youtube');
  e.target.reset();
  alert('Vídeo adicionado à secção YouTube!');
});

document.getElementById('addIgForm').addEventListener('submit', e => {
  e.preventDefault();
  igPosts.unshift({
    title: document.getElementById('igTitle').value,
    url: document.getElementById('igLink').value
  });
  saveState();
  renderList('igLinksContainer', igPosts, 'VER NO IG', 'fa-brands fa-instagram');
  e.target.reset();
  alert('Publicação adicionada à secção Instagram!');
});

document.getElementById('addShowForm').addEventListener('submit', e => {
  e.preventDefault();
  shows.push({
    date: document.getElementById('showDate').value,
    venue: document.getElementById('showVenue').value,
    city: document.getElementById('showCity').value,
    status: document.getElementById('showStatus').value
  });
  saveState();
  renderShows();
  e.target.reset();
  alert('Data publicada na Agenda 2027!');
});

document.getElementById('exportJsonBtn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({ scSets, ytVideos, igPosts, shows }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'dj-nanndox-backup.json';
  a.click();
});

document.getElementById('mobileToggle').addEventListener('click', () => {
  document.getElementById('navMenu').classList.toggle('show');
});

// Inicializar secções
renderList('scLinksContainer', scSets, 'OUVIR', 'fa-solid fa-arrow-up-right-from-square');
renderList('ytLinksContainer', ytVideos, 'VER VÍDEO', 'fa-brands fa-youtube');
renderList('igLinksContainer', igPosts, 'VER NO IG', 'fa-brands fa-instagram');
renderShows();