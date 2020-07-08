import PiletInjector from './pilet';
import { EventEmitter } from 'events';

describe('Piral-CLI piral injector', () => {
  it('PiletInjector is active when configured', () => {
    const options = {
      pilets: [],
      api: '',
      app: '',
      active: true,
    };
    const config = {
      port: 1234,
    };
    const core = new EventEmitter();
    const injector = new PiletInjector(options, config, core);
    expect(injector.active).toBeTruthy();
  });
});
