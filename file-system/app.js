const fs = require('node:fs/promises');
const { FSLocalUtils, CommandRunner } = require('./utils');

const targetFile = './command.txt';

const eventTypes = {
  change: 'change',
  rename: 'rename',
};

(async () => {
  try {
    const watcher = fs.watch(targetFile);
    const fileHandle = await fs.open(targetFile, 'r');

    fileHandle.on('change', async () => {
      // Get file stats
      const readResultOptions = await FSLocalUtils.getReadOptions(fileHandle);

      // Read the content of the file
      const { buffer } = await fileHandle.read(readResultOptions);
      const command = buffer.toString('utf-8');

      //Run Command
      return CommandRunner.run(command);
    });

    for await (const event of watcher) {
      if (event.eventType === eventTypes.change) {
        fileHandle.emit('change');
      }
    }
  } catch (error) {
    console.error(error);
  }
})();
