const { Writable } = require('node:stream');
const fs = require('node:fs');

class FileWriteStream extends Writable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark, fileName });

    this.fileName = fileName;
    this.fd = null;
    this.chunks = [];
    this.chunksSize = 0;
  }

  _construct(callback) {
    fs.open(this.fileName, 'w', (error, fd) => {
      if (error) {
        callback(error);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.chunksSize += chunk.length;

    if (this.chunksSize > this.writableHighWaterMark) {
      fs.write(this.fd, Buffer.concat(this.chunks), (error) => {
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

  _final(callback) {
    fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
      if (err) {
        return callback(err);
      }

      this.chunks = [];
      this.chunksSize = 0;
      return callback();
    });
  }

  _destroy(error, callback) {
    if (this.fd) {
      fs.close(this.fd, (err) => callback(err || error));
    } else {
      return callback(error);
    }
  }
}

const stream = new FileWriteStream({
  highWaterMark: 1800,
  fileName: '', // Your destination file
});
stream.write(Buffer.from('some string'));
stream.end(Buffer.from('our last write'));
