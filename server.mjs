import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

const VAULT_DIR = path.join(__dirname, 'public', 'pantry');
const VAULT_FILE = path.join(VAULT_DIR, 'lessons_vault.json');
const FOLDER_FILE = path.join(VAULT_DIR, 'notebooklm_folder.json');

if (!fs.existsSync(VAULT_DIR)) {
  fs.mkdirSync(VAULT_DIR, { recursive: true });
}
if (!fs.existsSync(VAULT_FILE)) {
  fs.writeFileSync(VAULT_FILE, JSON.stringify([], null, 2), 'utf8');
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf'
};

const serveIndexHtml = (res) => {
  let content = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const patchScript = '<script src="/public/webangles_hover_and_notebooklm_patch.js"></script>';
  if (content.includes('</body>')) {
    content = content.replace('</body>', `${patchScript}\n</body>`);
  } else {
    content += patchScript;
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(content);
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  if (req.method === 'GET' && pathname === '/api/vault') {
    try {
      const data = fs.readFileSync(VAULT_FILE, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(data);
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  if (req.method === 'POST' && pathname === '/api/vault') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const item = JSON.parse(body);
        const vault = JSON.parse(fs.readFileSync(VAULT_FILE, 'utf8'));
        vault.push(item);
        fs.writeFileSync(VAULT_FILE, JSON.stringify(vault, null, 2), 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, item }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/folder') {
    try {
      const data = fs.existsSync(FOLDER_FILE) ? fs.readFileSync(FOLDER_FILE, 'utf8') : JSON.stringify({ folder: [] });
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(data);
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  let filePath = pathname === '/' ? path.join(__dirname, 'index.html') : path.join(__dirname, pathname);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    if (filePath.endsWith('index.html') || pathname === '/') {
      serveIndexHtml(res);
    } else {
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    }
  } else {
    serveIndexHtml(res);
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
