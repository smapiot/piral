import { join } from 'path';
import { getType } from 'mime';
import { readFileSync, existsSync } from 'fs';
import { KrasInjector, KrasResponse, KrasRequest, KrasInjectorConfig } from 'kras';

export interface PiletInjectorConfig extends KrasInjectorConfig {
  bundler: any;
  root: string;
  port: number;
  api: string;
  app: string;
}

export default class PiletInjector implements KrasInjector {
  public config: PiletInjectorConfig;

  constructor(options: PiletInjectorConfig) {
    this.config = options;
  }

  get active() {
    return this.config.active;
  }
  set active(value) {
    this.config.active = value;
  }

  get name() {
    return 'pilet-injector';
  }

  getOptions() {
    return {};
  }

  setOptions() {}

  sendContent(content: Buffer | string, type: string, url: string) {
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
    const content = readFileSync(target);
    return this.sendContent(content, getType(target), url);
  }

  sendResponse(path: string, target: string, dir: string, url: string) {
    const { bundler, root, port, api } = this.config;

    if (!path) {
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
      return this.sendContent(content, 'application/json', url);
    } else if (existsSync(target)) {
      return this.sendFile(target, url);
    }
  }

  handle(req: KrasRequest): KrasResponse {
    const { bundler, app, api } = this.config;

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
      }
    } else if (req.url === api || req.url[api.length] === '/') {
      const path = req.url.substr(api.length + 1).split('?')[0];
      const dir = bundler.options.outDir;
      const target = join(dir, path);

      if (bundler.pending) {
        return new Promise(resolve => {
          bundler.once('bundled', () => resolve(this.sendResponse(path, target, dir, req.url)));
        });
      }

      return this.sendResponse(path, target, dir, req.url);
    }
  }
}
