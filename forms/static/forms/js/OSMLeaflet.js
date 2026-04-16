map.setView([latitude, longitude], 17)
function centerMap() {
  map.setView([latitude, longitude], 17)
}
var showPosButton = document.getElementById('position').addEventListener('click', centerMap);

const grid = document.getElementById('Imgs-Grid');
const overlay = document.getElementById('overlay');
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
