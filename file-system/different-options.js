const fsPromises = require('node:fs/promises');
const fs = require('node:fs');

// Promises API
(async () => {
  try {
    await fsPromises.copyFile('./text.txt', 'copy-text.txt');
  } catch (error) {
    console.log(error);
  }
})();

// Callback
fs.copyFile('./text.txt', 'callback-copy-text.txt', (error) => {
  if (error) console.log(error);
});

// Sync API
fs.copyFileSync('./text.txt', 'sync-copy-text.txt');
