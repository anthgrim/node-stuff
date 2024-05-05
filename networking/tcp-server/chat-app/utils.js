const chatAppUtils = {
  port: 8080,
  host: '127.0.0.1',
};

const clearLine = () => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(0, () => resolve());
  });
};

const moveCursor = () => {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(0, -1, () => resolve());
  });
};

module.exports = {
  chatAppUtils,
  clearLine,
  moveCursor,
};
