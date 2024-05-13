const net = require('node:net');
const fs = require('node:fs/promises');

const server = net.createServer(() => {
  server.on('connection', (socket) => {
    console.log('New connection');

    socket.on('data', async (data) => {
      try {
        socket.pause(); // pause receiving data from client
        const fileHandle = await fs.open(`storage/text.txt`, 'w');
        const fileStream = fileHandle.createWriteStream();

        // Writing to destination file
        if (!fileStream.write(data)) {
          socket.pause();
        }

        fileStream.on('drain', () => {
          socket.resume();
        });

        socket.resume();
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('end', () => {
      console.log('Connection closed');
    });
  });
});

server.listen(5050, '127.0.0.1', () => {
  console.log('Uploader server opened on', server.address());
});
