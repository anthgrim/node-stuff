const { Buffer } = require('node:buffer');

// Write the binary data to a buffer
// 0100 1000 0110 1001 0010 0001

// 24 bits -> 3 Bytes

// Allocating memory
const memoryContainer = Buffer.from([0x48, 0x69, 0x21]);

// Logging it
console.log('Memory Container:', memoryContainer);
console.log('Decoded:', memoryContainer.toString());
