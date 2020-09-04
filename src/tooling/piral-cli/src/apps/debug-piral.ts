import { dirname, join, resolve } from 'path';
import { readKrasConfig, krasrc, buildKrasWithCli, defaultConfig } from 'kras';
import { callPiralDebug } from '../bundler';
import { LogLevels } from '../types';
import {
  retrievePiletsInfo,
  retrievePiralRoot,
  openBrowser,
  checkCliCompatibility,
  reorderInjectors,
  notifyServerOnline,
  setLogLevel,
  progress,
  log,
} from '../common';

export interface DebugPiralOptions {
  entry?: string;
  port?: number;
  publicUrl?: string;
  logLevel?: LogLevels;
  open?: boolean;
  hmr?: boolean;
  optimizeModules?: boolean;
  _?: Record<string, any>;
}

export const debugPiralDefaults: DebugPiralOptions = {
  entry: './',
  port: 1234,
  publicUrl: '/',
  logLevel: LogLevels.info,
  open: false,
  hmr: true,
  optimizeModules: false,
};

const injectorName = resolve(__dirname, '../injectors/piral.js');

export async function debugPiral(baseDir = process.cwd(), options: DebugPiralOptions = {}) {
  const {
    entry = debugPiralDefaults.entry,
    port = debugPiralDefaults.port,
    open = debugPiralDefaults.open,
    hmr = debugPiralDefaults.hmr,
    publicUrl = debugPiralDefaults.publicUrl,
    logLevel = debugPiralDefaults.logLevel,
    optimizeModules = debugPiralDefaults.optimizeModules,
    _ = {},
  } = options;
  setLogLevel(logLevel);
  progress('Reading configuration ...');
  const entryFiles = await retrievePiralRoot(baseDir, entry);
  const { externals, name, root, ignored } = await retrievePiletsInfo(entryFiles);
  const krasConfig = readKrasConfig({ port }, krasrc);

  await checkCliCompatibility(root);

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

  if (krasConfig.injectors === undefined) {
    krasConfig.injectors = defaultConfig.injectors;
  }

  const bundler = await callPiralDebug({
    root,
    piral: name,
    optimizeModules,
    hmr,
    externals,
    publicUrl,
    entryFiles,
    logLevel,
    ignored,
    _,
  });

  const injectorConfig = {
    active: true,
    handle: ['/'],
    bundler,
  };

  krasConfig.map['/'] = '';
  krasConfig.injectors = reorderInjectors(injectorName, injectorConfig, krasConfig.injectors);

  log('generalVerbose_0004', `Using kras with configuration: ${JSON.stringify(krasConfig, undefined, 2)}`);

  const krasServer = buildKrasWithCli(krasConfig);
  krasServer.removeAllListeners('open');
  krasServer.on('open', notifyServerOnline([bundler], krasConfig.api));

  await krasServer.start();
  openBrowser(open, port);
  await new Promise(resolve => krasServer.on('close', resolve));
}
