import { Atom, swap } from '@dbeining/react-atom';
import { createAxiosApi } from './create';

function createMockContainer() {
  const state = Atom.of({});
  return {
    context: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      defineActions() {},
      state,
      dispatch(update) {
        swap(state, update);
      },
    } as any,
    api: {} as any,
  };
}

describe('Piral-Axios create module', () => {
  let terminate = () => {};
  let port;

  beforeAll(async () => {
    const express = require('express');
    const cors = require('cors');
    const getPort = require('get-port');
    const app = express();
    port = await getPort();

    app.use(cors());

    app.get('/json', (_, res) => {
      res.json([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    terminate = app.listen(port);
  });

  afterAll(() => terminate());

  it('createAxiosApi fires before-fetch before fetching', async () => {
    const { context } = createMockContainer();
    const api: any = createAxiosApi()(context);
    await api.axios.get(`http://localhost:${port}/json`);
    expect(context.emit).toHaveBeenCalledWith('before-fetch', expect.anything());
  });
});
