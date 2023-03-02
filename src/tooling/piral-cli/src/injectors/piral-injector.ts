import { join } from 'path';
import { EventEmitter } from 'events';
import { readFileSync, existsSync, statSync } from 'fs';
import { KrasInjector, KrasResponse, KrasRequest, KrasInjectorConfig, KrasConfiguration } from 'kras';
import { mime } from '../external';
import { Bundler } from '../types';

/**
 * The maximum amount of retries when sending a response
 */
const maxRetrySendResponse = 4;

export interface PiralInjectorConfig extends KrasInjectorConfig {
  bundler: Bundler;
  publicUrl: string;
  feed?: string;
  headers?: Record<string, string>;
}

export default class PiralInjector implements KrasInjector {
  public config: PiralInjectorConfig;

  constructor(options: PiralInjectorConfig, _config: KrasConfiguration, core: EventEmitter) {
    this.config = options;

    if (this.config.active) {
      const api = '/$events';
      const cbs = {};

      core.on('user-connected', (e) => {
        if (e.target === '*' && e.url === api.substring(1)) {
          cbs[e.id] = (msg: string) => e.ws.send(msg);
        }
      });

      core.on('user-disconnected', (e) => {
        delete cbs[e.id];
      });

      this.config.bundler.on((args) => {
        for (const id of Object.keys(cbs)) {
          cbs[id](JSON.stringify(args));
        }
      });
    }
  }

  get active() {
    return this.config.active;
  }

  set active(value) {
    this.config.active = value;
  }

  get name() {
    return 'piral-injector';
  }

  getOptions() {
    return {};
  }

  setOptions() {}

  sendContent(content: Buffer | string, type: string, url: string): KrasResponse {
    const { headers } = this.config;
    return {
      injector: { name: this.name },
      headers: {
        ...headers,
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

  sendIndexFile(target: string, url: string): KrasResponse {
    const indexHtml = readFileSync(target, 'utf8');
    const { feed } = this.config;

    if (feed) {
      // mechanism to inject server side debug piletApi config into piral emulator
      const windowInjectionScript = `window['dbg:pilet-api'] = '${feed}';`;
      const findStr = `<script`;
      const replaceStr = `<script>/* Pilet Debugging Emulator Config Injection */${windowInjectionScript}</script><script`;
      const content = indexHtml.replace(`${findStr}`, `${replaceStr}`);
      return this.sendContent(content, mime.getType(target), url);
    }

    return this.sendContent(indexHtml, mime.getType(target), url);
  }

  sendResponse(path: string, target: string, dir: string, url: string, recursionDepth = 0): KrasResponse {
    if (recursionDepth > maxRetrySendResponse) {
      return undefined;
    }

    const { bundler } = this.config;
    const newTarget = join(bundler.bundle.dir, bundler.bundle.name);

    if (!path || !existsSync(target) || !statSync(target).isFile()) {
      return this.sendResponse(bundler.bundle.name, newTarget, dir, url, recursionDepth + 1);
    } else if (target === newTarget) {
      return this.sendIndexFile(target, url);
    }

    const type = mime.getType(target) ?? 'application/octet-stream';
    return this.sendContent(readFileSync(target), type, url);
  }

  handle(req: KrasRequest): KrasResponse {
    if (!req.target) {
      const { bundler, publicUrl } = this.config;

      if (req.url.startsWith(publicUrl) || `${req.url}/` === publicUrl) {
        const pathLength = publicUrl.length || 1;
        const path = req.url.substring(pathLength);
        const dir = bundler.bundle.dir;
        const target = join(dir, path.split('?')[0]);
        return bundler.ready().then(() => this.sendResponse(path, target, dir, req.url));
      }
    }
  }
}
