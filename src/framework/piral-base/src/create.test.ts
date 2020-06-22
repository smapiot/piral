import { startLoadingPilets } from './create';

describe('Piral-Base create module', () => {
  it('startLoadingPilets triggers the selected strategy', () => {
    const reporter = jest.fn();
    const loading = startLoadingPilets({
      createApi() {
        return undefined;
      },
      fetchPilets() {
        return Promise.resolve([]);
      },
      strategy(opts, pilets) {
        return Promise.resolve();
      },
    });
    loading.connect(reporter);
  });
});
