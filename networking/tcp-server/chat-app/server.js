const net = require('node:net');
const { chatAppUtils } = require('./utils');

const clients = [];

(() => {
  try {
    // Create Server
    const server = net.createServer();

    // On connections
    server.on('connection', (socket) => {
      clients.push(socket);

      socket.on('data', (data) => {
        clients.forEach((client) => client.write(data));
      });
    });

    server.on('error', (err) => {
      console.log('\nSomething went wrong\n');
      throw err;
    });

    // Listen server
    server.listen(chatAppUtils.port, chatAppUtils.host, () => {
      console.log('Server running on', server.address());
    });
  } catch (error) {
    console.log(error);
  }
})();
