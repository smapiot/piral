import * as Bundler from 'parcel-bundler';
import chalk from 'chalk';
import { dirname, join, resolve } from 'path';
import { readKrasConfig, krasrc, buildKrasWithCli } from 'kras';
import {
  retrievePiletsInfo,
  retrievePiralRoot,
  clearCache,
  setStandardEnvs,
  modifyBundlerForPiral,
  extendBundlerForPiral,
  extendBundlerWithPlugins,
  extendConfig,
  liveIcon,
  settingsIcon,
} from '../common';

export interface DebugPiralOptions {
  entry?: string;
  port?: number;
  publicUrl?: string;
  logLevel?: 1 | 2 | 3;
  fresh?: boolean;
}

export const debugPiralDefaults = {
  entry: './',
  port: 1234,
  publicUrl: '/',
  logLevel: 3 as const,
  fresh: false,
};

const injectorName = resolve(__dirname, '../injectors/piral');

export async function debugPiral(baseDir = process.cwd(), options: DebugPiralOptions = {}) {
  const {
    entry = debugPiralDefaults.entry,
    port = debugPiralDefaults.port,
    publicUrl = debugPiralDefaults.publicUrl,
    logLevel = debugPiralDefaults.logLevel,
    fresh = debugPiralDefaults.fresh,
  } = options;
  const entryFiles = await retrievePiralRoot(baseDir, entry);
  const { externals, name, root } = await retrievePiletsInfo(entryFiles);

  const krasConfig = readKrasConfig({ port }, krasrc);

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

  if (fresh) {
    await clearCache(root);
  }

  await setStandardEnvs({
    target: dirname(entryFiles),
    dependencies: externals,
    piral: name,
  });

  modifyBundlerForPiral(Bundler.prototype, dirname(entryFiles));

  const bundler = new Bundler(
    entryFiles,
    extendConfig({
      publicUrl,
      logLevel,
    }),
  );

  extendBundlerForPiral(bundler);
  extendBundlerWithPlugins(bundler);

  krasConfig.map['/'] = '';

  krasConfig.injectors = {
    [injectorName]: {
      active: true,
      bundler,
    } as any,
    ...krasConfig.injectors,
  };

  const krasServer = buildKrasWithCli(krasConfig);
  krasServer.removeAllListeners('open');

  krasServer.on('open', svc => {
    const address = `${svc.protocol}://localhost:${chalk.green(svc.port)}`;
    console.log(`${liveIcon}  Running at ${chalk.bold(address)}.`);
    console.log(`${settingsIcon}  Manage via ${chalk.bold(address + krasConfig.api)}.`);
  });

  await Promise.all([bundler.bundle(), krasServer.start()]);
  await new Promise(resolve => krasServer.on('close', resolve));
}
