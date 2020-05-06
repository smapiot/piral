import { join } from 'path';
import { getType } from 'mime';
import { readFileSync, existsSync, statSync } from 'fs';
import { KrasInjector, KrasResponse, KrasRequest, KrasInjectorConfig } from 'kras';
import { Bundler } from '../types';

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

  sendResponse(path: string, target: string, dir: string, url: string): KrasResponse {
    if (!path || !existsSync(target) || !statSync(target).isFile()) {
      const { bundler } = this.config;
      const newTarget = join(bundler.bundle.dir, bundler.bundle.name);
      return this.sendResponse(bundler.bundle.name, newTarget, dir, url);
    }

    return {
      injector: { name: this.name },
      headers: {
        'content-type': getType(target),
        'cache-control': 'no-cache, no-store, must-revalidate',
        pragma: 'no-cache',
        expires: '0',
      },
      status: { code: 200 },
      url,
      content: readFileSync(target),
    };
  }

  handle(req: KrasRequest): KrasResponse {
    if (!req.target) {
      const { bundler } = this.config;
      const path = req.url.substr(1);
      const dir = bundler.bundle.dir;
      const target = join(dir, path.split('?')[0]);
      return bundler.ready().then(() => this.sendResponse(path, target, dir, req.url));
    }
  }
}
