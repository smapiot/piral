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

  sendResponse(path: string, target: string, dir: string, url: string) {
    if (!path || !existsSync(target)) {
      const { bundler } = this.options;
      const newTarget = bundler.mainBundle.name;
      return this.sendResponse(newTarget.substr(dir.length), newTarget, dir, url);
    }

    return {
      injector: { name: this.name },
      headers: {
        'content-type': getType(target),
      },
      status: { code: 200 },
      url,
      content: readFileSync(target),
    };
  }

  handle(req: KrasRequest): KrasResponse {
    const { bundler } = this.options;
    const path = req.url.substr(1);
    const dir = bundler.options.outDir;
    const target = join(dir, path.split('?')[0]);

    if (bundler.pending) {
      return new Promise(resolve => {
        bundler.once('bundled', () => resolve(this.sendResponse(path, target, dir, req.url)));
      });
    }

    return this.sendResponse(path, target, dir, req.url);
  }
}
