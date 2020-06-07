import PiletInjector from './pilet';
import { EventEmitter } from 'events';

describe('Piral-CLI piral injector', () => {
  it('PiletInjector is active when configured', () => {
    const config = {
      pilets: [],
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
