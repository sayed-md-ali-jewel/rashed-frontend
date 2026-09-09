const { createServer } = require('http');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.avif': 'image/avif',
  '.bmp': 'image/bmp',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4'
};

function tryServeUpload(req, res) {
  if (!req.url || !req.url.startsWith('/uploads/')) return false;

  const urlPath = req.url.split('?')[0];
  const filename = path.basename(urlPath);
  if (!filename || filename.includes('..')) return false;

  const candidateDirs = [
    path.join(process.cwd(), 'public', 'uploads'),
    path.join(process.cwd(), 'public', 'public', 'uploads'),
    path.join(process.cwd(), 'uploads'),
    path.resolve(process.cwd(), '..', 'public', 'uploads'),
    path.resolve(process.cwd(), '..', 'public', 'public', 'uploads'),
    path.resolve(process.cwd(), '..', 'uploads'),
    path.resolve(process.cwd(), '..', 'public_html', 'uploads'),
    path.resolve(process.cwd(), '..', '..', 'public_html', 'uploads')
  ];

  for (const dir of candidateDirs) {
    const filePath = path.join(dir, filename);
    if (fs.existsSync(filePath)) {
      try {
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
          const ext = path.extname(filename).toLowerCase();
          const contentType = MIME_TYPES[ext] || 'application/octet-stream';
          res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': stat.size,
            'Cache-Control': 'public, max-age=31536000, immutable',
            'Accept-Ranges': 'bytes'
          });
          fs.createReadStream(filePath).pipe(res);
          return true;
        }
      } catch {
        // Fall back to Next.js route handler
      }
    }
  }
  return false;
}

app.prepare().then(() => {
  createServer((req, res) => {
    // Attempt direct upload serving
    if (tryServeUpload(req, res)) {
      return;
    }

    const isNextStaticAsset = req.url?.startsWith('/_next/static/');
    const acceptsHtml = req.headers.accept?.includes('text/html');

    if (acceptsHtml && !isNextStaticAsset) {
      res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate');
    }

    handle(req, res);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`Server running on port ${port}`);
  });
}).catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
