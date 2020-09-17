import { getFreePort } from './port';

const defaultPort = 12345;
const error = Error('RangeError: Port should be >= 0 and < 65536.');

jest.mock('../external', () => ({
  getPort: (options: any) => {
    if (options == undefined) {
      return Promise.resolve(defaultPort);
    } else if (options && options.port && options.port > 65536) {
      return Promise.reject(error);
    } else if (options && options.port) {
      return Promise.resolve(options.port);
    }
  },
}));

describe('Port Module', () => {
  it('getFreePort with and without preferred port', async () => {
    await getFreePort().then((result) => expect(defaultPort));
    await getFreePort(9999).then((result) => expect(9999));
    await getFreePort(99999).catch((err) => expect(err).toEqual(error));
  });
});
