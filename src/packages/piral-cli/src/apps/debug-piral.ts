import * as Bundler from 'parcel-bundler';
import chalk from 'chalk';
import { dirname, join, resolve } from 'path';
import { readKrasConfig, krasrc, buildKrasWithCli, defaultConfig } from 'kras';
import {
  retrievePiletsInfo,
  retrievePiralRoot,
  clearCache,
  setStandardEnvs,
  modifyBundlerForPiral,
  extendBundlerForPiral,
  extendBundlerWithPlugins,
  extendConfig,
  liveIcon,
  settingsIcon,
  openBrowser,
} from '../common';

export interface DebugPiralOptions {
  entry?: string;
  cacheDir?: string;
  port?: number;
  publicUrl?: string;
  logLevel?: 1 | 2 | 3;
  fresh?: boolean;
  open?: boolean;
  scopeHoist?: boolean;
  hmr?: boolean;
  autoInstall?: boolean;
}

export const debugPiralDefaults = {
  entry: './',
  cacheDir: '.cache',
  port: 1234,
  publicUrl: '/',
  logLevel: 3 as const,
  fresh: false,
  open: false,
  scopeHoist: false,
  hmr: true,
  autoInstall: true,
};

const injectorName = resolve(__dirname, '../injectors/piral.js');

export async function debugPiral(baseDir = process.cwd(), options: DebugPiralOptions = {}) {
  const {
    entry = debugPiralDefaults.entry,
    port = debugPiralDefaults.port,
    cacheDir = debugPiralDefaults.cacheDir,
    open = debugPiralDefaults.open,
    scopeHoist = debugPiralDefaults.scopeHoist,
    hmr = debugPiralDefaults.hmr,
    autoInstall = debugPiralDefaults.autoInstall,
    publicUrl = debugPiralDefaults.publicUrl,
    logLevel = debugPiralDefaults.logLevel,
    fresh = debugPiralDefaults.fresh,
  } = options;
  const entryFiles = await retrievePiralRoot(baseDir, entry);
  const { externals, name, root } = await retrievePiletsInfo(entryFiles);

  const krasConfig = readKrasConfig({ port }, krasrc);

  if (krasConfig.directory === undefined) {
    krasConfig.directory = join(dirname(entryFiles), 'mocks');
  }

  if (krasConfig.ssl === undefined) {
    krasConfig.ssl = undefined;
  }

  if (krasConfig.map === undefined) {
    krasConfig.map = {};
  }

  if (krasConfig.api === undefined) {
    krasConfig.api = '/manage-mock-server';
  }

  if (krasConfig.injectors === undefined) {
    krasConfig.injectors = defaultConfig.injectors;
  }

  if (fresh) {
    await clearCache(root, cacheDir);
  }

  await setStandardEnvs({
    target: dirname(entryFiles),
    dependencies: externals,
    piral: name,
  });

  modifyBundlerForPiral(Bundler.prototype, dirname(entryFiles));

  const bundler = new Bundler(
    entryFiles,
    extendConfig({ publicUrl, logLevel, cacheDir, scopeHoist, hmr, autoInstall }),
  );

  const injectorConfig = {
    active: true,
    handle: ['/'],
    bundler,
  };

  extendBundlerForPiral(bundler);
  extendBundlerWithPlugins(bundler);

  krasConfig.map['/'] = '';

  krasConfig.injectors = {
    script: krasConfig.injectors.script || {
      active: true,
    },
    [injectorName]: injectorConfig,
    ...krasConfig.injectors,
  };

  const krasServer = buildKrasWithCli(krasConfig);
  krasServer.removeAllListeners('open');

  krasServer.on('open', svc => {
    const address = `${svc.protocol}://localhost:${chalk.green(svc.port)}`;
    console.log(`${liveIcon}  Running at ${chalk.bold(address)}.`);
    console.log(`${settingsIcon}  Manage via ${chalk.bold(address + krasConfig.api)}.`);
    bundler.bundle();
  });

  await krasServer.start();
  openBrowser(open, port);
  await new Promise(resolve => krasServer.on('close', resolve));
}
