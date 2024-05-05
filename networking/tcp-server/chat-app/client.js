const net = require('node:net');
const readLine = require('node:readline/promises');
const { chatAppUtils, clearLine, moveCursor } = require('./utils');

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const user = {
  name: '',
};

const clientSocket = net.createConnection(chatAppUtils, async () => {
  // Greet
  console.log('*** Welcome to interChat ***');
  user.name = await rl.question(
    'Please type your name to identify yourself > ',
  );

  if (!user.name) {
    console.log('ERROR: Cannot proceed without a name');
    clientSocket.end();
  }

  const ask = async () => {
    const message = await rl.question('Message > ');

    if (message.trim() === '[exit]') {
      clientSocket.write(`${user.name} left the chat.`);
      return clientSocket.end();
    }

    await moveCursor();
    await clearLine();
    clientSocket.write(`${user.name}: ${message}`);
  };

  console.log('\nConnected to server... To leave the chat type [exit]\n');
  clientSocket.write(`${user.name} entered the chat.`);
  ask();

  clientSocket.on('data', async (data) => {
    console.log();
    await moveCursor();
    await clearLine();
    console.log(data.toString('utf-8'));
    ask();
  });
});

clientSocket.on('error', (err) => {
  console.log('Something went wrong');
  throw err;
});

clientSocket.on('close', () => {
  console.log('Connection is closed');
});

clientSocket.on('end', () => {
  console.log('Connection ended');
});
