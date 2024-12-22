/**
 * @vitest-environment jsdom
 */
import create from 'zustand';
import getPort from 'get-port';
import cors from 'cors';
import express from 'express';
import { describe, it, expect, vitest, beforeAll, afterAll } from 'vitest';
import { createAxiosApi } from './create';

function createMockContainer() {
  const state = create(() => ({}));
  return {
    context: {
      on: vitest.fn(),
      off: vitest.fn(),
      emit: vitest.fn(),
      defineActions() {},
      state,
      dispatch(update) {
        state.setState(update(state.getState()));
      },
    } as any,
    api: {} as any,
  };
}

describe('Piral-Axios create module', () => {
  let terminate = () => {};
  let port;

  beforeAll(async () => {
    const app = express();
    port = await getPort();

    app.use(cors());

    app.get('/json', (_, res) => {
      res.json([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    let server = app.listen(port);
    terminate = () => server.close();
  });

  afterAll(() => terminate());

  it('createAxiosApi fires before-fetch before fetching', async () => {
    const { context } = createMockContainer();
    const api: any = createAxiosApi()(context);
    await api.axios.get(`http://localhost:${port}/json`);
    expect(context.emit).toHaveBeenCalledWith('before-fetch', expect.anything());
  });
});
