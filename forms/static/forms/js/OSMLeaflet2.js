const defLat = 53;
const defLong = -4;
const cannons = JSON.parse(document.getElementById('cannon-data').textContent);
var map = L.map('map').setView([defLat, defLong], 10);
// const markers = L.layerGroup();
const markers = L.markerClusterGroup();

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
}).addTo(map);

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
const highlightIcon = makePin({ fill: "#387854", outline: "#2F4F4F", dot: "#f310a7", size: 45 })
var markerMap = {};
cannons.forEach(cannon => {
  if (cannon.lat && cannon.lng) {
    const marker = L.marker([cannon.lat, cannon.lng], { icon: normalIcon })
      .addTo(markers)
      .bindPopup(`<a class="Cannon-Hover-Popup" href="/${cannon.slug}/">${cannon.name}</a>`);


    markerMap[cannon.name] = marker;

    marker.on('mouseover', () => {
      document.querySelector(`[data-name="${cannon.name}"]`)?.classList.add('highlighted');
    });

    marker.on('mouseout', () => {
      document.querySelector(`[data-name="${cannon.name}"]`)?.classList.remove('highlighted');
    });

  }
});



// ==========================================
// Aside Stuff
// ==========================================

map.addLayer(markers);
// ====================================================================================
// Old highlighting on aside hover Stuff DELETE AT SOME POINT
// ====================================================================================
document.querySelectorAll('.cannons li').forEach(li => {
  const name = li.dataset.name;

  li.addEventListener('mouseover', () => {
    if (markerMap[name]) {

      markerMap[name].setIcon(highlightIcon);
    }
  });

  li.addEventListener('mouseout', () => {
    if (markerMap[name]) {
      markerMap[name].setIcon(normalIcon);
    }
  });
});

// ==========================================
// Aside Button Stuff
// ==========================================
var asideButton = document.getElementById('Aside-Button');
if (asideButton) {

  // Aside stuff
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
// ==========================================
// Individual View Stuff
// ==========================================
const grid = document.getElementById('Imgs-Grid');
const overlay = document.getElementById('overlay');
if (grid && overlay) {
  const overlayImg = overlay.querySelector('img');

  grid.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
      overlayImg.src = e.target.src;
      overlay.style.display = 'flex';
    }
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.style.display = 'none';
  });
  document.getElementById('close').addEventListener('click', () => {
    overlay.style.display = 'none';
  });
}

// Centering
if (typeof latitude !== 'undefined' && typeof longitude !== 'undefined') {
  map.setView([latitude, longitude], 15);
  document.getElementById('position')?.addEventListener('click', () => {
    map.setView([latitude, longitude], 15);
  });
}
