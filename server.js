const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const port = Number(process.env.PORT || 3000);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml'
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const routeMap = {
    '/': 'index.html',
    '/login': 'pages/login.html',
    '/register': 'pages/register.html',
    '/catalog': 'pages/catalog.html',
    '/car': 'pages/car.html',
    '/profile': 'pages/profile.html',
    '/checkout': 'pages/checkout.html',
    '/about': 'pages/about.html',
    '/support': 'pages/support.html'
  };
  const mapped = routeMap[decoded] || decoded;
  const normalized = path.normalize(mapped).replace(/^([/\\])+/, '');
  return path.join(root, normalized || 'index.html');
}

const server = http.createServer((req, res) => {
  const filePath = safePath(req.url || '/');
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    const target = !statError && stats.isDirectory() ? path.join(filePath, 'index.html') : filePath;
    fs.readFile(target, (readError, content) => {
      if (readError) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not found');
        return;
      }

      res.writeHead(200, { 'Content-Type': types[path.extname(target).toLowerCase()] || 'application/octet-stream' });
      res.end(content);
    });
  });
});

server.listen(port, () => {
  console.log(`AutoMarket static site: http://localhost:${port}`);
});
