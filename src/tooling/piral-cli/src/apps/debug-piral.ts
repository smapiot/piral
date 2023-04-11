import { dirname, join, resolve } from 'path';
import { callPiralDebug } from '../bundler';
import { LogLevels } from '../types';
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
    publicUrl: originalPublicUrl = debugPiralDefaults.publicUrl,
    logLevel = debugPiralDefaults.logLevel,
    krasrc: customkrasrc = debugPiralDefaults.krasrc,
    optimizeModules = debugPiralDefaults.optimizeModules,
    feed,
    _ = {},
    hooks = {},
    bundlerName,
  } = options;
  const publicUrl = normalizePublicUrl(originalPublicUrl);
  const fullBase = resolve(process.cwd(), baseDir);
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

    watcherContext.watch(join(root, 'package.json'));
    watcherContext.watch(join(root, 'piral.json'));

    const bundler = await callPiralDebug(
      {
        root,
        piralInstances,
        optimizeModules,
        hmr,
        externals: externals.map((m) => m.name),
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
    return { bundler, entryFiles, root };
  });

  const platform = configurePlatform();

  const serverRef = await watcherTask(async (watcherContext) => {
    watcherContext.dependOn(buildRef);
    const { bundler, entryFiles, root } = buildRef.data;
    const targetDir = dirname(entryFiles);

    await platform.startShell({
      bundler,
      customkrasrc,
      feed,
      fullBase,
      hooks,
      open,
      originalPort,
      publicUrl,
      root,
      targetDir,
      registerEnd(cb) {
        return watcherContext.onClean(cb);
      },
      registerWatcher(file) {
        return watcherContext.watch(file);
      }
    });
  });

  await Promise.all([buildRef.end, serverRef.end]);

  await hooks.onEnd?.({});
}
