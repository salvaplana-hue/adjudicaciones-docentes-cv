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

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`;
    const r = await fetch(url, { headers: { 'User-Agent': 'AdjudicacionesVercel/1.0' } });
    if (r.ok) {
      const data = await r.json();
      if (data.routes && data.routes.length > 0) {
        const distKm = Math.round((data.routes[0].distance / 1000) * 10) / 10;
        const minutes = Math.round(data.routes[0].duration / 60);
        return res.status(200).json({ distKm, minutes });
      }
    }
  } catch (e) {
    // fallback below
  }

  // Fallback Haversine road model
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const straightKm = R * c;
  
  let roadFactor = 1.28;
  if (straightKm > 100) roadFactor = 1.24;
  else if (straightKm < 25) roadFactor = 1.33;

  const roadKm = Math.round(straightKm * roadFactor * 10) / 10;
  const avgSpeed = roadKm > 80 ? 95 : 75;
  const minutes = Math.round((roadKm / avgSpeed) * 60);

  return res.status(200).json({ distKm: roadKm, minutes });
}
