console.log(" lat: " + latitude)
console.log("long: " + longitude)
console.log("grid: " + grid)
console.log("east: " + easting)
console.log("nrth: " + northing)

var map = L.map('map').setView([latitude, longitude], 17);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

var marker = L.marker([latitude, longitude]).addTo(map);

function centerMap() {
  map.setView([latitude, longitude], 17)
}
var showPosButton = document.getElementById('position').addEventListener('click', centerMap);


