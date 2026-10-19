const routeCache = new Map();

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const { lat1, lon1, lat2, lon2 } = req.query;

  if (!lat1 || !lon1 || !lat2 || !lon2) {
    return res.status(400).json({ error: 'Parámetros incompletos (lat1, lon1, lat2, lon2 requeridos)' });
  }

  const nLat1 = parseFloat(lat1);
  const nLon1 = parseFloat(lon1);
  const nLat2 = parseFloat(lat2);
  const nLon2 = parseFloat(lon2);

  const cacheKey = `${nLat1.toFixed(3)},${nLon1.toFixed(3)}_${nLat2.toFixed(3)},${nLon2.toFixed(3)}`;
  if (routeCache.has(cacheKey)) {
    return res.status(200).json(routeCache.get(cacheKey));
  }

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${nLon1},${nLat1};${nLon2},${nLat2}?overview=false`;
    const r = await fetch(url, { headers: { 'User-Agent': 'AdjudicacionesVercel/1.0' } });
    if (r.ok) {
      const data = await r.json();
      if (data.routes && data.routes.length > 0) {
        const distKm = Math.round((data.routes[0].distance / 1000) * 10) / 10;
        const minutes = Math.round(data.routes[0].duration / 60);
        const result = { distKm, minutes };
        routeCache.set(cacheKey, result);
        return res.status(200).json(result);
      }
    }
  } catch (e) {
    // fallback below
  }

  // Fallback Haversine road model
  const R = 6371;
  const dLat = (nLat2 - nLat1) * Math.PI / 180;
  const dLon = (nLon2 - nLon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(nLat1 * Math.PI / 180) * Math.cos(nLat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const straightKm = R * c;
  
  let roadFactor = 1.28;
  if (straightKm > 100) roadFactor = 1.25;
  else if (straightKm < 20) roadFactor = 1.34;

  const roadKm = Math.round(straightKm * roadFactor * 10) / 10;
  let avgSpeed = 82;
  if (roadKm > 100) avgSpeed = 96;
  else if (roadKm < 30) avgSpeed = 68;

  const minutes = Math.round((roadKm / avgSpeed) * 60);
  const fallbackResult = { distKm: roadKm, minutes };
  routeCache.set(cacheKey, fallbackResult);

  return res.status(200).json(fallbackResult);
};
