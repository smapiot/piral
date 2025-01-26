import { describe, it, expect, vitest } from 'vitest';
import { postFile, downloadFile, getAgent } from './http';

const apiUrl = 'http://sample.fooo.com/api/v1/pilet';

let errorRequest = false;
let errorOther = false;
let errorResponse = false;
let errorResponse2 = false;

vitest.mock('../external', async () => {
  return {
    rc(_, cfg) {
      return cfg;
    },
    ora() {
      return {
        warn() {},
        fail() {},
      };
    },
    axios: {
      post(url, _, options) {
        const found = url === apiUrl;
        const auth = options.headers.authorization === 'Basic 123';

        if (errorRequest) {
          return Promise.reject({
            request: {},
          });
        } else if (errorOther) {
          return Promise.reject({
            message: 'error',
          });
        } else if (errorResponse) {
          return Promise.reject({
            response: {
              status: 410,
              statusText: 'Not Gone',
              data: '{ "message": "This component is not available anymore." }',
            },
          });
        } else if (errorResponse2) {
          return Promise.reject({
            response: {
              status: 410,
              statusText: 'Not Gone',
              data: { message: 'This component is not available anymore.' },
            },
          });
        } else if (!found) {
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
      get(url, options) {
        if (errorOther) {
          return Promise.reject({
            message: 'error',
          });
        }
        return Promise.resolve({ data: 'test' });
      },
    },
    FormData: ((await vitest.importActual('form-data')) as any).default,
  };
});

describe('HTTP Module', () => {
  it('postFile form posts a file successfully should be ok', async () => {
    const result = await postFile(apiUrl, 'basic', '123', Buffer.from('example'));
    expect(result).toEqual({
      response: undefined,
      status: 200,
      success: true,
    });
  });

  it('postFile form fails to post file should be false', async () => {
    const result = await postFile(apiUrl, 'basic', '124', Buffer.from('example'));
    expect(result).toEqual({
      response: '',
      status: 401,
      success: false,
    });
  });

  it('postFile form not found to post file should be false', async () => {
    const result = await postFile('http://sample.com/', 'basic', '', Buffer.from('example'));
    expect(result).toEqual({
      response: '',
      status: 404,
      success: false,
    });
  });

  it('postFile call results in error request', async () => {
    errorRequest = true;
    const result = await postFile('http://sample.com/', 'basic', '', Buffer.from('example'));
    expect(result).toEqual({
      response: undefined,
      status: 500,
      success: false,
    });
    errorRequest = false;
  });

  it('postFile call results in error other', async () => {
    errorOther = true;
    const result = await postFile('http://sample.com/', 'basic', '', Buffer.from('example'));
    expect(result).toEqual({
      response: undefined,
      status: 500,
      success: false,
    });
    errorOther = false;
  });

  it('postFile call results in error response', async () => {
    errorResponse = true;
    let result = await postFile('http://sample.com/', 'basic', '', Buffer.from('example'));
    expect(result).toEqual({
      response: 'This component is not available anymore.',
      status: 410,
      success: false,
    });
    errorResponse = false;
    errorResponse2 = true;
    result = await postFile('http://sample.com/', 'basic', '', Buffer.from('example'));
    expect(result).toEqual({
      response: 'This component is not available anymore.',
      status: 410,
      success: false,
    });
    errorResponse2 = false;
  });

  it('downloadFile calls results in error', async () => {
    errorOther = true;
    const agent = getAgent({ ca: Buffer.from('example') });
    let result = await downloadFile('http://sample.com/', agent);
    expect(result.length).toBe(0);
    errorOther = false;
    result = await downloadFile('http://sample.com/', agent);
    expect(result.length).toBe(0);
  });
});
