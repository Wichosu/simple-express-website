const http = require('http');
const fs = require('fs');

const port = process.env.PORT || 8080;


const server = http.createServer((req, res) => {
  if(req.url === '/') {
    const index = fs.readFileSync('index.html');
    res.end(index);
  }
  res.end();
});

server.listen(port, () => {
  console.log('connected');
})
