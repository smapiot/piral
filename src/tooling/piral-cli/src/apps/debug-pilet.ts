import { join, dirname, resolve } from 'path';
import { readKrasConfig, krasrc, buildKrasWithCli, defaultConfig } from 'kras';
import { callDebugPiralFromMonoRepo, callPiletDebug } from '../bundler';
import { LogLevels, PiletSchemaVersion } from '../types';
import {
  checkExistingDirectory,
  retrievePiletData,
  config,
  openBrowser,
  reorderInjectors,
  notifyServerOnline,
  findEntryModule,
  defaultCacheDir,
  removeDirectory,
  setLogLevel,
  progress,
  matchAny,
  fail,
  log,
} from '../common';

export interface DebugPiletOptions {
  logLevel?: LogLevels;
  cacheDir?: string;
  entry?: string | Array<string>;
  app?: string;
  fresh?: boolean;
  open?: boolean;
  port?: number;
  scopeHoist?: boolean;
  hmr?: boolean;
  autoInstall?: boolean;
  optimizeModules?: boolean;
  schemaVersion?: PiletSchemaVersion;
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

interface AppInfo {
  emulator: boolean;
  appFile: string;
  appVersion: string;
  externals: Array<string>;
  piral: string;
}

async function getOrMakeAppDir({ emulator, piral, externals, appFile }: AppInfo, logLevel: LogLevels) {
  if (!emulator) {
    const packageJson = require.resolve(`${piral}/package.json`);
    const cwd = resolve(packageJson, '..');
    const { dir } = await callDebugPiralFromMonoRepo({
      root: cwd,
      optimizeModules: false,
      ignored: [],
      externals,
      piral,
      entryFiles: appFile,
      logLevel,
    });
    return dir;
  }

  return dirname(appFile);
}

function checkSanity(pilets: Array<AppInfo>) {
  for (let i = 1; i < pilets.length; i++) {
    const previous = pilets[i - 1];
    const current = pilets[i];

    if (previous.piral !== current.piral) {
      return log('piletMultiDebugAppShellDifferent_0301', previous.piral, current.piral);
    } else if (previous.appVersion !== current.appVersion) {
      return log('piletMultiDebugAppShellVersions_0302', previous.appVersion, current.appVersion);
    } else if (previous.externals.length !== current.externals.length) {
      return log('piletMultiDebugExternalsDifferent_0303', previous.externals, current.externals);
    } else if (previous.externals.some(m => !current.externals.includes(m))) {
      return log('piletMultiDebugExternalsDifferent_0303', previous.externals, current.externals);
    }
  }
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
  const krasConfig = readKrasConfig({ port }, krasrc);
  const api = config.piletApi;
  const entryList = Array.isArray(entry) ? entry : [entry];
  const multi = entryList.length > 1 || entryList[0].indexOf('*') !== -1;
  log('generalDebug_0003', `Looking for (${multi ? 'multi' : 'single'}) "${entryList.join('", "')}" in "${baseDir}".`);
  const allEntries = multi ? await matchAny(baseDir, entryList) : entryList;
  log('generalDebug_0003', `Found the following entries: ${allEntries.join(', ')}`);

  if (krasConfig.sources === undefined) {
    krasConfig.sources = [];
  }

  if (allEntries.length === 0) {
    fail('entryFileMissing_0077');
  }

  const pilets = await Promise.all(
    allEntries.map(async entry => {
      const entryFile = join(baseDir, entry);
      const targetDir = dirname(entryFile);
      const entryModule = await findEntryModule(entryFile, targetDir);
      const { peerDependencies, root, appPackage, appFile, ignored, emulator } = await retrievePiletData(
        targetDir,
        app,
      );
      const externals = Object.keys(peerDependencies);
      const cache = resolve(root, cacheDir);
      const mocks = join(targetDir, 'mocks');
      const exists = await checkExistingDirectory(mocks);

      if (fresh) {
        progress('Removing output directory ...');
        await removeDirectory(cache);
      }

      if (exists) {
        if (krasConfig.directory === undefined) {
          krasConfig.directory = mocks;
        }

        krasConfig.sources.push(mocks);
      }

      const bundler = await callPiletDebug({
        root,
        piral: appPackage.name,
        optimizeModules,
        hmr,
        scopeHoist,
        autoInstall,
        cacheDir: cache,
        externals,
        targetDir,
        entryModule,
        logLevel,
        version: schemaVersion,
        ignored,
      });

      return {
        emulator,
        appFile,
        appVersion: appPackage.version,
        externals,
        piral: appPackage.name,
        bundler,
        root,
      };
    }),
  );

  // sanity check see #250
  checkSanity(pilets);

  const appDir = await getOrMakeAppDir(pilets[0], logLevel);

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

  const injectorConfig = {
    active: true,
    pilets,
    app: appDir,
    handle: ['/', api],
    api,
  };

  krasConfig.map['/'] = '';
  krasConfig.map[api] = '';
  krasConfig.injectors = reorderInjectors(injectorName, injectorConfig, krasConfig.injectors);

  const krasServer = buildKrasWithCli(krasConfig);
  krasServer.removeAllListeners('open');
  krasServer.on(
    'open',
    notifyServerOnline(
      pilets.map(p => p.bundler),
      krasConfig.api,
    ),
  );

  await krasServer.start();
  openBrowser(open, port);
  await new Promise(resolve => krasServer.on('close', resolve));
}
