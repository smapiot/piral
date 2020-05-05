import PiletInjector from './pilet';
import { EventEmitter } from 'events';

describe('Piral-CLI piral injector', () => {
  it('PiletInjector is active when configured', () => {
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
      root: '',
      port: 1234,
      api: '',
      app: '',
      active: true,
    };
    const core = new EventEmitter();
    const injector = new PiletInjector(config, undefined, core);
    expect(injector.active).toBeTruthy();
  });
});
