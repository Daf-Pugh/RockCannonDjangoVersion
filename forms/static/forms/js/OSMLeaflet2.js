console.log("test");
console.log(JSON.parse(document.getElementById('cannon-data').textContent));
const defLat = 52.48130
const defLong = -3.66016;

var map = L.map('map').setView([defLat, defLong], 8);

const cannons = JSON.parse(document.getElementById('cannon-data').textContent);
console.log(typeof cannons);
console.log(cannons);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

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
var marker = L.marker([defLat, defLong]).addTo(map);
cannons.forEach(cannon => {
  if (cannon.lat && cannon.lng) {
    L.marker([cannon.lat, cannon.lng])
      .addTo(map)
      .bindPopup(cannon.name);
  }
});
