import { describe, it, expect, vitest } from 'vitest';
import { openBrowser } from './browser';

let error = false;

vitest.mock('../external', () => ({
  rc(_, cfg) {
    return cfg;
  },
  ora() {
    return {
      fail() {},
    };
  },
  open() {
    if (error) {
      throw new Error('Error occured');
    } else {
      return null;
    }
  },
}));

describe('Browser Module', () => {
  it('opens browser successfully', async () => {
    error = false;
    await openBrowser(false, 1234, '/').then((result) => expect(result).toBeUndefined());
    await openBrowser(true, 1234, '/').then((result) => expect(result).toBeUndefined());
  });

  it('handles errored opening', async () => {
    error = true;
    await openBrowser(true, 1234, '/').then((result) => expect(result).toBeUndefined());
  });
});
