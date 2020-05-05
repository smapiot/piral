import { createPiletOptions } from './helpers';
import { globalDependencies } from './modules';

describe('Piral-Core helpers module', () => {
  it('createPiletOptions creates the options using the provided pilets', () => {
    const options = createPiletOptions({
      availablePilets: [],
      context: {},
      createApi: () => ({}),
    });
    expect(options.pilets).toEqual([]);
  });

  it('createPiletOptions creates the options exposing the global dependencies', () => {
    const options = createPiletOptions({
      availablePilets: [],
      context: {},
      createApi: () => ({}),
    });
    expect(options.dependencies).toEqual(globalDependencies);
  });

  it('createPiletOptions creates the options with provided requestPilets', () => {
    const requestPilets = jest.fn();
    const options = createPiletOptions({
      availablePilets: [],
      context: {},
      createApi: () => ({}),
      requestPilets,
    });
    expect(requestPilets).not.toHaveBeenCalled();
    options.fetchPilets();
    expect(requestPilets).toHaveBeenCalled();
  });
});
