const { Duplex } = require('node:stream');
const fs = require('node:fs');

class FileDuplexStream extends Duplex {
  constructor({
    writableHighWaterMark,
    readableHighWaterMark,
    readFileName,
    writeFileName,
  }) {
    super({ readableHighWaterMark, writableHighWaterMark });
    this.readFileName = readFileName;
    this.writeFileName = writeFileName;
    this.readFd = null;
    this.writeFd = null;
    this.chunks = [];
    this.chunksSize = 0;
  }

  _construct(callback) {
    fs.open(this.readFileName, 'r', (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.readFd = fd;
        fs.open(this.writeFileName, 'w', (err, fd) => {
          if (err) {
            callback(err);
          } else {
            this.writeFd = fd;
            callback();
          }
        });
      }
    });
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.chunksSize += chunk.length;

    if (this.chunksSize > this.writableHighWaterMark) {
      fs.write(this.writeFd, Buffer.concat(this.chunks), (error) => {
        if (error) {
          callback(error);
        } else {
          this.chunks = [];
          this.chunksSize = 0;
          callback();
        }
      });
    }

    callback();
  }

  _read(size) {
    const buf = Buffer.alloc(size);
    fs.read(this.readFd, buf, 0, n, null, (err, bytesRead) => {
      if (err) {
        this.destroy(err);
      } else {
        this.push(bytesRead > 0 ? buf.slice(0, bytesRead) : null);
      }
    });
  }

  _final(callback) {
    fs.write(this.writeFd, Buffer.concat(this.chunks), (err) => {
      if (err) {
        return callback(err);
      }

      this.chunks = [];
      this.chunksSize = 0;
      return callback();
    });
  }

  _destroy(error, callback) {
    callback(error);
  }
}

const duplex = new FileDuplexStream({
  readFileName: '',
  writeFileName: '',
});

duplex.write(Buffer.from('Some string to'));
duplex.end(Buffer.from('End of write'));

duplex.on('data', (chunk) => {
  console.log(chunk.toString('utf-8'));
});
