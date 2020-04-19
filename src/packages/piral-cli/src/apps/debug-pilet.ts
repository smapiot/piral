import { join, dirname, resolve } from 'path';
import { readKrasConfig, krasrc, buildKrasWithCli, defaultConfig } from 'kras';
import { fork } from 'child_process';
import { LogLevels } from '../types';
import {
  retrievePiletData,
  setStandardEnvs,
  postProcess,
  debugPiletApi,
  openBrowser,
  reorderInjectors,
  notifyServerOnline,
  patchModules,
  setupBundler,
  findEntryModule,
  defaultCacheDir,
  removeDirectory,
  PiletSchemaVersion,
  getPiletSchemaVersion,
  setLogLevel,
  progress,
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
  emulator: boolean,
  appFile: string,
  externals: Array<string>,
  piral: string,
  logLevel: LogLevels,
) {
  if (!emulator) {
    const packageJson = require.resolve(`${piral}/package.json`);
    const cwd = resolve(packageJson, '..');
    return await new Promise(res => {
      const dbg = resolve(__dirname, '..', 'common', 'debug.js');
      const ps = fork(dbg, [], { cwd });
      ps.send({
        type: 'start',
        env: {
          production: true,
          debugPiral: true,
          debugPilet: true,
          dependencies: externals,
          piral,
        },
        appFile,
        logLevel,
      });
      ps.on('message', msg => {
        switch (msg.type) {
          case 'done':
            return res(msg.outDir);
        }
      });
    });
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
    const requireRef = await postProcess(bundle, version);

    if (hmr) {
      (bundler as any).emit('bundle-ready', { requireRef, version, root });
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
  setLogLevel(logLevel);
  progress('Reading configuration ...');
  const entryFile = join(baseDir, entry);
  const targetDir = dirname(entryFile);
  const entryModule = await findEntryModule(entryFile, targetDir);
  const { peerDependencies, root, appPackage, appFile, ignored, emulator } = await retrievePiletData(targetDir, app);
  const externals = Object.keys(peerDependencies);
  const cache = resolve(root, cacheDir);
  const version = getPiletSchemaVersion(schemaVersion);
  const krasConfig = readKrasConfig({ port }, krasrc);
  const api = debugPiletApi;

  if (fresh) {
    progress('Removing output directory ...');
    await removeDirectory(cache);
  }

  if (optimizeModules) {
    progress('Preparing modules ...');
    await patchModules(root, ignored);
  }

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
