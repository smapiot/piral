import * as Bundler from 'parcel-bundler';
import chalk from 'chalk';
import { join, dirname, relative, resolve } from 'path';
import { readKrasConfig, krasrc, buildKrasWithCli, defaultConfig } from 'kras';
import {
  retrievePiletData,
  clearCache,
  setStandardEnvs,
  extendConfig,
  extendBundlerWithPlugins,
  liveIcon,
  settingsIcon,
  extendBundlerForPilet,
  modifyBundlerForPilet,
  postProcess,
  debugPiletApi,
} from '../common';

export interface DebugPiletOptions {
  entry?: string;
  port?: number;
  app?: string;
  logLevel?: 1 | 2 | 3;
  fresh?: boolean;
}

export const debugPiletDefaults = {
  entry: './src/index',
  port: 1234,
  logLevel: 3 as const,
  fresh: false,
};

const injectorName = resolve(__dirname, '../injectors/pilet.js');

export async function debugPilet(baseDir = process.cwd(), options: DebugPiletOptions = {}) {
  const {
    entry = debugPiletDefaults.entry,
    port = debugPiletDefaults.port,
    logLevel = debugPiletDefaults.logLevel,
    fresh = debugPiletDefaults.fresh,
    app,
  } = options;
  const entryFile = join(baseDir, entry);
  const target = dirname(entryFile);
  const { peerDependencies, root, coreFile, appPackage, appFile } = await retrievePiletData(target, app);
  const externals = Object.keys(peerDependencies);
  const krasConfig = readKrasConfig({ port }, krasrc);

  if (krasConfig.directory === undefined) {
    krasConfig.directory = join(dirname(entryFile), 'mocks');
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

  if (fresh) {
    await clearCache(root);
  }

  await setStandardEnvs({
    target,
    piral: appPackage.name,
    dependencies: externals,
  });

  modifyBundlerForPilet(Bundler.prototype, externals, target);

  const bundler = new Bundler(entryFile, extendConfig({ logLevel }));
  const api = debugPiletApi;
  const injectorConfig = {
    active: true,
    bundler,
    port,
    root,
    app: dirname(appFile),
    handle: ['/', api],
    api,
  };

  extendBundlerForPilet(bundler);
  extendBundlerWithPlugins(bundler);

  bundler.on('bundled', bundle => postProcess(bundle));

  krasConfig.map['/'] = '';
  krasConfig.map[api] = '';

  krasConfig.injectors = {
    script: krasConfig.injectors.script || {
      active: true,
    },
    [injectorName]: injectorConfig,
    ...krasConfig.injectors,
  };

  const krasServer = buildKrasWithCli(krasConfig);
  krasServer.removeAllListeners('open');

  krasServer.on('open', svc => {
    const address = `${svc.protocol}://localhost:${chalk.green(svc.port)}`;
    console.log(`${liveIcon}  Running at ${chalk.bold(address)}.`);
    console.log(`${settingsIcon}  Manage via ${chalk.bold(address + krasConfig.api)}.`);
    bundler.bundle();
  });

  await krasServer.start();
  await new Promise(resolve => krasServer.on('close', resolve));
}
