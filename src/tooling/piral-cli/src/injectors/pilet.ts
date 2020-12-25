import { join } from 'path';
import { EventEmitter } from 'events';
import { readFileSync, existsSync, statSync } from 'fs';
import { KrasInjector, KrasResponse, KrasRequest, KrasInjectorConfig, KrasConfiguration, KrasResult } from 'kras';
import { axios, mime } from '../external';
import { Bundler } from '../types';
import { log } from '../common/log';

interface Pilet {
  bundler: Bundler;
  root: string;
  requireRef?: string;
}

export interface PiletInjectorConfig extends KrasInjectorConfig {
  pilets: Array<Pilet>;
  api: string;
  app: string;
  feed?: string;
}

interface PiletMetadata {
  name?: string;
  [key: string]: unknown;
}

export default class PiletInjector implements KrasInjector {
  public config: PiletInjectorConfig;
  private piletApi: string;

  constructor(options: PiletInjectorConfig, config: KrasConfiguration, core: EventEmitter) {
    this.config = options;
    // either take a full URI or make it an absolute path relative to the current origin
    this.piletApi = /^https?:/.test(options.api)
      ? options.api
      : `${config.ssl ? 'https' : 'http'}://localhost:${config.port}${options.api}`;

    const { pilets, api } = options;
    const cbs = {};

    core.on('user-connected', (e) => {
      if (e.target === '*' && e.url === api.substr(1)) {
        cbs[e.id] = (msg: string) => e.ws.send(msg);
      }
    });

    core.on('user-disconnected', (e) => {
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
      link: `${this.piletApi}/${index}/${file}`,
      hash: bundler.bundle.hash,
      requireRef,
      noCache: true,
      custom: def.custom,
    };
  }

  async getMeta() {
    const { pilets, feed } = this.config;
    const localPilets = pilets.map((_, i) => this.getMetaOf(i));
    const mergedPilets = this.mergePilets(localPilets, await this.loadRemoteFeed(feed));

    if (mergedPilets.length === 1) {
      return JSON.stringify(mergedPilets[0]);
    }

    return JSON.stringify(mergedPilets);
  }

  async loadRemoteFeed(feed?: string): Promise<Array<PiletMetadata>> {
    if (feed) {
      try {
        const response = await axios.default.get<{ items?: Array<PiletMetadata> } | Array<PiletMetadata> | PiletMetadata>(feed);
  
        if (Array.isArray(response.data)) {
          return response.data;
        } else if (Array.isArray(response.data?.items)) {
          return response.data.items;
        } else {
          return [response.data];
        }
      } catch (e) {
        log('generalWarning_0001', `Couldn't load feed at ${feed}.`);
      }
    }

  }

  mergePilets(localPilets: Array<PiletMetadata>, remotePilets: Array<PiletMetadata>) {
    if (!remotePilets) {
      return localPilets;
    }

    const names = localPilets.map((pilet) => pilet.name);
    const merged = [
      ...localPilets,
      ...remotePilets.filter((pilet) => pilet.name !== undefined && !names.includes(pilet.name)),
    ];

    return merged;
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
    const type = mime.getType(target) ?? 'application/octet-stream';
    return this.sendContent(content, type, url);
  }

  async sendResponse(path: string, url: string): Promise<KrasResult> {
    const { pilets } = this.config;
    const [index, ...rest] = path.split('/');
    const pilet = pilets[+index];
    const bundler = pilet?.bundler;

    if (!path) {
      await bundler?.ready();
      const content = await this.getMeta();
      return this.sendContent(content, 'application/json', url);
    } else {
      return bundler?.ready().then(() => {
        const target = join(bundler.bundle.dir, rest.join('/'));

        if (existsSync(target) && statSync(target).isFile()) {
          return this.sendFile(target, url);
        }
      });
    }
  }

  sendIndexFile(target: string, url: string): KrasResponse {
    const indexHtml = readFileSync(target, 'utf8');

    // mechanism to inject server side debug piletApi config into piral emulator
    const windowInjectionScript = `window['dbg:pilet-api'] = '${this.piletApi}';`;
    const findStr = `<script`;
    const replaceStr = `<script>/* Pilet Debugging Emulator Config Injection */${windowInjectionScript}</script><script`;
    const content = indexHtml.replace(`${findStr}`, `${replaceStr}`);

    return this.sendContent(content, mime.getType(target), url);
  }

  handle(req: KrasRequest): KrasResponse {
    const { app, api } = this.config;
    const path = req.url.substr(1).split('?')[0];

    if (!req.target) {
      const target = join(app, path);

      if (existsSync(target) && statSync(target).isFile()) {
        if (req.url === '/index.html') {
          return this.sendIndexFile(target, req.url);
        }
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
