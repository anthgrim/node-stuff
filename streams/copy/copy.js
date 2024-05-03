const fs = require('node:fs/promises');

const timeLabel = 'copy';
const origin = './origin.txt';
const destination = './copy.txt';

(async () => {
  try {
    console.time(timeLabel);

    const originFile = await fs.open(origin, 'r');
    const destFile = await fs.open(destination, 'w');

    let bytesRead = -1;

    while (bytesRead !== 0) {
      const readResult = await originFile.read();
      bytesRead = readResult.bytesRead;

      if (bytesRead !== 16384) {
        const indesOfNotFilled = readResult.buffer.indexOf(0);
        const newBuffer = Buffer.alloc(indesOfNotFilled);
        readResult.buffer.copy(newBuffer, 0, 0, indesOfNotFilled);

        await destFile.write(newBuffer);
      } else {
        await destFile.write(readResult.buffer);
      }
    }
  } catch (error) {
    console.log(error);
    console.timeEnd(timeLabel);
  }
})();
