const fs = require('node:fs/promises');

const origin = './origin.txt';
const destination = './dest.txt';
const timeLabel = 'app';

(async () => {
  try {
    console.time(timeLabel);

    // Crete fileHandle and readable stream to get the origin data
    const originFileHandle = await fs.open(origin, 'r');
    const readStream = originFileHandle.createReadStream();

    // Create fileHandle and writable stream to get the destination to where the data will be written
    const destinationFileHandle = await fs.open(destination, 'w');
    const writeStream = destinationFileHandle.createWriteStream();

    // Write data to the destination whenever we get data from the readable stream
    readStream.on('data', (chunk) => {
      if (!writeStream.write(chunk)) {
        // Pause reading if writable stream internal buffer is full
        readStream.pause();
      }
    });

    writeStream.on('drain', () => {
      // Resume reading data after writable stream has been drained
      readStream.resume();
    });

    readStream.on('end', () => {
      // Close file handles once there's no more data to read from
      originFileHandle.close();
      destinationFileHandle.close();
      console.timeEnd(timeLabel);
    });
  } catch (error) {
    console.log(error);
    console.timeEnd(timeLabel);
  }
})();
