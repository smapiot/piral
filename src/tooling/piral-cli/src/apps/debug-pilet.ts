import { join, dirname, resolve, relative, basename } from 'path';
import { readKrasConfig, krasrc, buildKrasWithCli, defaultConfig } from 'kras';
import { callDebugPiralFromMonoRepo, callPiletDebug } from '../bundler';
import { LogLevels, PiletSchemaVersion } from '../types';
import {
  checkExistingDirectory,
  retrievePiletData,
  retrievePiletsInfo,
  config,
  openBrowser,
  reorderInjectors,
  notifyServerOnline,
  setLogLevel,
  progress,
  matchAnyPilet,
  fail,
  log,
  logDone,
  cpuCount,
  concurrentWorkers,
  normalizePublicUrl,
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
   * The target file of bundling.
   * @example './dist/index.js'
   */
  target?: string;

  /**
   * Overrides the name of the app shell to use.
   * By default the app is inferred from the package.json.
   */
  app?: string;

  /**
   * Overrides the directory of the app to serve when
   * debugging.
   */
  appInstanceDir?: string;

  /**
   * Sets if the (system default) browser should be auto-opened.
   */
  open?: boolean;

  /**
   * Sets the port to use for the debug server.
   */
  port?: number;

  /**
   * Sets the publicUrl to use.
   * By default, the server is assumed to be at root "/".
   */
  publicUrl?: string;

  /**
   * Sets the maximum number of parallel build processes.
   */
  concurrency?: number;

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
   * The URL of a pilet feed(s) used to include locally missing pilets.
   */
  feed?: string | Array<string>;

  /**
   * Additional arguments for a specific bundler.
   */
  _?: Record<string, any>;

  /**
   * Hooks to be triggered at various stages.
   */
  hooks?: {
    onBegin?(e: any): Promise<void>;
    beforeBuild?(e: any): Promise<void>;
    afterBuild?(e: any): Promise<void>;
    beforeApp?(e: any): Promise<void>;
    afterApp?(e: any): Promise<void>;
    beforeOnline?(e: any): Promise<void>;
    afterOnline?(e: any): Promise<void>;
    onEnd?(e: any): Promise<void>;
  };
}

export const debugPiletDefaults: DebugPiletOptions = {
  logLevel: LogLevels.info,
  target: './dist/index.js',
  entry: './src/index',
  open: config.openBrowser,
  port: config.port,
  publicUrl: '/',
  hmr: true,
  optimizeModules: false,
  schemaVersion: config.schemaVersion,
  concurrency: cpuCount,
};

const injectorName = resolve(__dirname, '../injectors/pilet.js');

interface AppInfo {
  emulator: boolean;
  appFile: string;
  publicUrl: string;
  appVersion: string;
  externals: Array<string>;
  piral: string;
}

async function getOrMakeAppDir({ emulator, piral, appFile, publicUrl }: AppInfo, logLevel: LogLevels) {
  if (!emulator) {
    const { externals, root, ignored } = await retrievePiletsInfo(appFile);
    const { dir } = await callDebugPiralFromMonoRepo({
      root,
      optimizeModules: false,
      ignored,
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
    target = debugPiletDefaults.target,
    port = debugPiletDefaults.port,
    open = debugPiletDefaults.open,
    hmr = debugPiletDefaults.hmr,
    publicUrl: originalPublicUrl = debugPiletDefaults.publicUrl,
    logLevel = debugPiletDefaults.logLevel,
    concurrency = debugPiletDefaults.concurrency,
    optimizeModules = debugPiletDefaults.optimizeModules,
    schemaVersion = debugPiletDefaults.schemaVersion,
    _ = {},
    hooks = {},
    bundlerName,
    app,
    appInstanceDir,
    feed,
  } = options;
  const publicUrl = normalizePublicUrl(originalPublicUrl);
  const fullBase = resolve(process.cwd(), baseDir);
  setLogLevel(logLevel);

  await hooks.onBegin?.({ options, fullBase });
  progress('Reading configuration ...');
  const krasConfig = readKrasConfig({ port }, krasrc);
  const api = `${publicUrl}${config.piletApi.replace(/^\/+/, '')}`;
  const entryList = Array.isArray(entry) ? entry : [entry];
  const multi = entryList.length > 1 || entryList[0].indexOf('*') !== -1;
  log('generalDebug_0003', `Looking for (${multi ? 'multi' : 'single'}) "${entryList.join('", "')}" in "${fullBase}".`);

  const allEntries = await matchAnyPilet(fullBase, entryList);
  const maxListeners = Math.max(2 + allEntries.length * 2, 16);
  log('generalDebug_0003', `Found the following entries: ${allEntries.join(', ')}`);

  if (krasConfig.sources === undefined) {
    krasConfig.sources = [];
  }

  if (allEntries.length === 0) {
    fail('entryFileMissing_0077');
  }

  process.stderr.setMaxListeners(maxListeners);
  process.stdout.setMaxListeners(maxListeners);
  process.stdin.setMaxListeners(maxListeners);

  const pilets = await concurrentWorkers(allEntries, concurrency, async (entryModule) => {
    const targetDir = dirname(entryModule);
    const { peerDependencies, peerModules, root, appPackage, appFile, ignored, emulator, importmap } =
      await retrievePiletData(targetDir, app);
    const externals = [...Object.keys(peerDependencies), ...peerModules];
    const mocks = join(targetDir, 'mocks');
    const dest = resolve(root, target);
    const outDir = dirname(dest);
    const outFile = basename(dest);
    const exists = await checkExistingDirectory(mocks);

    if (exists) {
      if (krasConfig.directory === undefined) {
        krasConfig.directory = mocks;
      }

      krasConfig.sources.push(mocks);
    }

    await hooks.beforeBuild?.({ root, publicUrl, importmap, entryModule, schemaVersion });

    const bundler = await callPiletDebug(
      {
        root,
        piral: appPackage.name,
        optimizeModules,
        hmr,
        externals,
        targetDir,
        importmap,
        outFile,
        outDir,
        entryModule: `./${relative(root, entryModule)}`,
        logLevel,
        version: schemaVersion,
        ignored,
        _,
      },
      bundlerName,
    );

    bundler.on((args) => {
      hooks.afterBuild?.({ ...args, root, publicUrl, importmap, entryModule, schemaVersion, bundler, outFile, outDir });
    });

    return {
      emulator,
      appFile,
      publicUrl,
      appVersion: appPackage.version,
      externals,
      piral: appPackage.name,
      bundler,
      root,
    };
  });

  // sanity check see #250
  checkSanity(pilets);

  await hooks.beforeApp?.({ appInstanceDir, pilets });
  const appDir = appInstanceDir || (await getOrMakeAppDir(pilets[0], logLevel));
  await hooks.afterApp?.({ appInstanceDir, pilets });

  Promise.all(pilets.map((p) => p.bundler.ready())).then(() => logDone(`Ready!`));

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

  const { pilet: piletInjector, ...otherInjectors } = krasConfig.injectors;
  const injectorConfig = {
    meta: 'debug-meta.json',
    feed,
    ...piletInjector,
    active: true,
    pilets,
    app: appDir,
    publicUrl,
    handle: ['/', api],
    api,
  };

  krasConfig.map['/'] = '';
  krasConfig.map[api] = '';

  krasConfig.injectors = reorderInjectors(injectorName, injectorConfig, otherInjectors);

  log('generalVerbose_0004', `Using kras with configuration: ${JSON.stringify(krasConfig, undefined, 2)}`);

  const krasServer = buildKrasWithCli(krasConfig);
  krasServer.setMaxListeners(maxListeners);
  krasServer.removeAllListeners('open');
  krasServer.on(
    'open',
    notifyServerOnline(
      pilets.map((p) => p.bundler),
      publicUrl,
      krasConfig.api,
    ),
  );

  await hooks.beforeOnline?.({ krasServer, krasConfig, open, port, api, feed, pilets, publicUrl });
  await krasServer.start();
  openBrowser(open, port, publicUrl, !!krasConfig.ssl);
  await hooks.afterOnline?.({ krasServer, krasConfig, open, port, api, feed, pilets, publicUrl });
  await new Promise((resolve) => krasServer.on('close', resolve));
  await hooks.onEnd?.({});
}
