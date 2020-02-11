import { join, dirname, resolve } from 'path';
import { readKrasConfig, krasrc, buildKrasWithCli, defaultConfig } from 'kras';
import {
  retrievePiletData,
  setStandardEnvs,
  postProcess,
  debugPiletApi,
  openBrowser,
  reorderInjectors,
  notifyServerOnline,
  logInfo,
  patchModules,
  setupBundler,
  findEntryModule,
  defaultCacheDir,
  removeDirectory,
  PiletSchemaVersion,
} from '../common';

export interface DebugPiletOptions {
  logLevel?: 1 | 2 | 3;
  cacheDir?: string;
  entry?: string;
  app?: string;
  fresh?: boolean;
  open?: boolean;
  port?: number;
  scopeHoist?: boolean;
  hmr?: boolean;
  autoInstall?: boolean;
  optimizeModules?: boolean;
}

export const debugPiletDefaults = {
  logLevel: 3 as const,
  cacheDir: defaultCacheDir,
  entry: './src/index',
  fresh: false,
  open: false,
  port: 1234,
  scopeHoist: false,
  hmr: true,
  autoInstall: true,
  optimizeModules: true,
};

const injectorName = resolve(__dirname, '../injectors/pilet.js');

async function getOrMakeAppDir(
  emulator: boolean,
  appFile: string,
  externals: Array<string>,
  piral: string,
  logLevel: 1 | 2 | 3,
) {
  if (!emulator) {
    logInfo(`Preparing supplied Piral instance ...`);
    const packageJson = require.resolve(`${piral}/package.json`);
    const root = resolve(packageJson, '..');
    setStandardEnvs({
      root,
      production: true,
      debugPiral: true,
      debugPilet: true,
      dependencies: externals,
      piral,
    });
    const appBundler = setupBundler({
      type: 'piral',
      entryFiles: appFile,
      config: {
        watch: false,
        minify: true,
        sourceMaps: true,
        contentHash: true,
        publicUrl: './',
        logLevel,
        cacheDir: resolve(root, defaultCacheDir),
        scopeHoist: false,
        hmr: false,
        autoInstall: false,
      },
    });
    const bundle = await appBundler.bundle();
    return dirname(bundle.name);
  }

  return dirname(appFile);
}

export async function debugPilet(baseDir = process.cwd(), options: DebugPiletOptions = {}) {
  const {
    entry = debugPiletDefaults.entry,
    port = debugPiletDefaults.port,
    cacheDir = debugPiletDefaults.cacheDir,
    open = debugPiletDefaults.open,
    scopeHoist = debugPiletDefaults.scopeHoist,
    hmr = debugPiletDefaults.hmr,
    autoInstall = debugPiletDefaults.autoInstall,
    logLevel = debugPiletDefaults.logLevel,
    fresh = debugPiletDefaults.fresh,
    optimizeModules = debugPiletDefaults.optimizeModules,
    app,
  } = options;
  const entryFile = join(baseDir, entry);
  const targetDir = dirname(entryFile);
  const entryModule = await findEntryModule(entryFile, targetDir);
  const { peerDependencies, root, appPackage, appFile, ignored, emulator } = await retrievePiletData(targetDir, app);
  const externals = Object.keys(peerDependencies);
  const krasConfig = readKrasConfig({ port }, krasrc);
  const cache = resolve(root, cacheDir);
  const appDir = await getOrMakeAppDir(emulator, appFile, externals, appPackage.name, logLevel);

  if (krasConfig.directory === undefined) {
    krasConfig.directory = join(targetDir, 'mocks');
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
    await removeDirectory(cache);
  }

  if (optimizeModules) {
    logInfo('Preparing modules ...');
    await patchModules(root, cache, ignored);
  }

  setStandardEnvs({
    root,
    piral: appPackage.name,
  });

  const bundler = setupBundler({
    type: 'pilet',
    externals,
    targetDir,
    entryModule,
    config: {
      logLevel,
      hmr: false,
      minify: true,
      scopeHoist,
      publicUrl: './',
      cacheDir: cache,
      autoInstall,
    },
  });

  const api = debugPiletApi;
  const injectorConfig = {
    active: true,
    bundler,
    port,
    root,
    app: appDir,
    handle: ['/', api],
    api,
  };

  bundler.on('bundled', async bundle => {
    await postProcess(bundle, PiletSchemaVersion.directEval);

    if (hmr) {
      (bundler as any).emit('bundle-ready');
    }
  });

  krasConfig.map['/'] = '';
  krasConfig.map[api] = '';
  krasConfig.injectors = reorderInjectors(injectorName, injectorConfig, krasConfig.injectors);

  const krasServer = buildKrasWithCli(krasConfig);
  krasServer.removeAllListeners('open');
  krasServer.on('open', notifyServerOnline(bundler, krasConfig.api));

  await krasServer.start();
  openBrowser(open, port);
  await new Promise(resolve => krasServer.on('close', resolve));
}
