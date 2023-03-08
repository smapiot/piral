import { join, dirname, resolve, relative, basename } from 'path';
import { readKrasConfig, krasrc, buildKrasWithCli } from 'kras';
import { callDebugPiralFromMonoRepo, callPiletDebug } from '../bundler';
import { AppDefinition, LogLevels, PiletSchemaVersion } from '../types';
import {
  checkExistingDirectory,
  retrievePiletData,
  retrievePiletsInfo,
  config,
  openBrowser,
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
  findFile,
  createInitialKrasConfig,
  getAvailablePort,
  combinePiletExternals,
  watcherTask,
  flattenExternals,
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
  const publicUrl = normalizePublicUrl(originalPublicUrl);
  const fullBase = resolve(process.cwd(), baseDir);
  setLogLevel(logLevel);

  await hooks.onBegin?.({ options, fullBase });

  await watcherTask(async (watcherContext) => {
    progress('Reading configuration ...');
    const api = `${publicUrl}${config.piletApi.replace(/^\/+/, '')}`;
    const entryList = Array.isArray(entry) ? entry : [entry];
    const multi = entryList.length > 1 || entryList[0].indexOf('*') !== -1;
    log(
      'generalDebug_0003',
      `Looking for (${multi ? 'multi' : 'single'}) "${entryList.join('", "')}" in "${fullBase}".`,
    );

    const allEntries = await matchAnyPilet(fullBase, entryList);
    const maxListeners = Math.max(2 + allEntries.length * 2, 16);
    log('generalDebug_0003', `Found the following entries: ${allEntries.join(', ')}`);

    if (allEntries.length === 0) {
      fail('entryFileMissing_0077');
    }

    process.stderr?.setMaxListeners(maxListeners);
    process.stdout?.setMaxListeners(maxListeners);
    process.stdin?.setMaxListeners(maxListeners);

    const pilets = await concurrentWorkers(allEntries, concurrency, async (entryModule) => {
      const targetDir = dirname(entryModule);
      const { peerDependencies, peerModules, root, apps, ignored, importmap, schema } = await retrievePiletData(targetDir, app);
      const schemaVersion = originalSchemaVersion || schema || config.schemaVersion || 'v2';
      const piralInstances = apps.map((m) => m.appPackage.name);
      const externals = combinePiletExternals(piralInstances, peerDependencies, peerModules, importmap);
      const mocks = join(targetDir, 'mocks');
      const dest = resolve(root, target);
      const outDir = dirname(dest);
      const outFile = basename(dest);
      const mocksExists = await checkExistingDirectory(mocks);

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

    await hooks.beforeApp?.({ appInstanceDir, pilets });
    const appInstances: Array<PiralInstanceInfo> = appInstanceDir
      ? [[appInstanceDir, 0]]
      : await getOrMakeApps(pilets[0], logLevel);

    Promise.all(pilets.map((p) => p.bundler.ready())).then(() => logDone(`Ready!`));

    pilets.forEach((p) => p.bundler.start());

    await Promise.all(
      appInstances.sort(byPort).map(async ([appDir, appPort], i) => {
        const appRoot = dirname(await findFile(appDir, 'package.json'));
        await hooks.afterApp?.({ appInstanceDir, pilets });
        const suggestedPort = appPort || originalPort + i;
        const port = await getAvailablePort(suggestedPort);

        const sources = pilets.map((m) => m.mocks).filter(Boolean);
        const baseMocks = resolve(fullBase, 'mocks');
        const krasBaseConfig = resolve(fullBase, krasrc);
        const krasRootConfig = resolve(appRoot, krasrc);
        const initial = createInitialKrasConfig(baseMocks, sources, { [api]: '' }, feed);
        const configs = [krasBaseConfig, ...pilets.map((p) => resolve(p.root, krasrc)), krasRootConfig];
        const required = {
          injectors: {
            piral: {
              active: false,
            },
            pilet: {
              active: true,
              pilets,
              app: appDir,
              publicUrl,
              handle: ['/', api],
              api,
            },
          },
        };

        if (customkrasrc) {
          configs.push(resolve(fullBase, customkrasrc));
        }

        configs.forEach(cfg => watcherContext.watch(cfg));

        const krasConfig = readKrasConfig({ port, initial, required }, ...configs);

        log('generalVerbose_0004', `Using kras with configuration: ${JSON.stringify(krasConfig, undefined, 2)}`);

        const krasServer = buildKrasWithCli(krasConfig);
        krasServer.setMaxListeners(maxListeners);
        krasServer.removeAllListeners('open');
        krasServer.on('open', notifyServerOnline(publicUrl, krasConfig.api));

        await hooks.beforeOnline?.({ krasServer, krasConfig, open, port, api, feed, pilets, publicUrl });
        await krasServer.start();
        openBrowser(open, port, publicUrl, !!krasConfig.ssl);
        await hooks.afterOnline?.({ krasServer, krasConfig, open, port, api, feed, pilets, publicUrl });
        await new Promise((resolve) => krasServer.on('close', resolve));
      }),
    );
  });

  await hooks.onEnd?.({});
}
