const defLat = 53;
const defLong = -4;
var map = L.map('map').setView([defLat, defLong], 10);

const cannons = JSON.parse(document.getElementById('cannon-data').textContent);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
}).addTo(map);


function makePin({ fill, outline, dot, size }) {
  return L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}">
      <path fill="${fill}" stroke="${outline}" stroke-width="1"
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle fill="${dot}" cx="12" cy="9" r="2.5"/>
    </svg>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [(size / 2), size],
    popupAnchor: [0, -size],
  });
}

// Pin Styles here if u wanna change em 
const normalIcon = makePin({ fill: "#2F4F4F", outline: "#162525", dot: "#162525", size: 30 })
const highlightIcon = makePin({ fill: "#2F4F4F", outline: "#162525", dot: "#DD9206", size: 45 })

var markerMap = {};
cannons.forEach(cannon => {
  if (cannon.lat && cannon.lng) {
    const marker = L.marker([cannon.lat, cannon.lng], { icon: normalIcon })
      .addTo(map)
      .bindPopup(`<a class="Cannon-Hover-Popup" href="/rockcannon/${cannon.slug}/">${cannon.name}</a>`);


    markerMap[cannon.name] = marker;

    marker.on('mouseover', () => {
      document.querySelector(`[data-name="${cannon.name}"]`)?.classList.add('highlighted');
    });

    marker.on('mouseout', () => {
      document.querySelector(`[data-name="${cannon.name}"]`)?.classList.remove('highlighted');
    });

  }
});

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

// Aside stuff
var openIcon = document.getElementById('Arrow-Icon-Menu-Button-Open');
var closeIcon = document.getElementById('Arrow-Icon-Menu-Button-Close');
var aside = document.getElementById('Aside-Map');
var asideButton = document.getElementById('Aside-Button');
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
