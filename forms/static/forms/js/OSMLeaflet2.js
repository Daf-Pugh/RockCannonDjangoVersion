const cannons = JSON.parse(document.getElementById('cannon-data').textContent);

const defLat = 53;
const defLong = -4;
var map = L.map('map', { maxZoom: 19 }).setView([defLat, defLong], 10);
const markers = L.markerClusterGroup({
  maxClusterRadius: 60,
  DisableClusteringAtZoom: 14,
});
console.log("test")
map.addLayer(markers);
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
}).addTo(map);

let isClustered = true;

function setClusterRadius(radius) {
  markers.options.maxClusterRadius = radius;
  markers.refreshClusters();
}

function createCannonListItem(cannon, marker) {
  const a = document.createElement('a');
  a.href = `/${cannon.slug}/`;
  a.textContent = cannon.name;
  const li = document.createElement('li');
  li.classList.add('Cannon-Listing');
  li.appendChild(a);
  if (marker) {
    li.addEventListener('mouseover', () => marker.setIcon(highlightIcon));
    li.addEventListener('mouseout', () => marker.setIcon(normalIcon));
  }
  return li;
}

function addMarkers(cannonsData) {
  cannonsData.forEach(cannon => {
    if (!cannon.lat || !cannon.lng) return;
    L.marker([cannon.lat, cannon.lng], { icon: normalIcon })
      .addTo(markers)
      .bindPopup(`<a class="Cannon-Hover-Popup" href="/${cannon.slug}/">${cannon.name}</a>`);
  });
}


function makePin({ fill, outline, dot, size }) {
  return L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}">
      <path fill="${fill}" stroke="${outline}" stroke-width="0"
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle fill="${dot}" cx="12" cy="9" r="2.5"/>
    </svg>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [(size / 2), size],
    popupAnchor: [0, -size],
  });
}

// ==========================================
// Marker Stuff
// ==========================================
// Pin Styles here if u wanna change em 
const normalIcon = makePin({ fill: "#387854", outline: "#2F4F4F", dot: "#DD9206", size: 30 })
const filteredIcon = makePin({ fill: "#38785466", outline: "#2F4F4F66", dot: "#DD920666", size: 30 })
const highlightIcon = makePin({ fill: "#DD9206", outline: "#2F4F4F", dot: "#2F4F4F", size: 45 })
var markerMap = {};
function updateMarkerIcons(filteredCannons) {
  const filteredSlugs = new Set(filteredCannons.map(c => c.slug));

  cannonItems.forEach(({ cannon, marker }) => {
    if (!marker) return;
    if (filteredSlugs.has(cannon.slug)) {
      marker.setIcon(normalIcon);
    } else {
      marker.setIcon(filteredIcon);
    }
  });
}
// ==========================================
// Aside Button Stuff
// ==========================================
var asideButton = document.getElementById('Aside-Button');
if (asideButton) {
  var aside = document.getElementById('Aside-Map');
  var openIcon = document.getElementById('Arrow-Icon-Menu-Button-Open');
  var closeIcon = document.getElementById('Arrow-Icon-Menu-Button-Close');
  function swapIcon() {
    if (window.getComputedStyle(openIcon).display === 'inline') {
      openIcon.style.display = 'none';
      closeIcon.style.display = 'inline';
      aside.style.display = 'block';
      asideButton.style.right = 'var(--Aside-Width)';
    } else {
      openIcon.style.display = 'inline';
      closeIcon.style.display = 'none';
      aside.style.display = 'none';
      asideButton.style.right = '0px';
    }
  }
  asideButton.addEventListener('click', swapIcon);
}
//==========================================
// Individual View Stuff
//==========================================
const grid = document.getElementById('Imgs-Grid');
const overlay = document.getElementById('overlay');

if (grid && overlay) {
  const overlayImg = overlay.querySelector('img');
  const overlayCaption = document.getElementById('overlay-caption');
  const overlayCredit = document.getElementById('overlay-credit');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const closeBtn = document.getElementById('close');
  const images = [...grid.querySelectorAll('img')];
  let currentIndex = 0;

  function showImage(index) {
    const img = images[index];
    overlayImg.src = img.src;
    overlayCaption.textContent = img.alt;
    overlayCredit.textContent = img.dataset.credit || '';
    currentIndex = index;
    prevBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
    nextBtn.style.visibility = index === images.length - 1 ? 'hidden' : 'visible';
  }
  grid.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
      overlay.style.display = 'flex';
      showImage(images.indexOf(e.target));
    }
  });
  prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
  nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.style.display = 'none';
  });
  closeBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
  });

  document.addEventListener('keydown', (e) => {
    if (overlay.style.display === 'none') return;
    if (e.key === 'ArrowLeft' && currentIndex > 0) showImage(currentIndex - 1);
    if (e.key === 'ArrowRight' && currentIndex < images.length - 1) showImage(currentIndex + 1);
    if (e.key === 'Escape') overlay.style.display = 'none';
  });
}

if (typeof latitude !== 'undefined' && typeof longitude !== 'undefined') {
  map.setView([latitude, longitude], 18);
  document.getElementById('position')?.addEventListener('click', () => {
    map.setView([latitude, longitude], 18);
  });
}

// ==========================================
// Aside Stuff
// ==========================================

const ulOfCannons = document.getElementById('cannon-list');
const allBtn = document.getElementById('all');
const privLandBtn = document.getElementById('private_land');
const channelBtn = document.getElementById('has_channels');
const someChannelBtn = document.getElementById('has_some_channels');
const noChannelBtn = document.getElementById('no_channels');
const slider = document.getElementById('hole-count-slider');
const display = document.getElementById('hole-count-value');
const searchInput = document.getElementById('cannon-search');
const maxHoles = Math.max(...cannons.map(c => c.hole_count || 0));

if (((ulOfCannons && searchInput) && (allBtn && privLandBtn)) && ((channelBtn && someChannelBtn) && (noChannelBtn && (slider && display)))) {

  slider.max = maxHoles;

  const cannonItems = cannons.map(cannon => {
    let marker = null;

    if (cannon.lat && cannon.lng) {
      marker = L.marker([cannon.lat, cannon.lng], { icon: normalIcon })
        .addTo(markers)
        .bindPopup(`<a class="Cannon-Hover-Popup" href="/${cannon.slug}/">${cannon.name}</a>`);
    }

    const li = createCannonListItem(cannon, marker);

    if (marker) {
      marker.on('mouseover', () => li.classList.add('highlighted'));
      marker.on('mouseout', () => li.classList.remove('highlighted'));
    }

    return { cannon, li, marker };
  });

  function renderList() {
    const query = searchInput?.value.toLowerCase() ?? '';
    const activeFilter = document.querySelector('.Filter-Btn.active')?.id ?? 'all';
    const minHoles = parseInt(slider?.value) || 0;

    ulOfCannons.innerHTML = '';

    let filteredCount = 0;

    cannonItems.forEach(({ cannon, li, marker }) => {
      const matchesSearch = cannon.name.toLowerCase().includes(query);
      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'private_land' && cannon.is_private) ||
        (activeFilter === 'has_channels' && cannon.has_channels === 'yes') ||
        (activeFilter === 'has_some_channels' && cannon.has_channels === 'some') ||
        (activeFilter === 'no_channels' && cannon.has_channels === 'no');
      const matchesHoles = (cannon.hole_count || 0) >= minHoles;
      const matches = matchesSearch && matchesFilter && matchesHoles;
      if (matches) {
        ulOfCannons.appendChild(li);
        filteredCount++;
      }
      if (marker) {
        marker.setIcon(matches ? normalIcon : filteredIcon);
      }
    });
    markers.options.maxClusterRadius = filteredCount < cannonItems.length ? -1 : 40;
    markers.clearLayers();
    cannonItems.forEach(({ cannon, marker }) => {
      if (marker) markers.addLayer(marker);
    });;
  }
  console.log(cannons.map(c => ({ name: c.name, has_channels: c.has_channels, is_private: c.is_private, hole_count: c.hole_count })));

  slider?.addEventListener('input', () => {
    display.textContent = slider.value;
    renderList();
  });

  searchInput?.addEventListener('input', () => renderList());

  [allBtn, privLandBtn, channelBtn, someChannelBtn, noChannelBtn].forEach(btn => {
    btn?.addEventListener('click', () => {
      [allBtn, privLandBtn, channelBtn, someChannelBtn, noChannelBtn].forEach(b => b?.classList.remove('active'));
      btn.classList.add('active');
      renderList();
    });
  });

  renderList();
} else {
  addMarkers(cannons);
}
