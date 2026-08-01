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
