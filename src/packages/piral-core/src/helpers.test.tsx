import { createPiletOptions } from './helpers';

describe('Piral-Core helpers module', () => {
  it('createPiletOptions creates the options', () => {
    const options = createPiletOptions({
      availablePilets: [],
      context: {},
      createApi: () => ({}),
    });
  });
});
