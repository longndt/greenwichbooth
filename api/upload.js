import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: { sizeLimit: '10mb' },
  },
};

const DATA_URL_PREFIX = 'data:image/jpeg;base64,';
const MAX_BYTES = 10 * 1024 * 1024;

// ponytail: same-origin gate + strict data-URL validation. NOT a true rate limiter
// (serverless instances share no state). For real rate limiting add Upstash Redis
// or Vercel Edge Config — https://vercel.com/docs/edge-config
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // Reject cross-origin / direct API abuse. Browser fetch on POST always sends an
  // Origin header, so requiring it (and matching the serving host) blocks raw curl
  // scripts while keeping the app's own requests working. Override the allowed host
  // via APP_ORIGIN_HOST if you ever serve the API from a different domain.
  const origin = req.headers.origin || req.headers.referer || '';
  const allowedHost = process.env.APP_ORIGIN_HOST || req.headers.host;
  if (!origin || !allowedHost) return res.status(403).json({ error: 'Forbidden' });
  try { if (new URL(origin).host !== allowedHost) return res.status(403).json({ error: 'Forbidden origin' }); }
  catch { return res.status(403).json({ error: 'Bad origin' }); }

  try {
    const { image } = req.body || {};
    if (typeof image !== 'string' || !image.startsWith(DATA_URL_PREFIX)) {
      return res.status(400).json({ error: 'Invalid image' });
    }
    const buf = Buffer.from(image.slice(DATA_URL_PREFIX.length), 'base64');
    if (buf.length === 0 || buf.length > MAX_BYTES) {
      return res.status(413).json({ error: 'Image too large or empty' });
    }
    const { url } = await put(`booth/${Date.now()}.jpg`, buf, {
      access: 'public',
      contentType: 'image/jpeg',
      addRandomSuffix: true,
    });
    res.json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err?.message || 'Upload failed' });
  }
}
