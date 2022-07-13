const http = require('http');
const fs = require('fs');

const port = process.env.PORT || 8080;

const index = fs.readFileSync('index.html');
const about = fs.readFileSync('about.html');
const contact = fs.readFileSync('contact-me.html');
const notFound = fs.readFileSync('404.html');
const style = fs.readFileSync('style.css');

const server = http.createServer((req, res) => {
  const url = req.url;
  switch (url) {
    case '/':
      res.write(index);
      break;
    case '/about':
      res.write(about);
      break;
    case '/contact':
      res.write(contact);
      break;
    default:
      res.write(notFound);
      break;
  }
  res.end();
});

server.listen(port, () => {
  console.log('connected');
})
