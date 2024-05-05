// Encryption/Decryption => some data === af0q34%@#$%!#$!2 (crypto)
// Hashing-Salting => (crypto)
// Compression/Decompression => 01111011 === 01101 (zlib)
// Encoding/Decoding => 0111011 === [23, 409] (buffer)

// Encrypt and Decrypt Application
const { Transform } = require('node:stream');
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs/promises');

class Encrypt extends Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    // Some algorithm here
    for (let i = 0; i < chunk.length; i++) {
      if (chunk[i] === 255) {
        chunk[i] = 0;
      } else {
        chunk[i] = chunk[i] + 1;
      }
    }

    this.push(chunk);
  }
}

(async () => {
  try {
    const readFileHandle = await fs.open('./read.txt', 'r');
    const encryptedFileHandle = await fs.open('./encrypted.txt', 'w');

    const readStream = readFileHandle.createReadStream();
    const encryptedStream = encryptedFileHandle.createWriteStream();
    const encrypt = new Encrypt();

    // Pipe the streams (read, encrypt the data, write the encrypted data)
    await pipeline(readStream, encrypt, encryptedStream);
  } catch (error) {
    console.log(error);
  }
})();
