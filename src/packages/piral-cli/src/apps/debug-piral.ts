import { dirname, join, resolve } from 'path';
import { readKrasConfig, krasrc, buildKrasWithCli, defaultConfig } from 'kras';
import { LogLevels } from '../types';
import {
  retrievePiletsInfo,
  retrievePiralRoot,
  setStandardEnvs,
  openBrowser,
  checkCliCompatibility,
  reorderInjectors,
  notifyServerOnline,
  patchModules,
  setupBundler,
  removeDirectory,
  setLogLevel,
  progress,
} from '../common';

export interface DebugPiralOptions {
  entry?: string;
  cacheDir?: string;
  port?: number;
  publicUrl?: string;
  logLevel?: LogLevels;
  fresh?: boolean;
  open?: boolean;
  scopeHoist?: boolean;
  hmr?: boolean;
  autoInstall?: boolean;
  optimizeModules?: boolean;
}

export const debugPiralDefaults: DebugPiralOptions = {
  entry: './',
  cacheDir: '.cache',
  port: 1234,
  publicUrl: '/',
  logLevel: LogLevels.info,
  fresh: false,
  open: false,
  scopeHoist: false,
  hmr: true,
  autoInstall: true,
  optimizeModules: true,
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
    optimizeModules = debugPiralDefaults.optimizeModules,
  } = options;
  setLogLevel(logLevel);
  progress('Reading configuration ...');
  const entryFiles = await retrievePiralRoot(baseDir, entry);
  const { externals, name, root, ignored } = await retrievePiletsInfo(entryFiles);
  const cache = resolve(root, cacheDir);
  const krasConfig = readKrasConfig({ port }, krasrc);

  await checkCliCompatibility(root);

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
    progress('Removing output directory ...');
    await removeDirectory(cache);
  }

  if (optimizeModules) {
    progress('Preparing modules ...');
    await patchModules(root, ignored);
  }

  setStandardEnvs({
    root,
    debugPiral: true,
    dependencies: externals,
    piral: name,
  });

  const bundler = setupBundler({
    type: 'piral',
    entryFiles,
    config: {
      publicUrl,
      logLevel,
      cacheDir: cache,
      scopeHoist,
      hmr,
      autoInstall,
    },
  });

  const injectorConfig = {
    active: true,
    handle: ['/'],
    bundler,
  };

  krasConfig.map['/'] = '';
  krasConfig.injectors = reorderInjectors(injectorName, injectorConfig, krasConfig.injectors);

  const krasServer = buildKrasWithCli(krasConfig);
  krasServer.removeAllListeners('open');
  krasServer.on('open', notifyServerOnline(bundler, krasConfig.api));

  await krasServer.start();
  openBrowser(open, port);
  await new Promise(resolve => krasServer.on('close', resolve));
}
