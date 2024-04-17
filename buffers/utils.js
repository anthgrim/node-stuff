/**
 * Buffer simple utility functions
 */
class BufferUtils {
  /**
   * Fill the buffer with something!
   * @param {Buffer} target
   * @param {any} param - Optional
   */
  static fillItUp(target, param) {
    try {
      if (param) {
        return target.fill(param);
      }

      for (let i = 0; i < target.length; i++) {
        target[i] = i;
      }

      console.log('Done!');
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Loop the buffer!
   * @param {Buffer} target
   */
  static loopItUp(target) {
    for (const element of target) {
      console.log(element);
    }
  }
}

module.exports = { BufferUtils };
