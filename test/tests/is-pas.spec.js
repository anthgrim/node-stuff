import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isPAS } from '../functions/is-pas.js';

describe('isPAS', () => {
  it('should return false if isPAS', () => {
    assert.strictEqual(isPAS({ isPAS: false }), false);
  });
});
