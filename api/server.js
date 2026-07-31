import http from 'http';
import { randomBytes } from 'crypto';
import { writeFileSync, readFileSync, existsSync, mkdirSync, readdirSync, unlinkSync, statSync } from 'fs';

const DIR = '/tmp/photos';
mkdirSync(DIR, { recursive: true });

function cleanup() {
  const cutoff = Date.now() - 7200_000; // 2 hours
  for (const f of readdirSync(DIR)) {
    try { if (statSync(`${DIR}/${f}`).mtimeMs < cutoff) unlinkSync(`${DIR}/${f}`); } catch {}
  }
}

http.createServer((req, res) => {
  const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' };

  if (req.method === 'OPTIONS') { res.writeHead(204, cors); return res.end(); }

  if (req.method === 'POST' && req.url === '/upload') {
    let body = '';
    req.on('data', c => { body += c; });
    req.on('end', () => {
      try {
        const { image } = JSON.parse(body);
        const token = randomBytes(4).toString('hex');
        const data = image.replace(/^data:\w+\/\w+;base64,/, '');
        writeFileSync(`${DIR}/${token}.jpg`, Buffer.from(data, 'base64'));
        cleanup();
        res.writeHead(200, { ...cors, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ url: `/dl/${token}` }));
      } catch {
        res.writeHead(400, cors);
        res.end('Bad request');
      }
    });
    return;
  }

  const dl = req.url?.match(/^\/dl\/([a-f0-9]{8})$/);
  if (req.method === 'GET' && dl) {
    const file = `${DIR}/${dl[1]}.jpg`;
    if (!existsSync(file)) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, {
      'Content-Type': 'image/jpeg',
      'Content-Disposition': 'attachment; filename="greenwichbooth.jpg"',
    });
    return res.end(readFileSync(file));
  }

  res.writeHead(404);
  res.end('Not found');
}).listen(3001, () => console.log('Photo API on :3001'));
