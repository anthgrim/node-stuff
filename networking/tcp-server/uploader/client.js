const net = require('node:net');
const fs = require('node:fs/promises');

const socket = net.createConnection(
  {
    port: 5050,
    host: '127.0.0.1',
  },
  async () => {
    try {
      const filePath = './origin.txt';
      const fileHandle = await fs.open(filePath, 'r');
      const fileStream = fileHandle.createReadStream();

      // Reading from source file
      fileStream.on('data', (data) => {
        if (!socket.write(data)) {
          fileStream.pause();
        }
      });

      socket.on('drain', () => {
        fileStream.resume();
      });

      fileStream.on('end', () => {
        console.log('File was sent. Closing connection');
        fileHandle.close();
        socket.end();
      });
    } catch (error) {
      console.log(error);
    }
  },
);
