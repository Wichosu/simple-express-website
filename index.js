const http = require('http');
const { url } = require('inspector');
const fs = require('fs');

const port = process.env.PORT || 8080;

fs.readFile('./index.html', (err, html) => {
  if (err) {
    throw err;
  }
  http.createServer((req, res) => {
    res.statusCode = 200;
    res.write(html);
    res.end();
  }).listen(port);
})

/*const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.write(index);
  res.end();
});*/



/*server.listen(port, () => {
    console.log('server running');
});*/