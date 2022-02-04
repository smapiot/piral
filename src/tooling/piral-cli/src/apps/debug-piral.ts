import { dirname, join, resolve } from 'path';
import { readKrasConfig, krasrc, buildKrasWithCli, defaultConfig } from 'kras';
import { callPiralDebug } from '../bundler';
import { LogLevels } from '../types';
import {
  retrievePiletsInfo,
  retrievePiralRoot,
  openBrowser,
  checkCliCompatibility,
  reorderInjectors,
  notifyServerOnline,
  setLogLevel,
  progress,
  log,
  config,
  normalizePublicUrl,
  logDone,
} from '../common';

export interface DebugPiralOptions {
  /**
   * Sets the path to the entry file.
   */
  entry?: string;

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
   * Sets the log level to use (1-5).
   */
  logLevel?: LogLevels;

  /**
   * Sets if the (system default) browser should be auto-opened.
   */
  open?: boolean;

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
    beforeOnline?(e: any): Promise<void>;
    afterOnline?(e: any): Promise<void>;
    onEnd?(e: any): Promise<void>;
  };
}

export const debugPiralDefaults: DebugPiralOptions = {
  entry: './',
  port: config.port,
  publicUrl: '/',
  logLevel: LogLevels.info,
  open: config.openBrowser,
  hmr: true,
  optimizeModules: false,
};

const injectorName = resolve(__dirname, '../injectors/piral.js');

export async function debugPiral(baseDir = process.cwd(), options: DebugPiralOptions = {}) {
  const {
    entry = debugPiralDefaults.entry,
    port = debugPiralDefaults.port,
    open = debugPiralDefaults.open,
    hmr = debugPiralDefaults.hmr,
    publicUrl: originalPublicUrl = debugPiralDefaults.publicUrl,
    logLevel = debugPiralDefaults.logLevel,
    optimizeModules = debugPiralDefaults.optimizeModules,
    _ = {},
    hooks = {},
    bundlerName,
  } = options;
  const publicUrl = normalizePublicUrl(originalPublicUrl);
  const fullBase = resolve(process.cwd(), baseDir);
  setLogLevel(logLevel);

  await hooks.onBegin?.({ options, fullBase });
  progress('Reading configuration ...');
  const entryFiles = await retrievePiralRoot(fullBase, entry);
  const { externals, name, root, ignored } = await retrievePiletsInfo(entryFiles);
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

  await hooks.beforeBuild?.({ root, publicUrl, externals, entryFiles, name });

  const bundler = await callPiralDebug(
    {
      root,
      piral: name,
      optimizeModules,
      hmr,
      externals,
      publicUrl,
      entryFiles,
      logLevel,
      ignored,
      _,
    },
    bundlerName,
  );

  bundler.ready().then(() => logDone(`Ready!`));

  bundler.on((args) => {
    hooks.afterBuild?.({ ...args, root, publicUrl, externals, entryFiles, name, bundler });
  });

  const { piral: piralInjector, ...otherInjectors } = krasConfig.injectors;
  const injectorConfig = {
    ...piralInjector,
    active: true,
    handle: ['/'],
    publicUrl,
    bundler,
  };

  krasConfig.map['/'] = '';
  krasConfig.injectors = reorderInjectors(injectorName, injectorConfig, otherInjectors);

  log('generalVerbose_0004', `Using kras with configuration: ${JSON.stringify(krasConfig, undefined, 2)}`);

  const krasServer = buildKrasWithCli(krasConfig);
  krasServer.removeAllListeners('open');
  krasServer.on('open', notifyServerOnline([bundler], publicUrl, krasConfig.api));

  await hooks.beforeOnline?.({ krasServer, krasConfig, open, port, publicUrl });
  await krasServer.start();
  openBrowser(open, port, publicUrl, !!krasConfig.ssl);
  await hooks.afterOnline?.({ krasServer, krasConfig, open, port, publicUrl });
  await new Promise((resolve) => krasServer.on('close', resolve));
  await hooks.onEnd?.({});
}
