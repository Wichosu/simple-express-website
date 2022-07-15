const http = require('http');
const fs = require('fs');

const port = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  const url = req.url;
  if(url === '/'){
    res.write(fs.readFileSync('index.html'));
  }
  else{
    try{
      res.write(fs.readFileSync(url.slice(1)+'.html'));
    }
    catch{
      try{
        res.write(fs.readFileSync(url.slice(1)));
      }
      catch{
        res.write(fs.readFileSync('404.html'));
      }
    }
  }
  res.end();
});

server.listen(port, () => {
  console.log('connected');
})
