(async () => {
  // const module = await import('/static/forms/js/geodesy/osgridref.js');
  // const { default: OsGridRef } = await import('https://cdn.jsdelivr.net/npm/geodesy@2/osgridref.js');
  const { default: OsGridRef, LatLon } = await import('/static/forms/js/geodesy/osgridref.js');

  // console.log(module);

  const latField = document.getElementById('id_position-0-latitude');
  const lngField = document.getElementById('id_position-0-longitude');
  const gridField = document.getElementById('id_position-0-grid_ref');

  function toOSGridRef(lat, lng) {
    const cords = new LatLon(lat, lng);
    const grid = cords.toOsGrid();
    return grid.toString();
  }
  function toLatLng(gridRef) {
    const grid = OsGridRef.parse(gridRef);
    const latlon = grid.toLatLon();
    return { lat: latlon.lat, lng: latlon.lon };
  }

  function updateGridRef() {

    const lat = parseFloat(latField.value);
    const lng = parseFloat(lngField.value);
    if (!lat || !lng) return;

    const gridRef = toOSGridRef(lat, lng);
    gridField.value = gridRef;
  }
  function updateLatLng() {
    const gridRef = gridField.value.trim();
    if (!gridRef) return;
    try {
      const { lat, lng } = toLatLng(gridRef);
      latField.value = lat.toFixed(6);
      lngField.value = lng.toFixed(6);
    } catch (e) {
      console.log('invalid grid ref');
    }
  }

  gridField?.addEventListener('change', updateLatLng);
  latField?.addEventListener('change', updateGridRef);
  lngField?.addEventListener('change', updateGridRef);


  const mapEl = document.getElementById('admin-map');
  if (!mapEl) return;

  const startLat = parseFloat(latField?.value) || 52.5;
  const startLng = parseFloat(lngField?.value) || -4;
  const startZoom = latField?.value ? 14 : 7;

  const map = L.map('admin-map').setView([startLat, startLng], startZoom);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap &copy; CARTO'
  }).addTo(map);

  const marker = L.marker([startLat, startLng], { draggable: true })
    .addTo(map);

  if (!latField?.value) marker.setOpacity(0);

  function setPosition(lat, lng) {
    latField.value = lat.toFixed(6);
    lngField.value = lng.toFixed(6);
    gridField.value = toOSGridRef(lat, lng);
    marker.setLatLng([lat, lng]);
    marker.setOpacity(1);
  }

  map.on('click', (e) => {
    setPosition(e.latlng.lat, e.latlng.lng);
  });

  marker.on('dragend', (e) => {
    const { lat, lng } = e.target.getLatLng();
    setPosition(lat, lng);
  });
})();
