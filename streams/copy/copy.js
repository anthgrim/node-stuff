const fs = require('node:fs/promises');

const timeLabel = 'copy';
const origin = './origin.txt';
const destination = './copy.txt';

(async () => {
  try {
    console.time(timeLabel);

    const originFile = await fs.open(origin, 'r');
    const destFile = await fs.open(destination, 'w');

    const readStream = originFile.createReadStream();
    const writeStream = destFile.createWriteStream();

    readStream.pipe(writeStream);
  } catch (error) {
    console.log(error);
    console.timeEnd(timeLabel);
  }
})();
