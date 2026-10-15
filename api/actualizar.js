const GVA_PAGE_URL = 'https://ceice.gva.es/es/web/rrhh-educacion/convocatoria-y-peticion-telematica';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    // 1. Fetch official GVA continuous appointments page
    const pageRes = await fetch(GVA_PAGE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!pageRes.ok) {
      return res.status(500).json({ success: false, error: `Error conectando con la web de GVA: ${pageRes.status}` });
    }

    const html = await pageRes.text();

    // 2. Locate latest _pue_prov.pdf link
    const match = html.match(/href=["']([^"']*?_pue_prov\.pdf[^"']*)["']/i);
    if (!match) {
      return res.status(404).json({ success: false, error: 'No se encontró enlace a listado provisional en la web de la Conselleria.' });
    }

    let pdfUrl = match[1];
    if (pdfUrl.startsWith('/')) {
      pdfUrl = 'https://ceice.gva.es' + pdfUrl;
    }

    const filename = pdfUrl.split('?')[0].split('/').pop();

    // 3. Download PDF binary into memory buffer
    const pdfRes = await fetch(pdfUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    if (!pdfRes.ok) {
      return res.status(500).json({ success: false, error: `Error descargando PDF desde GVA: ${pdfRes.status}` });
    }

    const arrayBuffer = await pdfRes.arrayBuffer();
    const base64Pdf = Buffer.from(arrayBuffer).toString('base64');

    // 4. Return to client (both url and base64 for direct browser rendering)
    return res.status(200).json({
      success: true,
      filename: filename,
      pdfUrl: pdfUrl,
      size: arrayBuffer.byteLength,
      pdfBase64: base64Pdf
    });

  } catch (err) {
    console.error('Serverless GVA Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
