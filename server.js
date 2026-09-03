const { createServer } = require('http');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
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
