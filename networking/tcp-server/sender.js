const net = require('node:net');

const socket = net.createConnection({
  host: '127.0.0.1',
  port: '3099',
});

socket.write('Incoming message from sender', (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Message sent successfully');
  }
});

socket.end(() => {
  console.log('Ending connection');
});

socket.on('connect', (hadError) => {
  if (hadError) {
    console.log('Error connecting socket');
  } else {
    console.log('Socket connected successfully');
  }
});

socket.on('close', (hadError) => {
  if (hadError) {
    console.log('Error closing socket');
  } else {
    console.log('Socket has been closed successfully');
  }
});
