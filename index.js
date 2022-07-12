const http = require('http');
const { url } = require('inspector');
const EventEmitter = require('events');
const fs = require('fs');

const port = process.env.PORT || 8080;
const aboutEvent = new EventEmitter();
//const about = document.getElementById('about');
//console.log(about);

let path = './index.html';

fs.readFile(path, (err, data) => {
  if (err) {
    throw err;
  }
  const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.write(data);
    res.end();
  })
  server.listen(port);
});
