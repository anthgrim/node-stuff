const fs = require('node:fs/promises');
// const fsNonAsync = require('node:fs');

const targetFilePath = './text.txt';
const targetWrites = 100000;
const timeTarget = 'writeMany';

//... Some samples to write big chunks of data

// Promise version
// (async () => {
//   console.time('writeMany');
//   try {
//     const fileHandle = await fs.open(targetFilePath, 'w');

//     for (let i = 0; i < 100000; i++) {
//       await fileHandle.write(`${i} `);
//     }

//     fileHandle.close().then(console.timeEnd('writeMany'));
//   } catch (error) {
//     console.timeEnd('writeMany');
//     throw error;
//   }
// })();

// Callback version
// (async () => {
//   console.time('writeMany');

//   fsNonAsync.open(targetFilePath, 'w', (error, fd) => {
//     if (error) throw error;

//     for (let i = 0; i < targetWrites; i++) {
//       fsNonAsync.writeSync(fd, `${i} `);
//     }
//   });

//   console.timeEnd('writeMany');
// })();

// Simple Stream approach
// Memory problem
// (async () => {
//   try {
//     console.time(timeTarget);

//     const fileHandle = await fs.open(targetFilePath, 'w');

//     const writeStream = fileHandle.createWriteStream();

//     for (let i = 0; i < targetWrites; i++) {
//       const buff = Buffer.from(`${i} `, 'utf-8');
//       writeStream.write(buff);
//     }

//     console.timeEnd(timeTarget);
//   } catch (error) {
//     console.log(error);
//     console.timeEnd(timeTarget);
//   }
// })();

(async () => {
  try {
    console.time(timeTarget);

    const fileHandle = await fs.open(targetFilePath, 'w');

    // Create a writable stream for writing the data
    const wStream = fileHandle.createWriteStream();

    console.log(wStream.writableHighWaterMark); // Value of the buffer size 16Kb
    console.log(wStream.writableLength); // Value of how much data has been written in the buffer

    let i = 0;

    const writeAction = () => {
      while (i < targetWrites) {
        if (i === targetWrites - 1) {
          wStream.end(Buffer.from(`${i} `, 'utf-8'));
          break;
        }

        if (!wStream.write(Buffer.from(`${i} `, 'utf-8'))) break;

        i++;
      }
    };

    writeAction();
    wStream.on('drain', () => {
      writeAction();
    });

    wStream.on('finish', () => {
      fileHandle.close();
      console.timeEnd(timeTarget);
    });
  } catch (error) {
    console.log(error);
    console.timeEnd(timeTarget);
  }
})();
