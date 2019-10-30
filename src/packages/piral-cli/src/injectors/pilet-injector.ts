import { join } from 'path';
import { getType } from 'mime';
import { readFileSync, existsSync } from 'fs';
import { KrasInjector, KrasResponse, KrasRequest } from 'kras';

export default class PiletInjector implements KrasInjector {
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
    return 'pilet-injector';
  }

  getOptions() {
    return {};
  }

  setOptions() {}

  sendContent(content: string, type: string, url: string) {
    return {
      injector: { name: this.name },
      headers: {
        'content-type': type,
      },
      status: { code: 200 },
      url,
      content,
    };
  }

  sendFile(target: string, url: string) {
    const content = readFileSync(target, 'utf8');
    return this.sendContent(content, getType(target), url);
  }

  handle(req: KrasRequest): KrasResponse {
    const { port, bundler, root, app, api } = this.options;

    if (!req.url.startsWith(api)) {
      const path = req.url.substr(1);
      const target = join(app, path);

      if (existsSync(target)) {
        return this.sendFile(target, req.url);
      } else {
        return this.handle({
          ...req,
          url: '/index.html',
        });
      };
    } else if (req.url === api || req.url[api.length] === '/') {
      const path = req.url.substr(api.length + 1);
      const dir = bundler.options.outDir;
      const target = join(dir, path);

      if (bundler.pending) {
        return new Promise(resolve => {
          bundler.once('bundled', () => resolve(this.handle(req)));
        });
      } else if (path === '') {
        const def = JSON.parse(readFileSync(root + '/package.json', 'utf8'));
        const link = bundler.mainBundle.name.substr(dir.length);
        const content = JSON.stringify({
          name: def.name,
          version: def.version,
          link: `http://localhost:${port}${api}/${link}`,
          hash: bundler.mainBundle.entryAsset.hash,
          noCache: true,
          custom: def.custom,
        });
        return this.sendContent(content, 'application/json', req.url);
      } else if (existsSync(target)) {
        return this.sendFile(target, req.url);
      }
    }
  }
}
