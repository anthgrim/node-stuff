const { Transform } = require('stream');
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs/promises');

class Decrypt extends Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    // some algorithm here
    for (let i = 0; i < chunk.length; i++) {
      if (chunk[i] === 0) {
        chunk[i] = 255;
      } else {
        chunk[i] = chunk[i] - 1;
      }
    }

    this.push(chunk);
  }
}

(async () => {
  try {
    const encryptedFileHandle = await fs.open('./encrypted.txt', 'r');
    const decryptFileHandle = await fs.open('./decrypted.txt', 'w');

    const readStream = encryptedFileHandle.createReadStream();
    const writeStream = decryptFileHandle.createWriteStream();
    const decrypt = new Decrypt();

    // Pipe the streams (read, encrypt the data, write the encrypted data)
    await pipeline(readStream, decrypt, writeStream);
  } catch (error) {
    console.log(error);
  }
})();
