// Локальний запуск: node server.mjs → http://localhost:3000
import { createServer } from 'node:http';
import { readFile, readdir } from 'node:fs/promises';

const PORT = process.env.PORT || 3000;
const TYPES = { html: 'text/html', js: 'text/javascript', json: 'application/json', webmanifest: 'application/manifest+json', png: 'image/png' };
const root = new URL('public/', import.meta.url);
const files = new Set(await readdir(root));

createServer(async (req, res) => {
  const name = req.url.split('?')[0].slice(1) || 'index.html';
  if (!files.has(name)) { res.writeHead(404); return res.end('Not found'); }
  res.writeHead(200, { 'content-type': `${TYPES[name.split('.').pop()]}; charset=utf-8`, 'cache-control': 'no-store' });
  res.end(await readFile(new URL(name, root)));
}).listen(PORT, () => console.log(`Відкрийте http://localhost:${PORT}`));
