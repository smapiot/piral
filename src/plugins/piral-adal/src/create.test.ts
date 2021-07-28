import { Atom, swap } from '@dbeining/react-atom';
import { createListener } from 'piral-base';
import { createAdalApi } from './create';

function createMockContainer() {
  const state = Atom.of({});
  const events = createListener(state);
  return {
    context: {
      ...events,
      defineActions() {},
      state,
      dispatch(update) {
        swap(state, update);
      },
    } as any,
    api: {} as any,
  };
}

describe('Piral-Adal create module', () => {
  it('createAdalApi extends the headers for requests', () => {
    const { context } = createMockContainer();
    const fakeHeaders = {
      authorization: 'test',
    };
    const attachAdalApi = createAdalApi({
      login() {},
      logout() {},
      account() {
        return undefined;
      },
      token() {
        return undefined;
      },
      extendHeaders(req) {
        req.setHeaders(fakeHeaders);
      },
    });
    attachAdalApi(context);
    const setHeaders = jest.fn();
    context.emit('before-fetch', {
      setHeaders,
    });
    expect(setHeaders).toBeCalledWith(fakeHeaders);
  });

  it('createAdalApi returns the current token upon request', async () => {
    const { context } = createMockContainer();
    const fakeToken = 'test token';
    const attachAdalApi = createAdalApi({
      login() {},
      logout() {},
      account() {
        return undefined;
      },
      token() {
        return Promise.resolve(fakeToken);
      },
      extendHeaders() {},
    });
    const api: any = attachAdalApi(context);
    const result = await api.getAccessToken();
    expect(result).toBe(fakeToken);
  });
});
