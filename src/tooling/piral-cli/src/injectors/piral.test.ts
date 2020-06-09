import PiralInjector from './piral';

describe('Piral-CLI piral injector', () => {
  it('PiralInjector is active when configured', () => {
    const bundler = {
      pending: true,
      bundle: {
        dir: '',
        hash: '',
        name: '',
      },
      on() {},
      off() {},
      start() {},
      ready() {
        return Promise.resolve();
      },
    };
    const config = {
      bundler,
      active: true,
    };
    const injector = new PiralInjector(config);
    expect(injector.active).toBeTruthy();
  });
});
