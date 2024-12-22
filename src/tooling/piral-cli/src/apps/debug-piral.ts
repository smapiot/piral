import { dirname, join, resolve } from 'path';
import { callPiralDebug } from '../bundler';
import { LogLevels, NetworkSpec } from '../types';
import {
  retrievePiletsInfo,
  retrievePiralRoot,
  checkCliCompatibility,
  setLogLevel,
  progress,
  config,
  normalizePublicUrl,
  configurePlatform,
  logDone,
  getDestination,
  watcherTask,
  validateSharedDependencies,
  piralJson,
  packageJson,
  flattenExternals,
  ensure,
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
   * Forces the set port to be used, otherwise exists with an error.
   */
  strictPort?: boolean;

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
   * Sets the relative path to the krasrc, if any.
   */
  krasrc?: string;

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
  strictPort: config.strictPort,
  publicUrl: '/',
  logLevel: LogLevels.info,
  open: config.openBrowser,
  hmr: true,
  krasrc: undefined,
  optimizeModules: false,
};

export async function debugPiral(baseDir = process.cwd(), options: DebugPiralOptions = {}) {
  const {
    entry = debugPiralDefaults.entry,
    target = debugPiralDefaults.target,
    open = debugPiralDefaults.open,
    hmr = debugPiralDefaults.hmr,
    port: originalPort = debugPiralDefaults.port,
    strictPort = debugPiralDefaults.strictPort,
    publicUrl: originalPublicUrl = debugPiralDefaults.publicUrl,
    logLevel = debugPiralDefaults.logLevel,
    krasrc: customkrasrc = debugPiralDefaults.krasrc,
    optimizeModules = debugPiralDefaults.optimizeModules,
    feed,
    _ = {},
    hooks = {},
    bundlerName,
  } = options;

  ensure('baseDir', baseDir, 'string');
  ensure('publicUrl', originalPublicUrl, 'string');
  ensure('port', originalPort, ['number', 'undefined']);
  ensure('entry', entry, 'string');
  ensure('_', _, 'object');
  ensure('hooks', hooks, 'object');
  ensure('target', target, 'string');

  const publicUrl = normalizePublicUrl(originalPublicUrl);
  const fullBase = resolve(process.cwd(), baseDir);
  const network: NetworkSpec = {
    port: originalPort,
    type: strictPort ? 'wanted' : 'proposed',
  };
  setLogLevel(logLevel);

  await hooks.onBegin?.({ options, fullBase });

  progress('Reading configuration ...');

  const buildRef = await watcherTask(async (watcherContext) => {
    const entryFiles = await retrievePiralRoot(fullBase, entry);
    const { externals, name, root, ignored } = await retrievePiletsInfo(entryFiles);
    const piralInstances = [name];
    const dest = getDestination(entryFiles, resolve(fullBase, target));

    await checkCliCompatibility(root);

    validateSharedDependencies(externals);

    await hooks.beforeBuild?.({ root, publicUrl, externals, entryFiles, piralInstances });

    const bundler = await callPiralDebug(
      {
        root,
        piralInstances,
        optimizeModules,
        hmr,
        externals: flattenExternals(externals),
        publicUrl,
        entryFiles,
        logLevel,
        ignored,
        ...dest,
        _,
      },
      bundlerName,
    );

    watcherContext.watch(join(root, packageJson));
    watcherContext.watch(join(root, piralJson));
    watcherContext.onClean(() => bundler.stop());

    bundler.ready().then(() => logDone(`Ready!`));

    bundler.on((args) => {
      hooks.afterBuild?.({ ...args, root, publicUrl, externals, entryFiles, piralInstances, bundler, ...dest });
    });

    bundler.start();
    return { bundler, entryFiles, root };
  });

  const platform = configurePlatform();

  const serverRef = await watcherTask(async (watcherContext) => {
    const { bundler, entryFiles, root } = buildRef.data;
    const targetDir = dirname(entryFiles);

    const update = await platform.startShell({
      bundler,
      customkrasrc,
      feed,
      fullBase,
      hooks,
      open,
      network,
      publicUrl,
      root,
      targetDir,
      registerEnd(cb) {
        return watcherContext.onClean(cb);
      },
      registerWatcher(file) {
        return watcherContext.watch(file);
      },
    });

    const handleUpdate = () => {
      const { bundler } = buildRef.data;
      update({ bundler });
    };

    buildRef.on(handleUpdate);
    watcherContext.onClean(() => buildRef.off(handleUpdate));
  });

  await Promise.all([buildRef.end, serverRef.end]);

  await hooks.onEnd?.({});
}
