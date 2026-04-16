(function() {
  if (window.geodesyReady) return;

  const baseUrl = (document.currentScript && document.currentScript.src)
    ? document.currentScript.src.replace(/[^/]*$/, '')
    : '';

  window.geodesyReady = Promise.all([
    import(baseUrl + 'dms.js'),
    import(baseUrl + 'latlon-ellipsoidal.js'),
    import(baseUrl + 'latlon-ellipsoidal-datum.js'),
    import(baseUrl + 'osgridref.js'),
  ]).then(([DmsModule, LatLonEllipsoidalModule, LatLonEllipsoidalDatumModule, OsGridRefModule]) => {
    window.Dms = DmsModule.default;
    window.LatLonEllipsoidal = LatLonEllipsoidalModule.default;
    window.LatLonEllipsoidal_Datum = LatLonEllipsoidalDatumModule.default;
    window.OsGridRef = OsGridRefModule.default;
  }).catch(err => {
    console.error('Failed to load geodesy modules:', err);
    throw err;
  });
})();
