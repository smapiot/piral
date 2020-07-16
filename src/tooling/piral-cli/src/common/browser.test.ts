import { openBrowser } from './browser';

let error = false;

jest.mock('opn', () => (...args) => {
  if (error) {
    throw new Error('Error occured');
  } else {
    return null;
  }
});

describe('Browser Module', () => {
  it('opens browser successfully while not opening', async () => {
    error = false;
    await openBrowser(false, 1234).then(result => expect(result).toBeUndefined());
    await openBrowser(true, 1234).then(result => expect(result).toBeUndefined());
    error = true;
    await openBrowser(true, 1234).then(result => expect(result).toBeUndefined());
    error = false;
  });
});
