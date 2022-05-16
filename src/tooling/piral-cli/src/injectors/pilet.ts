import { URL } from 'url';
import { join } from 'path';
import { EventEmitter } from 'events';
import { readFileSync, existsSync, statSync } from 'fs';
import { KrasInjector, KrasResponse, KrasRequest, KrasInjectorConfig, KrasConfiguration, KrasResult } from 'kras';
import { log } from '../common/log';
import { getPiletSpecMeta } from '../common/spec';
import { config } from '../common/config';
import { axios, mime, jju } from '../external';
import { Bundler } from '../types';

const { host } = config;

interface Pilet {
  bundler: Bundler;
  root: string;
  meta: PiletMetadata;
}

export interface PiletInjectorConfig extends KrasInjectorConfig {
  pilets: Array<Pilet>;
  publicUrl: string;
  meta: string;
  api: string;
  app: string;
  feed?: string;
}

interface PiletMetadata {
  name?: string;
  [key: string]: unknown;
}

function fillPiletMeta(pilet: Pilet, basePath: string, metaFile: string) {
  const { root, bundler } = pilet;
  const metaPath = join(root, metaFile);
  const packagePath = join(root, 'package.json');
  const def = jju.parse(readFileSync(packagePath, 'utf8'));
  const metaOverride = existsSync(metaPath) ? jju.parse(readFileSync(metaPath, 'utf8')) : undefined;
  const file = bundler.bundle.name.replace(/^[\/\\]/, '');
  const target = join(bundler.bundle.dir, file);
  const url = new URL(file, basePath);
  const meta = {
    custom: def.custom,
    config: def.piletConfig,
    ...metaOverride,
    name: def.name,
    version: def.version,
    link: `${url.href}?updated=${Date.now()}`,
    ...getPiletSpecMeta(target, basePath),
  };

  pilet.meta = meta;
  return JSON.stringify(meta);
}

async function loadFeed(feed: string) {
  try {
    const response = await axios.default.get<{ items?: Array<PiletMetadata> } | Array<PiletMetadata> | PiletMetadata>(
      feed,
    );

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

export default class PiletInjector implements KrasInjector {
  public config: PiletInjectorConfig;
  private piletApi: string;
  private indexPath: string;

  constructor(options: PiletInjectorConfig, config: KrasConfiguration, core: EventEmitter) {
    this.config = options;
    // either take a full URI or make it an absolute path relative to the current origin
    this.piletApi = /^https?:/.test(options.api)
      ? options.api
      : `${config.ssl ? 'https' : 'http'}://${host}:${config.port}${options.api}`;

    const { pilets, api, publicUrl } = options;
    this.indexPath = `${publicUrl}index.html`;
    const cbs = {};

    core.on('user-connected', (e) => {
      if (e.target === '*' && e.url === api.substring(1)) {
        cbs[e.id] = (msg: string) => e.ws.send(msg);
      }
    });

    core.on('user-disconnected', (e) => {
      delete cbs[e.id];
    });

    pilets.forEach((p, i) =>
      p.bundler.on(() => {
        const basePath = `${this.piletApi}/${i}/`;
        const meta = fillPiletMeta(p, basePath, options.meta);

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

  async getMeta() {
    const { pilets, feed } = this.config;
    const localPilets = pilets.map((pilet) => pilet.meta).filter(Boolean);
    const mergedPilets = this.mergePilets(localPilets, await this.loadRemoteFeed(feed));
    return JSON.stringify(mergedPilets);
  }

  async loadRemoteFeed(feed?: string | Array<string>): Promise<Array<Array<PiletMetadata>>> {
    if (feed) {
      const feeds = Array.isArray(feed) ? feed : [feed];
      return await Promise.all(feeds.map(loadFeed));
    }
  }

  mergePilets(localPilets: Array<PiletMetadata>, remoteFeeds: Array<Array<PiletMetadata>>) {
    if (!remoteFeeds) {
      return localPilets;
    }

    const names = localPilets.map((pilet) => pilet.name);
    const merged = [...localPilets];

    for (const remotePilets of remoteFeeds) {
      const newPilets = remotePilets.filter((pilet) => pilet.name !== undefined && !names.includes(pilet.name));
      names.push(...newPilets.map((p) => p.name));
      merged.push(...newPilets);
    }

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
    const { app, api, publicUrl } = this.config;

    if (!req.target) {
      if (req.url.startsWith(publicUrl)) {
        const path = req.url.substring(publicUrl.length).split('?')[0];
        const target = join(app, path);

        if (existsSync(target) && statSync(target).isFile()) {
          if (req.url === this.indexPath) {
            return this.sendIndexFile(target, req.url);
          } else {
            return this.sendFile(target, req.url);
          }
        } else if (req.url !== this.indexPath) {
          return this.handle({
            ...req,
            url: this.indexPath,
          });
        }
      }

      return undefined;
    } else if (req.target === api) {
      const path = req.url.substring(1).split('?')[0];
      return this.sendResponse(path, req.url);
    }
  }
}
