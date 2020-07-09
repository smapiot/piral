import { join } from 'path';
import { EventEmitter } from 'events';
import { readFileSync, existsSync, statSync } from 'fs';
import { KrasInjector, KrasResponse, KrasRequest, KrasInjectorConfig, KrasConfiguration } from 'kras';
import { mime } from '../external';
import { Bundler } from '../types';

interface Pilet {
  bundler: Bundler;
  root: string;
  requireRef?: string;
}

type Protocol = 'https' | 'http';

export interface PiletInjectorConfig extends KrasInjectorConfig {
  pilets: Array<Pilet>;
  api: string;
  app: string;
}

export default class PiletInjector implements KrasInjector {
  public config: PiletInjectorConfig;
  private port: number;
  private protocol: Protocol;

  constructor(options: PiletInjectorConfig, config: KrasConfiguration, core: EventEmitter) {
    this.config = options;
    this.port = config.port;
    this.protocol = config.ssl ? 'https' : 'http';
    const { pilets, api } = options;
    const cbs = {};

    core.on('user-connected', e => {
      if (e.target === '*' && e.url === api.substr(1)) {
        cbs[e.id] = (msg: string) => e.ws.send(msg);
      }
    });

    core.on('user-disconnected', e => {
      delete cbs[e.id];
    });

    pilets.forEach((p, i) =>
      p.bundler.on(({ requireRef, version }) => {
        p.requireRef = version === 'v1' ? requireRef : undefined;
        const meta = JSON.stringify(this.getMetaOf(i));

        for (const id of Object.keys(cbs)) {
          cbs[id](meta);
        }
      }),
    );
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

  getMetaOf(index: number) {
    const { api, pilets } = this.config;
    const { bundler, root, requireRef } = pilets[index];
    const def = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
    const file = bundler.bundle.name.replace(/^\//, '');
    return {
      name: def.name,
      version: def.version,
      link: `${this.protocol}://localhost:${this.port}${api}/${index}/${file}`,
      hash: bundler.bundle.hash,
      requireRef,
      noCache: true,
      custom: def.custom,
    };
  }

  getMeta() {
    const { pilets } = this.config;

    if (pilets.length === 1) {
      return JSON.stringify(this.getMetaOf(0));
    }

    return JSON.stringify(pilets.map((_, i) => this.getMetaOf(i)));
  }

  sendContent(content: Buffer | string, type: string, url: string): KrasResponse {
    return {
      injector: { name: this.name },
      headers: {
        'content-type': type,
        'cache-control': 'no-cache, no-store, must-revalidate',
        pragma: 'no-cache',
        expires: '0',
      },
      status: { code: 200 },
      url,
      content,
    };
  }

  sendFile(target: string, url: string): KrasResponse {
    const content = readFileSync(target);
    return this.sendContent(content, mime.getType(target), url);
  }

  sendResponse(path: string, url: string): KrasResponse {
    if (!path) {
      const content = this.getMeta();
      return this.sendContent(content, 'application/json', url);
    } else {
      const { pilets } = this.config;
      const [index, ...rest] = path.split('/');
      const pilet = pilets[+index];
      const bundler = pilet?.bundler;

      return bundler?.ready().then(() => {
        const target = join(bundler.bundle.dir, rest.join('/'));

        if (existsSync(target) && statSync(target).isFile()) {
          return this.sendFile(target, url);
        }
      });
    }
  }

  handle(req: KrasRequest): KrasResponse {
    const { app, api } = this.config;
    const path = req.url.substr(1).split('?')[0];

    if (!req.target) {
      const target = join(app, path);

      if (existsSync(target) && statSync(target).isFile()) {
        return this.sendFile(target, req.url);
      } else if (req.url !== '/index.html') {
        return this.handle({
          ...req,
          url: '/index.html',
        });
      } else {
        return undefined;
      }
    } else if (req.target === api) {
      return this.sendResponse(path, req.url);
    }
  }
}
