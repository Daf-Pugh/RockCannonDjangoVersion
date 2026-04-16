const geodesyReady = window.geodesyReady || Promise.resolve();

function onReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}

geodesyReady.then(() => {
  onReady(() => {
    const mapDiv = document.createElement('div');
    mapDiv.id = 'admin-map';
    mapDiv.style.height = '400px';
    mapDiv.style.marginBottom = '1rem';

    const latField = document.querySelector('.field-latitude');
    if (!latField) return;  // exit if position inline isn't on this page
    latField.parentNode.insertBefore(mapDiv, latField);

    const latInput = document.getElementById('id_position-0-latitude');
    const lngInput = document.getElementById('id_position-0-longitude');
    const osGridInput = document.getElementById('id_position-0-os_grid');
    const osEastingInput = document.getElementById('id_position-0-os_easting');
    const osNorthingInput = document.getElementById('id_position-0-os_northing');

    const initLat = parseFloat(latInput.value) || 52.4813;
    const initLng = parseFloat(lngInput.value) || -3.6602;

    const map = L.map('admin-map').setView([initLat, initLng], 10);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(map);

    let marker = L.marker([initLat, initLng], { draggable: true }).addTo(map);

    function updateFields(lat, lng) {
      latInput.value = lat.toFixed(6);
      lngInput.value = lng.toFixed(6);

      try {
        const p = new LatLonEllipsoidal_Datum(lat, lng).convertDatum(LatLonEllipsoidal_Datum.datums.OSGB36);
        const gridRef = OsGridRef.latLonToOsGrid(p);
        osGridInput.value = gridRef.toString().substring(0, 2);
        osEastingInput.value = Math.round(gridRef.easting);
        osNorthingInput.value = Math.round(gridRef.northing);
      } catch (e) {
        console.log('OS grid error:', e.message);
      }
    }

    marker.on('dragend', (e) => {
      const { lat, lng } = e.target.getLatLng();
      updateFields(lat, lng);
    });

    map.on('click', (e) => {
      marker.setLatLng(e.latlng);
      updateFields(e.latlng.lat, e.latlng.lng);
    });

    [latInput, lngInput].forEach(input => {
      input.addEventListener('change', () => {
        const lat = parseFloat(latInput.value);
        const lng = parseFloat(lngInput.value);
        if (!isNaN(lat) && !isNaN(lng)) {
          marker.setLatLng([lat, lng]);
          map.setView([lat, lng]);
          updateFields(lat, lng);
        }
      });
    });

    [osGridInput, osEastingInput, osNorthingInput].forEach(input => {
      input.addEventListener('change', () => {
        const grid = osGridInput.value;
        const easting = parseInt(osEastingInput.value);
        const northing = parseInt(osNorthingInput.value);
        if (grid && !isNaN(easting) && !isNaN(northing)) {
          try {
            const gridRef = new OsGridRef(easting, northing);
            const latlon = OsGridRef.osGridToLatLon(gridRef);
            latInput.value = latlon.lat.toFixed(6);
            lngInput.value = latlon.lon.toFixed(6);
            marker.setLatLng([latlon.lat, latlon.lon]);
            map.setView([latlon.lat, latlon.lon]);
          } catch (e) {
            console.log('Invalid OS grid ref');
          }
        }
      });
    });
  });
}).catch(err => {
  console.error('Failed to load geodesy modules:', err);
});
