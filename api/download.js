export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing url parameter');

  // Validate scheme — block javascript:/data: injection
  let parsed;
  try { parsed = new URL(url); } catch { return res.status(400).send('Invalid url'); }
  if (parsed.protocol !== 'https:') return res.status(400).send('Only https urls are allowed');

  try {
    const img = await fetch(url);
    if (!img.ok) return res.status(img.status).send('Failed to fetch image');

    const blob = await img.arrayBuffer();
    const filename = (parsed.pathname.split('/').pop() || 'poster.jpg').replace(/[^\w.\-]/g, '_') || 'poster.jpg';

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-cache');
    res.send(Buffer.from(blob));
  } catch (e) {
    res.status(500).send('Download failed');
  }
}
