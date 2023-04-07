import { readKrasConfig, krasrc, buildKrasWithCli } from 'kras';
import { join, resolve } from 'path';
import { createInitialKrasConfig, notifyServerOnline } from '../common/injectors';
import { log } from '../common/log';
import { config } from '../common/config';
import { openBrowser } from '../common/browser';
import { checkExistingDirectory } from '../common/io';
import { getAvailablePort } from '../common/port';
import { PlatformStartShellOptions, PlatformStartModuleOptions } from '../types';

async function startModule(options: PlatformStartModuleOptions) {
  const {
    appDir,
    appRoot,
    fullBase,
    open,
    feed,
    publicUrl,
    customkrasrc,
    originalPort,
    hooks,
    registerWatcher,
    registerEnd,
    pilets,
    maxListeners,
  } = options;

  const sources = pilets.map((m) => m.mocks).filter(Boolean);
  const api = `${publicUrl}${config.piletApi.replace(/^\/+/, '')}`;
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

  configs.forEach(registerWatcher);

  const port = await getAvailablePort(originalPort);
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

  registerEnd(() => krasServer.stop());
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
    originalPort,
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

  if (customkrasrc) {
    configs.push(resolve(fullBase, customkrasrc));
  }

  configs.forEach(registerWatcher);

  const port = await getAvailablePort(originalPort);
  const krasConfig = readKrasConfig({ port, initial, required }, ...configs);
  log('generalVerbose_0004', `Using kras with configuration: ${JSON.stringify(krasConfig, undefined, 2)}`);

  const krasServer = buildKrasWithCli(krasConfig);
  krasServer.setMaxListeners(16);
  krasServer.removeAllListeners('open');
  krasServer.on('open', notifyServerOnline(publicUrl, krasConfig.api));

  await hooks.beforeOnline?.({ krasServer, krasConfig, open, port, publicUrl });
  await krasServer.start();
  openBrowser(open, port, publicUrl, !!krasConfig.ssl);
  await hooks.afterOnline?.({ krasServer, krasConfig, open, port, publicUrl });

  registerEnd(() => krasServer.stop());
}

export function setup() {
  return {
    startModule,
    startShell,
  };
}
