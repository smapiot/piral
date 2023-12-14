import { URL } from 'url';
import { join, resolve } from 'path';
import { EventEmitter } from 'events';
import { existsSync } from 'fs';
import { readFile, stat, writeFile } from 'fs/promises';
import { KrasInjector, KrasRequest, KrasInjectorConfig, KrasConfiguration, KrasResult } from 'kras';
import { log } from '../common/log';
import { getPiletSpecMeta } from '../common/spec';
import { config as commonConfig } from '../common/config';
import { axios, mime, jju } from '../external';
import { Bundler } from '../types';

export interface PiletInjectorConfig extends KrasInjectorConfig {
  /**
   * The pilets to serve.
   */
  pilets: Array<Pilet>;
  /**
   * The base URL for the app shell / portal to be used.
   */
  publicUrl: string;
  /**
   * The base URL for the pilet assets to be used.
   */
  assetUrl?: string;
  /**
   * Defines if properties from the feed (if given) meta response should be taken over to local pilets.
   */
  mergeConfig?: boolean;
  /**
   * The additional metadata file to consider for the pilets.
   */
  meta: string;
  /**
   * The API path - usually somethin like `/$pilet-api`.
   */
  api: string;
  /**
   * The directory of the app (usually Piral instance emulator) to serve.
   */
  app?: string;
  /**
   * The remote feed to merge into.
   */
  feed?: string;
  /**
   * The additional headers to include.
   */
  headers?: Record<string, string>;
}

interface Pilet {
  bundler: Bundler;
  root: string;
  getMeta(basePath: string): PiletMetadata;
}

interface PiletMetadata {
  name?: string;
  config?: Record<string, any>;
  [key: string]: unknown;
}

async function getMetaOverride(root: string, metaFile: string) {
  if (metaFile) {
    const metaPath = join(root, metaFile);
    const exists = await stat(metaPath).then(
      () => true,
      () => false,
    );

    if (exists) {
      const metaContent = await readFile(metaPath, 'utf8');
      return jju.parse(metaContent);
    }
  }

  return undefined;
}

async function fillPiletMeta(pilet: Pilet, metaFile: string, subPath: string) {
  const { root, bundler } = pilet;
  const packagePath = join(root, 'package.json');
  const jsonContent = await readFile(packagePath, 'utf8');
  const def = jju.parse(jsonContent);
  const file = bundler.bundle.name.replace(/^[\/\\]/, '');
  const target = join(bundler.bundle.dir, file);
  const metaOverride = await getMetaOverride(root, metaFile);

  pilet.getMeta = (parentPath) => {
    const basePath = `${parentPath}${subPath}`;
    const url = new URL(file, basePath);

    return {
      custom: def.custom,
      config: def.piletConfig,
      ...metaOverride,
      name: def.name,
      version: def.version,
      link: `${url.href}?updated=${Date.now()}`,
      ...getPiletSpecMeta(target, basePath),
    };
  };
}

type FeedResponse = { items?: Array<PiletMetadata> } | Array<PiletMetadata> | PiletMetadata;

async function loadFeed(feed: string) {
  try {
    const response = await axios.default.get<FeedResponse>(feed);

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
  private serverConfig: KrasConfiguration;
  private indexPath: string;
  private proxyInfo?: {
    source: string;
    files: Array<string>;
    date: Date;
  };

  constructor(config: PiletInjectorConfig, serverConfig: KrasConfiguration, core: EventEmitter) {
    this.config = config;
    this.serverConfig = serverConfig;

    if (this.config.active) {
      const { pilets, api, app, publicUrl, assetUrl } = config;
      this.indexPath = `${publicUrl}index.html`;
      const cbs = {};

      if (app.endsWith('/app')) {
        const path = resolve(app, '..', 'package.json');

        if (existsSync(path)) {
          try {
            const packageJson = require(path);
  
            if (typeof packageJson.piralCLI.source === 'string') {
              this.proxyInfo = {
                source: packageJson.piralCLI.source,
                files: packageJson.files,
                date: new Date(packageJson.piralCLI.timestamp),
              };
            }
          } catch {
            // silently ignore errors - we just continue as-is
          }
        }
      }

      core.on('user-connected', (e) => {
        const baseUrl = assetUrl || e.req.headers.origin;

        if (e.target === '*' && e.url === api.substring(1)) {
          cbs[e.id] = {
            baseUrl,
            notify: (msg: string) => e.ws.send(msg),
          };
        }
      });

      core.on('user-disconnected', (e) => {
        delete cbs[e.id];
      });

      pilets.forEach((p, i) =>
        p.bundler.on(async () => {
          await fillPiletMeta(p, config.meta, `/${i}/`);

          for (const id of Object.keys(cbs)) {
            const { baseUrl, notify } = cbs[id];
            const meta = this.getPiletMeta(baseUrl, p);
            notify(meta);
          }
        }),
      );
    }
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

  getPiletApi(baseUrl: string) {
    const { api } = this.config;

    if (/^https?:/.test(api)) {
      return api;
    } else if (baseUrl) {
      return `${baseUrl}${api}`;
    } else {
      const { ssl, port } = this.serverConfig;
      const { host } = commonConfig;
      return `${ssl ? 'https' : 'http'}://${host}:${port}${api}`;
    }
  }

  getPiletMeta(baseUrl: string, pilet: Pilet) {
    const basePath = this.getPiletApi(baseUrl);
    return JSON.stringify(pilet.getMeta(basePath));
  }

  async getIndexMeta(baseUrl: string) {
    const { pilets, feed } = this.config;
    const basePath = this.getPiletApi(baseUrl);
    const localPilets = pilets.map((pilet) => pilet.getMeta?.(basePath)).filter(Boolean);
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
    if (!remoteFeeds || !Array.isArray(remoteFeeds)) {
      return localPilets;
    }

    const { mergeConfig = false } = this.config;
    const names = localPilets.map((pilet) => pilet.name);
    const merged = [...localPilets];

    for (const remotePilets of remoteFeeds) {
      if (!Array.isArray(remotePilets)) {
        continue;
      }

      const newPilets = remotePilets.filter((pilet) => {
        if (!pilet || typeof pilet !== 'object') {
          return false;
        }

        const name = pilet.name;
        const isNew = name !== undefined && !names.includes(name);

        if (!isNew && mergeConfig) {
          const existing = merged.find((m) => m.name === name);

          if (existing.config === undefined) {
            existing.config = pilet.config;
          } else if (pilet.config !== undefined) {
            Object.assign(existing.config, pilet.config);
          }
        }

        return isNew;
      });

      names.push(...newPilets.map((p) => p.name));
      merged.push(...newPilets);
    }

    return merged;
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

  async sendFile(target: string, url: string): Promise<KrasResult> {
    const content = await readFile(target);
    const type = mime.getType(target) ?? 'application/octet-stream';
    return this.sendContent(content, type, url);
  }

  async sendResponse(path: string, url: string, baseUrl: string): Promise<KrasResult> {
    const { pilets } = this.config;
    const [index, ...rest] = path.split('/');
    const pilet = pilets[+index];
    const bundler = pilet?.bundler;

    await bundler?.ready();

    if (!path) {
      const content = await this.getIndexMeta(baseUrl);
      return this.sendContent(content, 'application/json', url);
    } else if (bundler?.bundle) {
      const target = join(bundler.bundle.dir, rest.join('/'));
      const info = await stat(target).catch(() => undefined);

      if (info && info.isFile()) {
        return await this.sendFile(target, url);
      }
    }

    return undefined;
  }

  async sendIndexFile(target: string, url: string, baseUrl: string): Promise<KrasResult> {
    const indexHtml = await readFile(target, 'utf8');

    // mechanism to inject server side debug piletApi config into piral emulator
    const windowInjectionScript = `window['dbg:pilet-api'] = '${this.getPiletApi(baseUrl)}';`;
    const findStr = `<script`;
    const replaceStr = `<script>/* Pilet Debugging Emulator Config Injection */${windowInjectionScript}</script><script`;
    const content = indexHtml.replace(`${findStr}`, `${replaceStr}`);

    return this.sendContent(content, mime.getType(target), url);
  }

  private download(path: string) {
    const url = new URL(path, this.proxyInfo.source);
    const auth = commonConfig.auth?.[this.proxyInfo.source];

    switch (auth?.mode) {
      case 'header':
        return axios.default.get(url.href, {
          responseType: 'arraybuffer',
          headers: {
            [auth.key]: auth.value,
          },
        });
      case 'http':
        return axios.default.get(url.href, {
          responseType: 'arraybuffer',
          auth: {
            username: auth.username,
            password: auth.password,
          },
        });
      default:
        return axios.default.get(url.href, { responseType: 'arraybuffer' });
    }
  }

  private async shouldLoad(target: string, path: string) {
    if (this.proxyInfo) {
      if (!this.proxyInfo.files.includes(path)) {
        return false;
      }

      const fileInfo = await stat(target).catch(() => undefined);

      if (!fileInfo || fileInfo.mtime < this.proxyInfo.date) {
        try {
          const response = await this.download(path);
          await writeFile(target, response.data);
        } catch (ex) {
          log('generalDebug_0003', `HTTP request for emulator asset retrieval failed: ${ex}`);
          log(fileInfo ? 'optionalEmulatorAssetUpdateSkipped_0122' : 'requiredEmulatorAssetDownloadSkipped_0123', path);
          return !!fileInfo;
        }
      }

      return true;
    } else {
      const fileInfo = await stat(target).catch(() => undefined);
      return fileInfo && fileInfo.isFile();
    }
  }

  async handle(req: KrasRequest): Promise<KrasResult> {
    const { app, api, publicUrl, assetUrl } = this.config;
    const baseUrl =
      assetUrl || (req.headers.host ? `${req.encrypted ? 'https' : 'http'}://${req.headers.host}` : undefined);

    if (!req.target) {
      if (req.url.startsWith(publicUrl)) {
        const path = req.url.substring(publicUrl.length).split('?').shift();

        if (app) {
          const target = join(app, path);

          if (await this.shouldLoad(target, path)) {
            if (req.url === this.indexPath) {
              return await this.sendIndexFile(target, req.url, baseUrl);
            }

            return await this.sendFile(target, req.url);
          }
        }

        if (req.url !== this.indexPath) {
          return await this.handle({
            ...req,
            url: this.indexPath,
          });
        }
      }

      return undefined;
    } else if (req.target === api) {
      const path = req.url.substring(1).split('?').shift();
      return await this.sendResponse(path, req.url, baseUrl);
    }
  }
}
