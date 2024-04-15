import { join } from 'path';
import { EventEmitter } from 'events';
import { readFile, stat } from 'fs/promises';
import { KrasInjector, KrasRequest, KrasInjectorConfig, KrasConfiguration, KrasResult } from 'kras';
import { mime } from '../external';
import { Bundler } from '../types';

export interface PiralInjectorConfig extends KrasInjectorConfig {
  bundler: Bundler;
  publicUrl: string;
  feed?: string;
  headers?: Record<string, string>;
}

/**
 * The maximum amount of retries when sending a response
 */
const maxRetrySendResponse = 4;

async function isNoFile(target: string) {
  try {
    const info = await stat(target);
    return !info.isFile();
  } catch {
    return true;
  }
}

export default class PiralInjector implements KrasInjector {
  public readonly config: PiralInjectorConfig;
  private readonly cbs: Record<string, (msg: string) => void> = {};

  constructor(options: PiralInjectorConfig, _config: KrasConfiguration, core: EventEmitter) {
    this.config = options;

    if (this.config.active) {
      const api = '/$events';

      core.on('user-connected', (e) => {
        if (e.target === '*' && e.url === api.substring(1)) {
          this.cbs[e.id] = (msg: string) => e.ws.send(msg);
        }
      });

      core.on('user-disconnected', (e) => {
        delete this.cbs[e.id];
      });

      this.setupBundler();
    }
  }

  private forwardBundlerEvent = (args: any) => {
    for (const id of Object.keys(this.cbs)) {
      this.cbs[id](JSON.stringify(args));
    }
  };

  private setupBundler() {
    this.config.bundler.on(this.forwardBundlerEvent);
  }

  private teardownBundler() {
    this.config.bundler.off(this.forwardBundlerEvent);
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

  setOptions(options: any) {
    if ('bundler' in options) {
      this.teardownBundler();
      this.config.bundler = options.bundler;
      this.setupBundler();
    }
  }

  sendContent(content: Buffer | string, type: string, url: string): KrasResult {
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

  async sendIndexFile(target: string, url: string): Promise<KrasResult> {
    const indexHtml = await readFile(target, 'utf8');
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

  async sendResponse(path: string, target: string, dir: string, url: string, recursionDepth = 0): Promise<KrasResult> {
    if (recursionDepth > maxRetrySendResponse) {
      return undefined;
    }

    const { bundler } = this.config;
    const newTarget = join(bundler.bundle.dir, bundler.bundle.name);

    if (!path || (await isNoFile(target))) {
      return await this.sendResponse(bundler.bundle.name, newTarget, dir, url, recursionDepth + 1);
    } else if (target === newTarget) {
      return await this.sendIndexFile(target, url);
    } else {
      const type = mime.getType(target) ?? 'application/octet-stream';
      const content = await readFile(target);
      return this.sendContent(content, type, url);
    }
  }

  async handle(req: KrasRequest): Promise<KrasResult> {
    if (!req.target) {
      const { bundler, publicUrl } = this.config;

      if (req.url.startsWith(publicUrl) || `${req.url}/` === publicUrl) {
        const pathLength = publicUrl.length || 1;
        const path = req.url.substring(pathLength);
        const dir = bundler.bundle.dir;
        const target = join(dir, path.split('?').shift());
        await bundler.ready();
        return await this.sendResponse(path, target, dir, req.url);
      }
    }
  }
}
