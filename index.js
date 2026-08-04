import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');
const port = Number(process.env.PORT || 3000);

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
};

function resolveAsset(requestUrl) {
  const rawPath = decodeURIComponent(new URL(requestUrl, 'http://localhost').pathname);
  const safePath = path.normalize(rawPath).replace(/^(\.\.(\/|\\|$))+/, '');
  const candidate = path.join(distDir, safePath);
  if (!candidate.startsWith(distDir)) return null;
  return candidate;
}

async function serve(res, filePath) {
  try {
    const data = await readFile(filePath);
    const type = MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'content-type': type });
    res.end(data);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}

const server = http.createServer(async (req, res) => {
  const url = req.url || '/';
  const assetPath = resolveAsset(url);
  if (assetPath) {
    try {
      if ((await stat(assetPath)).isFile()) return serve(res, assetPath);
    } catch {}
  }

  return serve(res, path.join(distDir, 'index.html'));
});

server.listen(port, '0.0.0.0', () => {
  console.log(`greenwichbooth listening on http://0.0.0.0:${port}`);
});
