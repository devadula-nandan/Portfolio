const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  // Normalize URL path to prevent path traversal vulnerability
  let safePath = req.url.split('?')[0];

  // Intercept API routes and proxy to the deployed Vercel instance to bypass local browser CORS policy
  if (safePath === '/api/health' && req.method === 'GET') {
    fetch('https://portfolio-five-theta-ftdhmviqc3.vercel.app/api/health')
      .then(proxyRes => proxyRes.json())
      .then(data => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      })
      .catch(err => {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Proxy unreachable', details: err.message }));
      });
    return;
  }

  if (safePath === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      fetch('https://portfolio-five-theta-ftdhmviqc3.vercel.app/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body
      })
        .then(proxyRes => {
          return proxyRes.json().then(data => ({ status: proxyRes.status, data }));
        })
        .then(({ status, data }) => {
          res.writeHead(status, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(data));
        })
        .catch(err => {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Proxy unreachable', details: err.message }));
        });
    });
    return;
  }

  if (safePath === '/') {
    safePath = '/index.html';
  }

  const filePath = path.join(__dirname, safePath);
  
  // Basic security check to ensure we only serve files within this workspace
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 File Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Internal Server Error: ${error.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Portfolio local server is running at http://localhost:${PORT}/`);
  console.log('Press Ctrl+C to stop the server.');
});
