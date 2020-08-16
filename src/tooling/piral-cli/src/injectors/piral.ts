import { join } from 'path';
import { readFileSync, existsSync, statSync } from 'fs';
import { KrasInjector, KrasResponse, KrasRequest, KrasInjectorConfig } from 'kras';
import { mime } from '../external';
import { Bundler } from '../types';

/**
 * The maximum amount of retries when sending a response
 */
const maxRetrySendResponse = 4;

export interface PiralInjectorConfig extends KrasInjectorConfig {
  bundler: Bundler;
}

export default class PiralInjector implements KrasInjector {
  public config: PiralInjectorConfig;

  constructor(options: PiralInjectorConfig) {
    this.config = options;
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

  sendResponse(
    path: string,
    target: string,
    publicFile: string,
    dir: string,
    url: string,
    recursionDepth = 0,
  ): KrasResponse {
    if (recursionDepth > maxRetrySendResponse) {
      return undefined;
    }
    let filePath = '';
    if (existsSync(target) && statSync(target).isFile()) {
      filePath = target;
    }
    if (existsSync(publicFile) && statSync(publicFile).isFile()) {
      filePath = publicFile;
    }

    if (!path || !filePath) {
      const { bundler } = this.config;
      const newTarget = join(bundler.bundle.dir, bundler.bundle.name);
      return this.sendResponse(bundler.bundle.name, newTarget, publicFile, dir, url, recursionDepth + 1);
    }

    return {
      injector: { name: this.name },
      headers: {
        'content-type': mime.getType(filePath),
        'cache-control': 'no-cache, no-store, must-revalidate',
        pragma: 'no-cache',
        expires: '0',
      },
      status: { code: 200 },
      url,
      content: readFileSync(filePath),
    };
  }

  handle(req: KrasRequest): KrasResponse {
    if (!req.target) {
      const { bundler } = this.config;
      const path = req.url.substr(1);
      const dir = bundler.bundle.dir;
      const root = bundler.bundle.root;
      const target = join(dir, path.split('?')[0]);
      const publicFile = join(root, 'public', path.split('?')[0]);
      return bundler.ready().then(() => this.sendResponse(path, target, publicFile, dir, req.url));
    }
  }
}
