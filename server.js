const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const WORKSPACE_DIR = __dirname;
const HTML_FILE = path.join(WORKSPACE_DIR, 'app_adjudicaciones.html');
const GVA_PAGE_URL = 'https://ceice.gva.es/es/web/rrhh-educacion/convocatoria-y-peticion-telematica';

// Pre-cached coordinates for Valencian municipalities (lat, lon)
const TOWN_COORDS = {
  "carlet": [39.2252, -0.5202],
  "alginet": [39.2614, -0.4705],
  "alzira": [39.1506, -0.4358],
  "algemesi": [39.1895, -0.4436],
  "algemesí": [39.1895, -0.4436],
  "benetusser": [39.4243, -0.3995],
  "benetússer": [39.4243, -0.3995],
  "valencia": [39.4699, -0.3763],
  "valència": [39.4699, -0.3763],
  "torrent": [39.4357, -0.4655],
  "xirivella": [39.4656, -0.4277],
  "mislata": [39.4754, -0.4184],
  "quart de poblet": [39.4827, -0.4431],
  "manises": [39.4925, -0.4578],
  "paterna": [39.5029, -0.4414],
  "burjassot": [39.5097, -0.4132],
  "pucol": [39.6166, -0.3015],
  "puçol": [39.6166, -0.3015],
  "sagunt": [39.6796, -0.2785],
  "la pobla de farnals": [39.5593, -0.3256],
  "pobla de farnals": [39.5593, -0.3256],
  "gandia": [38.9671, -0.1804],
  "cullera": [39.1645, -0.2541],
  "sueca": [39.2025, -0.3113],
  "xativa": [38.9886, -0.5230],
  "xàtiva": [38.9886, -0.5230],
  "ontinyent": [38.8221, -0.6074],
  "alcoi": [38.7052, -0.4743],
  "alcoy": [38.7052, -0.4743],
  "benidorm": [38.5411, -0.1225],
  "altea": [38.6015, -0.0526],
  "denia": [38.8408, 0.1057],
  "dénia": [38.8408, 0.1057],
  "xabia": [38.7894, 0.1661],
  "xàbia": [38.7894, 0.1661],
  "javea": [38.7894, 0.1661],
  "alacant": [38.3452, -0.4810],
  "alicante": [38.3452, -0.4810],
  "sant vicent del raspeig": [38.3990, -0.5245],
  "elx": [38.2669, -0.6983],
  "elche": [38.2669, -0.6983],
  "elda": [38.4779, -0.7937],
  "petrer": [38.4842, -0.7712],
  "orihuela": [38.0827, -0.9497],
  "torrevieja": [37.9787, -0.6822],
  "castello de la plana": [39.9864, -0.0513],
  "castelló de la plana": [39.9864, -0.0513],
  "castellon": [39.9864, -0.0513],
  "castellón": [39.9864, -0.0513],
  "vila-real": [39.9377, -0.1011],
  "villarreal": [39.9377, -0.1011],
  "borriana": [39.8893, -0.0844],
  "burriana": [39.8893, -0.0844],
  "vinaros": [40.4728, 0.4682],
  "vinaròs": [40.4728, 0.4682],
  "benicarlo": [40.4194, 0.4269],
  "benicarló": [40.4194, 0.4269],
  "vall d alba": [40.1783, -0.0351],
  "vall d'alba": [40.1783, -0.0351],
  "torreblanca": [40.1983, 0.2173],
  "betera": [39.5925, -0.4589],
  "bétera": [39.5925, -0.4589],
  "oliva": [38.9202, -0.1186],
  "calp": [38.6447, 0.0445],
  "calpe": [38.6447, 0.0445],
  "crevillent": [38.2491, -0.8089],
  "novelda": [38.3844, -0.7686],
  "aspe": [38.3458, -0.7694],
  "cheste": [39.4939, -0.6836],
  "chiva": [39.4719, -0.7189],
  "bunol": [39.4197, -0.7908],
  "buñol": [39.4197, -0.7908],
  "requena": [39.4883, -1.1006],
  "utiel": [39.5672, -1.2056],
  "alboraia": [39.5019, -0.3514],
  "alboraya": [39.5019, -0.3514],
  "picanya": [39.4358, -0.4347],
  "paiporta": [39.4283, -0.4178],
  "sedavi": [39.4242, -0.3853],
  "sedaví": [39.4242, -0.3853],
  "alfafar": [39.4217, -0.3908],
  "massamagrell": [39.5703, -0.3325],
  "moncada": [39.5447, -0.3942],
  "montcada": [39.5447, -0.3942],
  "silla": [39.3622, -0.4114],
  "almussafes": [39.2925, -0.4147],
  "benifaio": [39.2847, -0.4267],
  "benifaió": [39.2847, -0.4267],
  "guadassuar": [39.1861, -0.4789],
  "l'alcudia": [39.1958, -0.5056],
  "alcudia": [39.1958, -0.5056],
  "canals": [38.9619, -0.5847],
  "alberic": [39.1172, -0.5235],
  "tavernes de la valldigna": [39.0717, -0.2661],
  "la nucia": [38.6142, -0.1264],
  "la vila joiosa": [38.5081, -0.2319],
  "villajoyosa": [38.5081, -0.2319],
  "monover": [38.4319, -0.8389],
  "monóver": [38.4319, -0.8389],
  "benejuzar": [38.0772, -0.8394],
  "benejúzar": [38.0772, -0.8394]
};

// Route cache to avoid repeated network calls
const ROUTE_CACHE = new Map();

// Helper: Download latest PDF from GVA
async function downloadLatestPdf() {
  console.log('[GVA Sync] Comprobando última convocatoria en:', GVA_PAGE_URL);
  const res = await fetch(GVA_PAGE_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  if (!res.ok) {
    throw new Error(`Error HTTP al consultar GVA: ${res.status} ${res.statusText}`);
  }

  const html = await res.text();
  const match = html.match(/href=["']([^"']*?_pue_prov\.pdf[^"']*)["']/i);
  if (!match) {
    throw new Error('No se encontró ningún enlace a puesto provisional (*_pue_prov.pdf) en la web de la Conselleria.');
  }

  let pdfUrl = match[1];
  if (pdfUrl.startsWith('/')) {
    pdfUrl = 'https://ceice.gva.es' + pdfUrl;
  }

  const filename = path.basename(pdfUrl.split('?')[0]);
  const destPath = path.join(WORKSPACE_DIR, filename);

  console.log(`[GVA Sync] Descargando ${filename} desde ${pdfUrl}...`);
  const pdfRes = await fetch(pdfUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });

  if (!pdfRes.ok) {
    throw new Error(`Error al descargar el PDF: ${pdfRes.status}`);
  }

  const arrayBuffer = await pdfRes.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
  console.log(`[GVA Sync] ¡Guardado con éxito en ${destPath} (${arrayBuffer.byteLength} bytes)!`);

  return {
    filename,
    pdfUrl,
    size: arrayBuffer.byteLength,
    localPath: destPath
  };
}

// Helper: Calculate OSRM route with caching
async function getRoute(lon1, lat1, lon2, lat2) {
  const cacheKey = `${lon1.toFixed(3)},${lat1.toFixed(3)}-${lon2.toFixed(3)},${lat2.toFixed(3)}`;
  if (ROUTE_CACHE.has(cacheKey)) {
    return ROUTE_CACHE.get(cacheKey);
  }

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`;
    const res = await fetch(url, { headers: { 'User-Agent': 'AntigravityApp/1.0' } });
    if (res.ok) {
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const distKm = Math.round((data.routes[0].distance / 1000) * 10) / 10;
        const minutes = Math.round(data.routes[0].duration / 60);
        const result = { distKm, minutes };
        ROUTE_CACHE.set(cacheKey, result);
        return result;
      }
    }
  } catch (e) {
    console.warn('[OSRM Warn]', e.message);
  }

  // Fallback Haversine road model
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const roadKm = Math.round(R * c * 1.25 * 10) / 10;
  const speed = roadKm > 80 ? 95 : 75;
  const minutes = Math.round((roadKm / speed) * 60);
  return { distKm: roadKm, minutes };
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);

  // Route: /api/actualizar
  if (parsedUrl.pathname === '/api/actualizar') {
    try {
      const result = await downloadLatestPdf();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        success: true,
        message: 'PDF descargado con éxito desde la web de la Conselleria',
        data: result
      }));
    } catch (err) {
      console.error('[GVA Sync Error]', err.message);
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        success: false,
        error: err.message
      }));
    }
    return;
  }

  // Route: /api/route (proxy routing)
  if (parsedUrl.pathname === '/api/route') {
    const lat1 = parseFloat(parsedUrl.searchParams.get('lat1'));
    const lon1 = parseFloat(parsedUrl.searchParams.get('lon1'));
    const lat2 = parseFloat(parsedUrl.searchParams.get('lat2'));
    const lon2 = parseFloat(parsedUrl.searchParams.get('lon2'));

    if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Coordenadas inválidas' }));
      return;
    }

    const route = await getRoute(lon1, lat1, lon2, lat2);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(route));
    return;
  }

  // Route: /api/pdf/:filename
  if (parsedUrl.pathname.startsWith('/api/pdf/')) {
    const requestedFile = decodeURIComponent(parsedUrl.pathname.replace('/api/pdf/', ''));
    const safePath = path.join(WORKSPACE_DIR, path.basename(requestedFile));
    if (fs.existsSync(safePath)) {
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${path.basename(safePath)}"`
      });
      fs.createReadStream(safePath).pipe(res);
      return;
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('PDF no encontrado');
      return;
    }
  }

  // Route: / or /app_adjudicaciones.html or /index.html
  if (parsedUrl.pathname === '/' || parsedUrl.pathname === '/app_adjudicaciones.html' || parsedUrl.pathname === '/index.html') {
    if (fs.existsSync(HTML_FILE)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(HTML_FILE).pipe(res);
      return;
    }
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Ruta no encontrada');
});

server.listen(PORT, () => {
  console.log(`[Servidor Adjudicaciones] Activo en http://localhost:${PORT}`);
  console.log(`[Servidor Adjudicaciones] Carpeta de trabajo: ${WORKSPACE_DIR}`);
});
