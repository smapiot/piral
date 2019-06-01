import * as Bundler from 'parcel-bundler';
import chalk from 'chalk';
import { join, dirname } from 'path';
import { extendConfig, startServer, liveIcon, getFreePort, settingsIcon, setStandardEnvs, findFile } from './common';
import { buildKrasWithCli, readKrasConfig, krasrc } from 'kras';

function findRoot(pck: string | Array<string>, baseDir: string) {
  if (Array.isArray(pck)) {
    for (const item of pck) {
      const result = findRoot(item, baseDir);

      if (result) {
        return result;
      }
    }
  } else {
    const p = require.resolve(pck, {
      paths: [baseDir],
    });

    console.log(p);
    return p;
  }
}

export interface DebugPiletOptions {
  entry?: string;
  port?: number;
}

export const debugPiletDefaults = {
  entry: './src/index',
  port: 1234,
};

export async function debugPilet(baseDir = process.cwd(), options: DebugPiletOptions = {}) {
  const { entry = debugPiletDefaults.entry, port = debugPiletDefaults.port } = options;
  const entryFiles = join(baseDir, entry);
  const targetDir = dirname(entryFiles);
  const packageJson = await findFile(targetDir, 'package.json');

  if (!packageJson) {
    return console.error('Cannot find any package.json. You need a valid package.json for your pilet.');
  }

  const packageContent = require(packageJson);
  const krasConfig = readKrasConfig({ port }, krasrc);

  process.env.DEBUG_PILET = entryFiles;

  if (krasConfig.ssl === undefined) {
    krasConfig.ssl = undefined;
  }

  if (krasConfig.map === undefined) {
    krasConfig.map = {};
  }

  if (krasConfig.api === undefined) {
    krasConfig.api = '/manage-mock-server';
  }

  const buildServerPort = await getFreePort(64834);

  await setStandardEnvs({
    target: dirname(entry),
  });

  const rootFile = findRoot(
    (packageContent.piral && packageContent.piral.name) || Object.keys(packageContent.devDependencies),
    targetDir,
  );

  if (!rootFile) {
    return console.error('Cannot find the root for the Piral instance. Make sure your package.json is valid .');
  }

  const bundler = new Bundler(rootFile, extendConfig({}));
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
}
