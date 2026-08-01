import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: { sizeLimit: '10mb' },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { image } = req.body;
    const buf = Buffer.from(image.replace(/^data:\w+\/\w+;base64,/, ''), 'base64');
    const result = await put(`booth/${Date.now()}.jpg`, buf, {
      access: 'private',
      contentType: 'image/jpeg',
      addRandomSuffix: true,
    });
    // downloadUrl is a signed public URL for private stores; fallback to url
    res.json({ url: result.downloadUrl || result.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err?.message || 'Upload failed' });
  }
}
