const { Buffer } = require('node:buffer');
const { BufferUtils } = require('./utils');

const memoryContainer = Buffer.alloc(4); // 1 GB

BufferUtils.fillItUp(memoryContainer);
BufferUtils.loopItUp(memoryContainer);
