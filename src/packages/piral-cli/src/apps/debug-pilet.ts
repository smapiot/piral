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
  getPiletSchemaVersion,
  LogLevels,
} from '../common';

export interface DebugPiletOptions {
  logLevel?: LogLevels;
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
  schemaVersion?: 'v0' | 'v1';
}

export const debugPiletDefaults: DebugPiletOptions = {
  logLevel: LogLevels.info,
  cacheDir: defaultCacheDir,
  entry: './src/index',
  fresh: false,
  open: false,
  port: 1234,
  scopeHoist: false,
  hmr: true,
  autoInstall: true,
  optimizeModules: true,
  schemaVersion: 'v1',
};

const injectorName = resolve(__dirname, '../injectors/pilet.js');

async function getOrMakeAppDir(
  baseDir: string,
  emulator: boolean,
  appFile: string,
  externals: Array<string>,
  piral: string,
  logLevel: LogLevels,
) {
  if (!emulator) {
    logInfo(`Preparing supplied Piral instance ...`);
    const outDir = resolve(baseDir, 'dist', 'app');
    const packageJson = require.resolve(`${piral}/package.json`);
    const root = resolve(packageJson, '..');
    const original = process.cwd();
    process.chdir(root);
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
        outDir,
        cacheDir: resolve(root, defaultCacheDir),
        scopeHoist: false,
        hmr: false,
        autoInstall: false,
      },
    });
    const bundle = await appBundler.bundle();
    process.chdir(original);
    return dirname(bundle.name);
  }

  return dirname(appFile);
}

async function bundlePilet(
  root: string,
  piral: string,
  hmr: boolean,
  scopeHoist: boolean,
  autoInstall: boolean,
  cacheDir: string,
  externals: Array<string>,
  targetDir: string,
  entryModule: string,
  logLevel: LogLevels,
  version: PiletSchemaVersion,
) {
  setStandardEnvs({
    root,
    piral,
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
      watch: true,
      scopeHoist,
      publicUrl: './',
      cacheDir,
      autoInstall,
    },
  });

  bundler.on('bundled', async bundle => {
    await postProcess(bundle, version);

    if (hmr) {
      (bundler as any).emit('bundle-ready');
    }
  });

  return bundler;
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
    schemaVersion = debugPiletDefaults.schemaVersion,
    app,
  } = options;
  const entryFile = join(baseDir, entry);
  const targetDir = dirname(entryFile);
  const entryModule = await findEntryModule(entryFile, targetDir);
  const { peerDependencies, root, appPackage, appFile, ignored, emulator } = await retrievePiletData(targetDir, app);
  const externals = Object.keys(peerDependencies);
  const cache = resolve(root, cacheDir);
  const version = getPiletSchemaVersion(schemaVersion);

  if (fresh) {
    await removeDirectory(cache);
  }

  if (optimizeModules) {
    logInfo('Preparing modules ...');
    await patchModules(root, ignored);
  }

  const appDir = await getOrMakeAppDir(root, emulator, appFile, externals, appPackage.name, logLevel);
  const krasConfig = readKrasConfig({ port }, krasrc);
  const api = debugPiletApi;

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

  const bundler = await bundlePilet(
    root,
    appPackage.name,
    hmr,
    scopeHoist,
    autoInstall,
    cache,
    externals,
    targetDir,
    entryModule,
    logLevel,
    version,
  );
  const injectorConfig = {
    active: true,
    bundler,
    port,
    root,
    app: appDir,
    handle: ['/', api],
    api,
  };

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
