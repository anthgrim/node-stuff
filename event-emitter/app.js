const EventEmitter = require('node:events');

class Emitter extends EventEmitter {}

const myEmitter = new Emitter();

myEmitter.on('foo', () => {
  console.log('An event occurred');
});

myEmitter.on('foo', () => {
  console.log('An event occurred 2');
});

myEmitter.on('foo', (param) => {
  console.log('An event occurred with param:', param);
});

myEmitter.once('bar', () => {
  console.log('A Bar event ocurred');
});

myEmitter.emit('foo', 'param');
myEmitter.emit('bar');
myEmitter.emit('bar');
myEmitter.emit('bar');
