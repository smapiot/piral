import { join, dirname, resolve, relative, basename } from 'path';
import { callDebugPiralFromMonoRepo, callPiletDebug } from '../bundler';
import { AppDefinition, LogLevels, NetworkSpec, PiletSchemaVersion } from '../types';
import {
  checkExistingDirectory,
  retrievePiletData,
  retrievePiletsInfo,
  config,
  setLogLevel,
  progress,
  matchAnyPilet,
  fail,
  log,
  logDone,
  cpuCount,
  concurrentWorkers,
  normalizePublicUrl,
  combinePiletExternals,
  watcherTask,
  flattenExternals,
  validateSharedDependencies,
  configurePlatform,
  packageJson,
  piletJson,
  defaultSchemaVersion,
  ensure,
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
   * Forces the set port to be used, otherwise exists with an error.
   */
  strictPort?: boolean;

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
   * Sets the relative path to the krasrc, if any.
   */
  krasrc?: string;

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
  strictPort: config.strictPort,
  publicUrl: '/',
  hmr: true,
  krasrc: undefined,
  optimizeModules: false,
  schemaVersion: undefined,
  concurrency: cpuCount,
};

interface AppInfo {
  apps: Array<AppDefinition>;
  root: string;
  mocks: string;
  publicUrl: string;
  externals: Array<string>;
}

type PiralInstanceInfo = [appDir: string, appPort: number];

function byPort(a: PiralInstanceInfo, b: PiralInstanceInfo) {
  return a[1] - b[1];
}

function getOrMakeApps({ apps, publicUrl }: AppInfo, logLevel: LogLevels) {
  return Promise.all(
    apps.map(async ({ emulator, appFile, appPackage, appPort }): Promise<PiralInstanceInfo> => {
      if (!emulator) {
        const piralInstances = [appPackage.name];
        const { externals, root, ignored } = await retrievePiletsInfo(appFile);
        const { dir } = await callDebugPiralFromMonoRepo({
          root,
          optimizeModules: false,
          publicUrl,
          ignored,
          externals: flattenExternals(externals),
          piralInstances,
          entryFiles: appFile,
          logLevel,
          _: {},
        });
        return [dir, appPort];
      }

      return [dirname(appFile), appPort];
    }),
  );
}

function checkSanity(pilets: Array<AppInfo>) {
  for (let i = 1; i < pilets.length; i++) {
    const previous = pilets[i - 1];
    const current = pilets[i];
    const previousInstances = previous.apps;
    const currentInstances = current.apps;
    const previousInstancesNames = previousInstances
      .map((m) => m.appPackage.name)
      .sort()
      .join(', ');
    const currentInstancesNames = currentInstances
      .map((m) => m.appPackage.name)
      .sort()
      .join(', ');
    const previousInstancesVersions = previousInstances.map((m) => m.appPackage.version).join(', ');
    const currentInstancesVersions = currentInstances.map((m) => m.appPackage.version).join(', ');

    if (previousInstancesNames !== currentInstancesNames) {
      return log('piletMultiDebugAppShellDifferent_0301', previousInstancesNames, currentInstancesNames);
    } else if (previousInstancesVersions !== currentInstancesVersions) {
      return log('piletMultiDebugAppShellVersions_0302', previousInstancesVersions, currentInstancesVersions);
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
    open = debugPiletDefaults.open,
    hmr = debugPiletDefaults.hmr,
    port: originalPort = debugPiletDefaults.port,
    strictPort = debugPiletDefaults.strictPort,
    publicUrl: originalPublicUrl = debugPiletDefaults.publicUrl,
    logLevel = debugPiletDefaults.logLevel,
    concurrency = debugPiletDefaults.concurrency,
    krasrc: customkrasrc = debugPiletDefaults.krasrc,
    optimizeModules = debugPiletDefaults.optimizeModules,
    schemaVersion: originalSchemaVersion = debugPiletDefaults.schemaVersion,
    _ = {},
    hooks = {},
    bundlerName,
    app,
    appInstanceDir,
    feed,
  } = options;

  ensure('baseDir', baseDir, 'string');
  ensure('_', _, 'object');
  ensure('hooks', hooks, 'object');
  ensure('target', target, 'string');
  ensure('publicUrl', originalPublicUrl, 'string');
  ensure('port', originalPort, ['number', 'undefined']);

  const publicUrl = normalizePublicUrl(originalPublicUrl);
  const fullBase = resolve(process.cwd(), baseDir);
  const networks: Array<NetworkSpec> = [];
  setLogLevel(logLevel);

  await hooks.onBegin?.({ options, fullBase });

  progress('Reading configuration ...');

  const entryList = Array.isArray(entry) ? entry : [entry];
  const multi = entryList.length > 1 || entryList[0].indexOf('*') !== -1;
  log('generalDebug_0003', `Looking for (${multi ? 'multi' : 'single'}) "${entryList.join('", "')}" in "${fullBase}".`);

  const allEntries = await matchAnyPilet(fullBase, entryList);
  log('generalDebug_0003', `Found the following entries: ${allEntries.join(', ')}`);

  if (allEntries.length === 0) {
    fail('entryFileMissing_0077');
  }

  const maxListeners = Math.max(2 + allEntries.length * 2, 16);

  process.stderr?.setMaxListeners(maxListeners);
  process.stdout?.setMaxListeners(maxListeners);
  process.stdin?.setMaxListeners(maxListeners);

  const buildRef = await watcherTask(async (watcherContext) => {
    const pilets = await concurrentWorkers(allEntries, concurrency, async (entryModule) => {
      const targetDir = dirname(entryModule);
      const { peerDependencies, peerModules, root, apps, ignored, importmap, schema } = await retrievePiletData(
        targetDir,
        app,
      );
      const schemaVersion = originalSchemaVersion || schema || config.schemaVersion || defaultSchemaVersion;
      const piralInstances = apps.map((m) => m.appPackage.name);
      const externals = combinePiletExternals(piralInstances, peerDependencies, peerModules, importmap);
      const mocks = join(targetDir, 'mocks');
      const dest = resolve(root, target);
      const outDir = dirname(dest);
      const outFile = basename(dest);
      const mocksExists = await checkExistingDirectory(mocks);

      validateSharedDependencies(importmap);

      await hooks.beforeBuild?.({ root, publicUrl, importmap, entryModule, schemaVersion });

      const bundler = await callPiletDebug(
        {
          root,
          piralInstances,
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

      watcherContext.watch(join(root, packageJson));
      watcherContext.watch(join(root, piletJson));
      watcherContext.onClean(() => bundler.stop());

      bundler.on((args) => {
        hooks.afterBuild?.({
          ...args,
          root,
          publicUrl,
          importmap,
          entryModule,
          schemaVersion,
          bundler,
          outFile,
          outDir,
        });
      });

      return {
        apps,
        publicUrl,
        externals,
        bundler,
        mocks: mocksExists ? mocks : undefined,
        root,
      };
    });

    // sanity check see #250
    checkSanity(pilets);

    Promise.all(pilets.map((p) => p.bundler.ready())).then(() => logDone(`Ready!`));

    return { pilets };
  });

  const watcherRef = await watcherTask(async (watcherContext) => {
    const { pilets } = buildRef.data;

    await hooks.beforeApp?.({ appInstanceDir, pilets });

    const appInstances: Array<PiralInstanceInfo> = appInstanceDir
      ? [[appInstanceDir, 0]]
      : await getOrMakeApps(pilets[0], logLevel);

    pilets.forEach((p) => p.bundler.start());

    if (appInstances.length === 0) {
      appInstances.push([undefined, originalPort]);
    }

    await Promise.all(
      appInstances.sort(byPort).map(async ([appDir, appPort], i) => {
        const platform = configurePlatform();

        if (networks.length === i) {
          networks.push({
            port: appPort || originalPort + i,
            type: strictPort ? 'wanted' : 'proposed',
          });
        }

        const update = await platform.startModule({
          appDir,
          pilets,
          customkrasrc,
          feed,
          fullBase,
          hooks,
          open,
          network: networks[i],
          publicUrl,
          maxListeners,
          registerEnd(cb) {
            return watcherContext.onClean(cb);
          },
          registerWatcher(file) {
            return watcherContext.watch(file);
          },
        });

        const handleUpdate = () => {
          const { pilets } = buildRef.data;
          pilets.forEach((p) => p.bundler.start());
          update({ pilets });
        };

        buildRef.on(handleUpdate);

        watcherContext.onClean(() => buildRef.off(handleUpdate));
      }),
    );

    await hooks.afterApp?.({ appInstanceDir, pilets });
  });

  await Promise.all([watcherRef.end]);

  await hooks.onEnd?.({});
}
