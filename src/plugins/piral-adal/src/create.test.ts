/**
 * @vitest-environment jsdom
 */
import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { createListener } from 'piral-base';
import { createAdalApi } from './create';

function createMockContainer() {
  const state = create(() => ({}));
  const events = createListener(state);
  return {
    context: {
      ...events,
      defineActions() {},
      state,
      dispatch(update) {
        state.setState(update(state.getState()));
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
    const setHeaders = vitest.fn();
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
