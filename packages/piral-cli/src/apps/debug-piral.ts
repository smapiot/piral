import * as Bundler from 'parcel-bundler';
import chalk from 'chalk';
import { join } from 'path';
import { extendConfig, startServer, liveIcon, getFreePort, settingsIcon } from './common';
import { buildKrasWithCli, readKrasConfig, krasrc } from 'kras';

export interface DebugPiralOptions {
  entry?: string;
  port?: number;
}

export function debugPiral(baseDir = process.cwd(), options: DebugPiralOptions = {}) {
  const { entry = './src/index.html', port = 1234 } = options;
  const entryFiles = join(baseDir, entry);
  const krasConfig = readKrasConfig({ port }, krasrc);

  if (krasConfig.ssl === undefined) {
    krasConfig.ssl = undefined;
  }

  if (krasConfig.map === undefined) {
    krasConfig.map = {};
  }

  if (krasConfig.api === undefined) {
    krasConfig.api = '/manage-mock-server';
  }

  (async function() {
    const buildServerPort = await getFreePort(64834);
    const bundler = new Bundler(entryFiles, extendConfig({}));
    krasConfig.map['/'] = `http://localhost:${buildServerPort}`;
    const krasServer = buildKrasWithCli(krasConfig);
    krasServer.removeAllListeners('open');
    krasServer.on('open', svc => {
      const address = `${svc.protocol}://localhost:${chalk.green(svc.port)}`;
      console.log(`${liveIcon}  Running at ${chalk.bold(address)}.`);
      console.log(`${settingsIcon}  Manage via ${chalk.bold(address + krasConfig.api)}.`);
      startServer(buildServerPort, (bundler as any).middleware());
    });
    krasServer.start();
  })();
}
