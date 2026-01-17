const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4200;
const DIST_PATH = path.join(__dirname, 'dist/tablero-frontend');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let filePath = path.join(DIST_PATH, req.url);
  
  // Default to index.html for root and SPA routes
  if (req.url === '/') {
    filePath = path.join(DIST_PATH, 'index.html');
  }
  
  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'text/plain';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // For SPA, serve index.html on 404
      fs.readFile(path.join(DIST_PATH, 'index.html'), (err2, data2) => {
        if (err2) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data2);
      });
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`✓ Frontend running at http://localhost:${PORT}`);
  console.log(`✓ Backend at http://localhost:3000`);
});
