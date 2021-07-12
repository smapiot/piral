import { join, dirname, resolve, relative } from 'path';
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
  setLogLevel,
  progress,
  matchAny,
  fail,
  log,
} from '../common';

export interface DebugPiletOptions {
  /**
   * Sets the log level to use (1-5).
   */
  logLevel?: LogLevels;

  /**
   * Sets the paths to the entry modules.
   */
  entry?: string | Array<string>;

  /**
   * Overrides the name of the app shell to use.
   * By default the app is inferred from the package.json.
   */
  app?: string;

  /**
   * Sets if the (system default) browser should be auto-opened.
   */
  open?: boolean;

  /**
   * Sets the port to use for the debug server.
   */
  port?: number;

  /**
   * Defines if hot module reloading (HMR) should be integrated for faster debugging.
   */
  hmr?: boolean;

  /**
   * Sets the bundler to use for building, if any specific.
   */
  bundlerName?: string;

  /**
   * States if the node modules should be included for target transpilation
   */
  optimizeModules?: boolean;

  /**
   * The schema to be used when bundling the pilets.
   * @example 'v1'
   */
  schemaVersion?: PiletSchemaVersion;

  /**
   * The URL of a pilet feed used to include locally missing pilets.
   */
  feed?: string;

  /**
   * Additional arguments for a specific bundler.
   */
  _?: Record<string, any>;
}

export const debugPiletDefaults: DebugPiletOptions = {
  logLevel: LogLevels.info,
  entry: './src/index',
  open: false,
  port: 1234,
  hmr: true,
  optimizeModules: false,
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
      _: {},
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
    } else if (previous.externals.some((m) => !current.externals.includes(m))) {
      return log('piletMultiDebugExternalsDifferent_0303', previous.externals, current.externals);
    }
  }
}

export async function debugPilet(baseDir = process.cwd(), options: DebugPiletOptions = {}) {
  const {
    entry = debugPiletDefaults.entry,
    port = debugPiletDefaults.port,
    open = debugPiletDefaults.open,
    hmr = debugPiletDefaults.hmr,
    logLevel = debugPiletDefaults.logLevel,
    optimizeModules = debugPiletDefaults.optimizeModules,
    schemaVersion = debugPiletDefaults.schemaVersion,
    _ = {},
    bundlerName,
    app,
    feed,
  } = options;
  setLogLevel(logLevel);
  progress('Reading configuration ...');
  const krasConfig = readKrasConfig({ port }, krasrc);
  const api = config.piletApi;
  const entryList = Array.isArray(entry) ? entry : [entry];
  const multi = entryList.length > 1 || entryList[0].indexOf('*') !== -1;
  log('generalDebug_0003', `Looking for (${multi ? 'multi' : 'single'}) "${entryList.join('", "')}" in "${baseDir}".`);

  const allEntries = await matchAny(baseDir, entryList);
  log('generalDebug_0003', `Found the following entries: ${allEntries.join(', ')}`);

  if (krasConfig.sources === undefined) {
    krasConfig.sources = [];
  }

  if (allEntries.length === 0) {
    fail('entryFileMissing_0077');
  }

  const pilets = await Promise.all(
    allEntries.map(async (entryModule) => {
      const targetDir = dirname(entryModule);
      const { peerDependencies, peerModules, root, appPackage, appFile, ignored, emulator } = await retrievePiletData(
        targetDir,
        app,
      );
      const externals = [...Object.keys(peerDependencies), ...peerModules];
      const mocks = join(targetDir, 'mocks');
      const exists = await checkExistingDirectory(mocks);

      if (exists) {
        if (krasConfig.directory === undefined) {
          krasConfig.directory = mocks;
        }

        krasConfig.sources.push(mocks);
      }

      const bundler = await callPiletDebug(
        {
          root,
          piral: appPackage.name,
          optimizeModules,
          hmr,
          externals,
          targetDir,
          entryModule: `./${relative(root, entryModule)}`,
          logLevel,
          version: schemaVersion,
          ignored,
          _,
        },
        bundlerName,
      );

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
    feed,
  };

  krasConfig.map['/'] = '';
  krasConfig.map[api] = '';
  krasConfig.injectors = reorderInjectors(injectorName, injectorConfig, krasConfig.injectors);

  log('generalVerbose_0004', `Using kras with configuration: ${JSON.stringify(krasConfig, undefined, 2)}`);

  const krasServer = buildKrasWithCli(krasConfig);
  krasServer.removeAllListeners('open');
  krasServer.on(
    'open',
    notifyServerOnline(
      pilets.map((p) => p.bundler),
      krasConfig.api,
    ),
  );

  await krasServer.start();
  openBrowser(open, port);
  await new Promise((resolve) => krasServer.on('close', resolve));
}
