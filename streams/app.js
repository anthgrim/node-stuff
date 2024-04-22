const fs = require('node:fs/promises');

const origin = './origin.txt';
const destination = './dest.txt';
const timeLabel = 'app';

// Only write even numbers

(async () => {
  try {
    console.time(timeLabel);

    // Crete fileHandle and readable stream to get the origin data
    const originFileHandle = await fs.open(origin, 'r');
    const readStream = originFileHandle.createReadStream();

    // Create fileHandle and writable stream to get the destination to where the data will be written
    const destinationFileHandle = await fs.open(destination, 'w');
    const writeStream = destinationFileHandle.createWriteStream();

    let split = '';

    // Write data to the destination whenever we get data from the readable stream
    readStream.on('data', (chunk) => {
      const chunkNumbers = chunk.toString('utf-8').split(' ');

      // Check if first element has splitting issue
      if (Number(chunkNumbers[0]) !== Number(chunkNumbers[1] - 1)) {
        if (split) {
          chunkNumbers[0] = split + chunkNumbers[0];
        }
      }

      // Check for splitting issue on the last element
      if (
        Number(chunkNumbers[chunkNumbers.length - 2]) + 1 !==
        Number(chunkNumbers[chunkNumbers.length - 1])
      ) {
        split = chunkNumbers.pop();
      }

      chunkNumbers.forEach((number) => {
        // Check if it's even
        if (Number(number) % 2 === 0) {
          if (!writeStream.write(`${number} `)) {
            // Pause if internal buffer is full
            readStream.pause();
          }
        }
      });
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
