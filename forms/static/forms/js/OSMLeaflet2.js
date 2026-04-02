console.log("test");
console.log(JSON.parse(document.getElementById('cannon-data').textContent));
const defLat = 52.48130
const defLong = -3.66016;

var map = L.map('map').setView([defLat, defLong], 8);

const cannons = JSON.parse(document.getElementById('cannon-data').textContent);
console.log(typeof cannons);
console.log(cannons);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
}).addTo(map);

const normalIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
        <path fill="#2f4f4f" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    </svg>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const highlightIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
        <path fill="#DD3006" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    </svg>`,
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});


var markerMap = {};
cannons.forEach(cannon => {
  if (cannon.lat && cannon.lng) {
    const marker = L.marker([cannon.lat, cannon.lng], { icon: normalIcon })
      .addTo(map)
      .bindPopup(cannon.name);

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
