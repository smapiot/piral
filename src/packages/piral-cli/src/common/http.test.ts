import { postFile } from './http';

const apiUrl = 'http://sample.fooo.com/api/v1/pilet';

jest.mock('request', () => {
  const fn = (target, options, callback) => {
    const found = target === apiUrl;
    const auth = options.headers.authorization === 'Basic 123';

    if (!found) {
      callback(undefined, {
        statusCode: 404,
        statusMessage: 'Not found',
      });
    } else if (!auth) {
      callback(undefined, {
        statusCode: 401,
        statusMessage: 'Not authorized',
      });
    } else {
      callback(undefined, {
        statusCode: 200,
        statusMessage: 'OK',
      });
    }
  };
  fn.form = {
    append() {},
  };
  return jest.fn(fn);
});

describe('HTTP Module', () => {
  it('postFile form posts a file successfully should be ok', async () => {
    const result = await postFile(apiUrl, '123', Buffer.from('example'));
    expect(result).toBeTruthy();
  });

  it('postFile form fails to post file should be false', async () => {
    const result = await postFile(apiUrl, '124', Buffer.from('example'));
    expect(result).toBeFalsy();
  });

  it('postFile form not found to post file should be false', async () => {
    const result = await postFile('http://sample.com/', '', Buffer.from('example'));
    expect(result).toBeFalsy();
  });
});
