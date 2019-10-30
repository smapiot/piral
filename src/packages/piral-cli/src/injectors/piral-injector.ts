import { join } from 'path';
import { getType } from 'mime';
import { readFileSync, existsSync } from 'fs';
import { KrasInjector, KrasResponse, KrasRequest } from 'kras';

export default class PiralInjector implements KrasInjector {
  private options: any;

  constructor(options: any = {}) {
    this.options = options;
  }

  get active() {
    return this.options.active;
  }
  set active(value) {
    this.options.active = value;
  }

  get name() {
    return 'piral-injector';
  }

  getOptions() {
    return {};
  }

  setOptions() {}

  handle(req: KrasRequest): KrasResponse {
    const { bundler } = this.options;
    const path = req.url.substr(1);
    const dir = bundler.options.outDir;
    const target = join(dir, req.url);

    if (bundler.pending) {
      return new Promise(resolve => {
        bundler.once('bundled', () => resolve(this.handle(req)));
      });
    } else if (path === '') {
      const url = bundler.mainBundle.name.substr(dir.length);
      return this.handle({
        ...req,
        url,
      });
    } else if (existsSync(target)) {
      const content = readFileSync(target, 'utf8');
      return {
        injector: { name: this.name },
        headers: {
          'content-type': getType(target),
        },
        status: { code: 200 },
        url: req.url,
        content,
      };
    }
  }
}
