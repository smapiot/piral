import { postFile } from './http';

const apiUrl = 'http://sample.fooo.com/api/v1/pilet';

jest.mock('axios', () => ({
  default: {
    post(url, _, options) {
      const found = url === apiUrl;
      const auth = options.headers.authorization === 'Basic 123';

      if (!found) {
        return Promise.reject({
          response: {
            status: 404,
            statusText: 'Not found',
          },
        });
      } else if (!auth) {
        return Promise.reject({
          response: {
            status: 401,
            statusText: 'Not authorized',
          },
        });
      } else {
        return Promise.resolve({
          status: 200,
          statusText: 'OK',
        });
      }
    },
  },
}));

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
