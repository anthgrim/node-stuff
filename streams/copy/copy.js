const fs = require('node:fs/promises');
const { pipeline } = require('node:stream');
const zlib = require('node:zlib');

const timeLabel = 'copy';
const origin = './origin.txt';
const destination = './copy.txt';

(async () => {
  console.time(timeLabel);
  try {
    const originFile = await fs.open(origin, 'r');
    const destFile = await fs.open(destination, 'w');

    const readStream = originFile.createReadStream();
    const writeStream = destFile.createWriteStream();

    pipeline(readStream, writeStream, (error) => {
      if (error) {
        console.log(error);
        console.timeEnd(timeLabel);
      } else {
        console.log('Success');
        console.timeEnd(timeLabel);
      }
    });
  } catch (error) {
    console.log(error);
  }
})();
