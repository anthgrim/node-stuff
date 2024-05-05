const net = require('node:net');

const server = net.createServer((socket) => {
  socket.on('data', (buffer) => {
    console.log(buffer.toString('utf-8'));
  });
});

server.listen(3099, '127.0.0.1', () => {
  console.log('Opened server on', server.address());
});
