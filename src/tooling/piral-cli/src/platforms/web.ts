import { readKrasConfig, krasrc, buildKrasWithCli } from 'kras';
import { dirname, join, resolve } from 'path';
import { createInitialKrasConfig, notifyServerOnline } from '../common/injectors';
import { log } from '../common/log';
import { config } from '../common/config';
import { openBrowser } from '../common/browser';
import { checkExistingDirectory, findFile } from '../common/io';
import { getAvailablePort } from '../common/port';
import { PlatformStartShellOptions, PlatformStartModuleOptions, NetworkSpec } from '../types';

async function getPort(network: NetworkSpec) {
  if (network.type !== 'fixed') {
    const strict = network.type === 'wanted';
    network.port = await getAvailablePort(network.port, strict);
    network.type = 'fixed';
  }

  return network.port;
}

async function startModule(options: PlatformStartModuleOptions) {
  const {
    appDir,
    fullBase,
    open,
    feed,
    publicUrl,
    customkrasrc,
    network,
    hooks,
    registerWatcher,
    registerEnd,
    pilets,
    maxListeners,
  } = options;

  const sources = pilets.map((m) => m.mocks).filter(Boolean);
  const api = `${publicUrl}${config.piletApi.replace(/^\/+/, '')}`;
  const baseMocks = resolve(fullBase, 'mocks');
  const initial = createInitialKrasConfig(baseMocks, sources, { [api]: '' }, feed);
  const configs = [...pilets.map((p) => resolve(p.root, krasrc))];

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

  if (appDir) {
    const appPackageJson = await findFile(appDir, 'package.json');

    if (appPackageJson) {
      configs.unshift(resolve(dirname(appPackageJson), krasrc));
    }
  }

  configs.push(resolve(process.cwd(), krasrc));

  if (customkrasrc) {
    configs.push(resolve(fullBase, customkrasrc));
  }

  configs.forEach(registerWatcher);

  const shouldNotify = network.type === 'proposed';
  const port = await getPort(network);
  const krasConfig = readKrasConfig({ port, initial, required }, ...configs);

  log('generalVerbose_0004', `Using kras with configuration: ${JSON.stringify(krasConfig, undefined, 2)}`);

  const krasServer = buildKrasWithCli(krasConfig);
  krasServer.setMaxListeners(maxListeners);
  krasServer.removeAllListeners('open');

  if (shouldNotify) {
    krasServer.on('open', notifyServerOnline(publicUrl, krasConfig.api));
  }

  await hooks.beforeOnline?.({ krasServer, krasConfig, open, port, api, feed, pilets, publicUrl });
  await krasServer.start();
  openBrowser(open, port, publicUrl, !!krasConfig.ssl);
  await hooks.afterOnline?.({ krasServer, krasConfig, open, port, api, feed, pilets, publicUrl });

  registerEnd(() => krasServer.stop());
  return (options: any) => {
    const injector = krasServer.injectors.find((m) => m.name === 'pilet-injector');
    injector?.setOptions(options);
  };
}

async function startShell(options: PlatformStartShellOptions) {
  const {
    fullBase,
    open,
    root,
    targetDir,
    feed,
    publicUrl,
    bundler,
    customkrasrc,
    network,
    hooks,
    registerWatcher,
    registerEnd,
  } = options;
  const krasBaseConfig = resolve(fullBase, krasrc);
  const krasRootConfig = resolve(root, krasrc);

  const mocks = join(targetDir, 'mocks');
  const baseMocks = resolve(fullBase, 'mocks');
  const mocksExist = await checkExistingDirectory(mocks);
  const sources = [mocksExist ? mocks : undefined].filter(Boolean);
  const initial = createInitialKrasConfig(baseMocks, sources);
  const configs = [krasBaseConfig, krasRootConfig];
  const required = {
    injectors: {
      piral: {
        active: true,
        handle: ['/'],
        feed,
        publicUrl,
        bundler,
      },
      pilet: {
        active: false,
      },
    },
  };

  configs.push(resolve(process.cwd(), krasrc));

  if (customkrasrc) {
    configs.push(resolve(fullBase, customkrasrc));
  }

  configs.forEach(registerWatcher);

  const shouldNotify = network.type === 'proposed';
  const port = await getPort(network);
  const krasConfig = readKrasConfig({ port, initial, required }, ...configs);
  log('generalVerbose_0004', `Using kras with configuration: ${JSON.stringify(krasConfig, undefined, 2)}`);

  const krasServer = buildKrasWithCli(krasConfig);
  krasServer.setMaxListeners(16);
  krasServer.removeAllListeners('open');

  if (shouldNotify) {
    krasServer.on('open', notifyServerOnline(publicUrl, krasConfig.api));
  }

  await hooks.beforeOnline?.({ krasServer, krasConfig, open, port, publicUrl });
  await krasServer.start();
  openBrowser(open, port, publicUrl, !!krasConfig.ssl);
  await hooks.afterOnline?.({ krasServer, krasConfig, open, port, publicUrl });

  registerEnd(async () => krasServer.stop());
  return (options: any) => {
    const injector = krasServer.injectors.find((m) => m.name === 'piral-injector');
    injector?.setOptions(options);
  };
}

export function setup() {
  return {
    startModule,
    startShell,
  };
}
