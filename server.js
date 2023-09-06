const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Set the content type for HTML responses
  res.setHeader('Content-Type', 'text/html');

  // Routing logic
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html'; // Default to serving index.html
  }

  const extname = path.extname(filePath);
  let contentType = 'text/html';

  // Set the content type based on file extension
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
  }

  // Serve Login_Registration.js
  if (req.url === '/Login_Registration.js') {
    filePath = './Login_Registration.js';
    contentType = 'text/javascript';
  }

  // Read the file and send the response
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found
        res.writeHead(404);
        res.end('404 - File Not Found');
      } else {
        // Server error
        res.writeHead(500);
        res.end('500 - Internal Server Error');
      }
    } else {
      // Successful response
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
