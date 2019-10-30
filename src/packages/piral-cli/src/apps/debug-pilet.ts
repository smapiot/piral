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

const injectorName = resolve(__dirname, '../injectors/pilet');

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
    pilet: relative(dirname(coreFile), entryFile),
    piral: appPackage.name,
    dependencies: externals,
  });

  modifyBundlerForPilet(Bundler.prototype, externals, target);

  const bundler = new Bundler(entryFile, extendConfig({ logLevel }));

  extendBundlerForPilet(bundler);
  extendBundlerWithPlugins(bundler);

  krasConfig.map['/'] = '';

  krasConfig.injectors = {
    [injectorName]: {
      active: true,
      bundler,
      port,
      root,
      app: dirname(appFile),
      api: '/$pilet-api',
    } as any,
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

  //TODO post process via postProcess(bundle) ?

  await krasServer.start();
  await new Promise(resolve => krasServer.on('close', resolve));
}
