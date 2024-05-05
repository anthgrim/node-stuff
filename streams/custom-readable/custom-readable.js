const { Readable } = require('node:stream');
const fs = require('node:fs');

class FileReadStream extends Readable {
  constructor(fileName) {
    super();

    this.fileName = fileName;
    this.fd = null;
  }

  _construct(callback) {
    fs.open(this.filename, 'r', (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }

  _read(size) {
    const buf = Buffer.alloc(size);
    fs.read(this.fd, buf, 0, n, null, (err, bytesRead) => {
      if (err) {
        this.destroy(err);
      } else {
        this.push(bytesRead > 0 ? buf.slice(0, bytesRead) : null);
      }
    });
  }

  _destroy(err, callback) {
    if (this.fd) {
      fs.close(this.fd, (er) => callback(er || err));
    } else {
      callback(err);
    }
  }
}

const stream = new FileReadStream('');

stream.read(13);
