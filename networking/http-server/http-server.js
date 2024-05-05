const http = require('node:http');

const port = 4080;
const host = '127.0.0.1'; //loopback address

const server = http.createServer((req, res) => {
  const data = { message: 'Hello World!' };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Connection', 'close');
  res.statusCode = 200;
  res.end(JSON.stringify(data));
});

server.listen(port, host, () => {
  console.log('Server running on', server.address());
});
