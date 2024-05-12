import assert from 'node:assert';
import { describe, it } from 'node:test';
import { sayHello } from '../functions/say-hello.js';

describe('sayHello', () => {
  it('should return hello', () => {
    assert.strictEqual(sayHello(), 'hello');
  });
});
