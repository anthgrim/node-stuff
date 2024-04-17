// A buffer is a container in memory
const { Buffer } = require('node:buffer');
const { BufferUtils } = require('./utils');

const memoryContainer = Buffer.alloc(4); // 4 bytes -> 32 bits

console.log('Memory container:', memoryContainer);
console.log('Byte length:', memoryContainer.byteLength);
console.log('First element:', memoryContainer[0]);

// Add some data
memoryContainer[0] = 0xf4;
memoryContainer[1] = 0x34;
memoryContainer[2] = 0x00;
memoryContainer[3] = 0xff;

// Min value an element of the buffer can hold = 0 -> 1 Byte => 0000 0000 ~> 0
// Max value an elemeng of the buffer can hold = 255 -> 1 Byte => 1111 1111 ~> 255

console.log('\nMemory container:', memoryContainer);
console.log('String:', memoryContainer.toString('hex'));
BufferUtils.loopItUp(memoryContainer);
