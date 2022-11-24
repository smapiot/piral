import { dirname, join, resolve } from 'path';
import { readKrasConfig, krasrc, buildKrasWithCli } from 'kras';
import { callPiralDebug } from '../bundler';
import { LogLevels } from '../types';
import {
  retrievePiletsInfo,
  retrievePiralRoot,
  openBrowser,
  checkCliCompatibility,
  notifyServerOnline,
  setLogLevel,
  progress,
  log,
  config,
  normalizePublicUrl,
  logDone,
  getDestination,
  createInitialKrasConfig,
  getAvailablePort,
  checkExistingDirectory,
  watcherTask,
} from '../common';

export interface DebugPiralOptions {
  /**
   * Sets the path to the entry file.
   */
  entry?: string;

  /**
   * Sets the target directory where the output of the bundling should be placed.
   */
  target?: string;

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
    beforeOnline?(e: any): Promise<void>;
    afterOnline?(e: any): Promise<void>;
    onEnd?(e: any): Promise<void>;
  };
}

export const debugPiralDefaults: DebugPiralOptions = {
  entry: './',
  target: './dist',
  port: config.port,
  publicUrl: '/',
  logLevel: LogLevels.info,
  open: config.openBrowser,
  hmr: true,
  optimizeModules: false,
};

export async function debugPiral(baseDir = process.cwd(), options: DebugPiralOptions = {}) {
  const {
    entry = debugPiralDefaults.entry,
    target = debugPiralDefaults.target,
    open = debugPiralDefaults.open,
    hmr = debugPiralDefaults.hmr,
    port: originalPort = debugPiralDefaults.port,
    publicUrl: originalPublicUrl = debugPiralDefaults.publicUrl,
    logLevel = debugPiralDefaults.logLevel,
    optimizeModules = debugPiralDefaults.optimizeModules,
    feed,
    _ = {},
    hooks = {},
    bundlerName,
  } = options;
  const publicUrl = normalizePublicUrl(originalPublicUrl);
  const fullBase = resolve(process.cwd(), baseDir);
  const port = await getAvailablePort(originalPort);
  setLogLevel(logLevel);

  await hooks.onBegin?.({ options, fullBase });

  await watcherTask(async (watcherContext) => {
    progress('Reading configuration ...');
    const entryFiles = await retrievePiralRoot(fullBase, entry);
    const targetDir = dirname(entryFiles);
    const { externals, name, root, ignored } = await retrievePiletsInfo(entryFiles);
    const piralInstances = [name];
    const dest = getDestination(entryFiles, resolve(fullBase, target));

    await checkCliCompatibility(root);

    await hooks.beforeBuild?.({ root, publicUrl, externals, entryFiles, piralInstances });

    const bundler = await callPiralDebug(
      {
        root,
        piralInstances,
        optimizeModules,
        hmr,
        externals: externals.map(m => m.name),
        publicUrl,
        entryFiles,
        logLevel,
        ignored,
        ...dest,
        _,
      },
      bundlerName,
    );

    bundler.ready().then(() => logDone(`Ready!`));

    bundler.on((args) => {
      hooks.afterBuild?.({ ...args, root, publicUrl, externals, entryFiles, piralInstances, bundler, ...dest });
    });

    bundler.start();

    const krasBaseConfig = resolve(fullBase, krasrc);
    const krasRootConfig = resolve(root, krasrc);
    const mocks = join(targetDir, 'mocks');
    const baseMocks = resolve(fullBase, 'mocks');
    const mocksExist = await checkExistingDirectory(mocks);
    const sources = [mocksExist ? mocks : undefined].filter(Boolean);
    const initial = createInitialKrasConfig(baseMocks, sources);
    const required = {
      injectors: {
        piral: {
          active: true,
          handle: ['/'],
          feed,
          publicUrl,
          bundler,
        },
        pilet: {
          active: false,
        },
      },
    };
    const krasConfig = readKrasConfig({ port, initial, required }, krasBaseConfig, krasRootConfig);

    log('generalVerbose_0004', `Using kras with configuration: ${JSON.stringify(krasConfig, undefined, 2)}`);

    const krasServer = buildKrasWithCli(krasConfig);
    krasServer.setMaxListeners(16);
    krasServer.removeAllListeners('open');
    krasServer.on('open', notifyServerOnline(publicUrl, krasConfig.api));

    await hooks.beforeOnline?.({ krasServer, krasConfig, open, port, publicUrl });
    await krasServer.start();
    openBrowser(open, port, publicUrl, !!krasConfig.ssl);
    await hooks.afterOnline?.({ krasServer, krasConfig, open, port, publicUrl });
    await new Promise((resolve) => krasServer.on('close', resolve));
  });

  await hooks.onEnd?.({});
}
