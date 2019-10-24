import * as Bundler from 'parcel-bundler';
import chalk from 'chalk';
import { dirname, join } from 'path';
import { buildKrasWithCli, readKrasConfig, krasrc } from 'kras';
import { modifyBundlerForPiral, extendBundlerForPiral } from './piral';
import { setStandardEnvs, StandardEnvProps } from './envs';
import { extendBundlerWithPlugins, clearCache } from './bundler';
import { liveIcon, settingsIcon } from './emoji';
import { extendConfig } from './settings';
import { startServer } from './server';
import { defaultDevServerPort } from './info';
import { getFreePort } from './port';

export interface DebugOptions {
  publicUrl?: string;
  options: StandardEnvProps;
  source?: string;
  fresh?: boolean;
  root?: string;
  logLevel: 1 | 2 | 3;
}

export async function runDebug(
  port: number,
  entry: string,
  { publicUrl, options, source = entry, logLevel, fresh, root }: DebugOptions,
) {
  const krasConfig = readKrasConfig({ port }, krasrc);

  if (krasConfig.directory === undefined) {
    krasConfig.directory = join(dirname(source), 'mocks');
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

  const buildServerPort = await getFreePort(defaultDevServerPort);

  if (fresh) {
    await clearCache(root);
  }

  await setStandardEnvs(options);

  if (options.dependencies) {
    modifyBundlerForPiral(Bundler.prototype, options.target);
  }

  const bundler = new Bundler(
    entry,
    extendConfig({
      publicUrl,
      logLevel,
    }),
  );

  if (options.dependencies) {
    extendBundlerForPiral(bundler);
  }

  extendBundlerWithPlugins(bundler);

  krasConfig.map['/'] = `http://localhost:${buildServerPort}`;
  const krasServer = buildKrasWithCli(krasConfig);
  krasServer.removeAllListeners('open');

  krasServer.on('open', svc => {
    const address = `${svc.protocol}://localhost:${chalk.green(svc.port)}`;
    console.log(`${liveIcon}  Running at ${chalk.bold(address)}.`);
    console.log(`${settingsIcon}  Manage via ${chalk.bold(address + krasConfig.api)}.`);
    startServer(buildServerPort, (bundler as any).middleware());
  });

  await krasServer.start();
  await new Promise(() => {});
}
