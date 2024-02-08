import { basename, dirname, resolve } from 'path';
import { LogLevels, PublishScheme } from '../types';
import {
  setLogLevel,
  progress,
  checkExists,
  fail,
  logDone,
  log,
  config,
  readBinary,
  emulatorName,
  emulatorJson,
  publishWebsiteEmulator,
  matchFiles,
  readJson,
  triggerBuildEmulator,
  logReset,
  emulatorWebsiteName,
  retrievePiralRoot,
  emulatorPackageName,
  retrievePiletsInfo,
  validateSharedDependencies,
} from '../common';

export interface PublishPiralOptions {
  /**
   * The source folder, which was the target folder of `piral build`.
   */
  source?: string;

  /**
   * Sets the URL of the feed service to deploy to.
   */
  url?: string;

  /**
   * Sets the API key to use.
   */
  apiKey?: string;

  /**
   * Sets the log level to use (1-5).
   */
  logLevel?: LogLevels;

  /**
   * Specifies if the Piral instance should be built before publishing.
   * If yes, then the tarball is created from fresh build artifacts.
   */
  fresh?: boolean;

  /**
   * Defines a custom certificate for the feed service.
   */
  cert?: string;

  /**
   * Places additional headers that should be posted to the feed service.
   */
  headers?: Record<string, string>;

  /**
   * Defines if authorization tokens can be retrieved interactively.
   */
  interactive?: boolean;

  /**
   * Sets the bundler to use for building, if any specific.
   */
  bundlerName?: string;

  /**
   * Sets the authorization scheme to use.
   */
  mode?: PublishScheme;

  /**
   * Additional arguments for a specific bundler.
   */
  _?: Record<string, any>;

  /**
   * Hooks to be triggered at various stages.
   */
  hooks?: {
    beforeEmulator?(e: any): Promise<void>;
    afterEmulator?(e: any): Promise<void>;
    beforePackage?(e: any): Promise<void>;
    afterPackage?(e: any): Promise<void>;
  };
}

export const publishPiralDefaults: PublishPiralOptions = {
  source: './dist',
  logLevel: LogLevels.info,
  url: undefined,
  interactive: false,
  apiKey: undefined,
  fresh: false,
  cert: undefined,
  mode: 'basic',
  headers: {},
};

export async function publishPiral(baseDir = process.cwd(), options: PublishPiralOptions = {}) {
  const {
    source = publishPiralDefaults.source,
    logLevel = publishPiralDefaults.logLevel,
    interactive = publishPiralDefaults.interactive,
    fresh = publishPiralDefaults.fresh,
    url = config.url ?? publishPiralDefaults.url,
    apiKey = config.apiKeys?.[url] ?? config.apiKey ?? publishPiralDefaults.apiKey,
    cert = config.cert ?? publishPiralDefaults.cert,
    headers = publishPiralDefaults.headers,
    mode = publishPiralDefaults.mode,
    _ = {},
    hooks = {},
    bundlerName,
  } = options;
  const fullBase = resolve(process.cwd(), baseDir);
  setLogLevel(logLevel);
  progress('Reading configuration ...');

  if (!url) {
    fail('missingPiletFeedUrl_0060');
  }

  log('generalDebug_0003', 'Checking if certificate exists.');
  let ca: Buffer = undefined;

  if (await checkExists(cert)) {
    const dir = dirname(cert);
    const file = basename(cert);
    log('generalDebug_0003', `Reading certificate file "${file}" from "${dir}".`);
    ca = await readBinary(dir, file);
  }

  log('generalDebug_0003', 'Getting the files ...');
  const entryFiles = await retrievePiralRoot(fullBase, './');
  const {
    name,
    root,
    ignored,
    externals,
    scripts,
    emulator = emulatorPackageName,
  } = await retrievePiletsInfo(entryFiles);

  if (emulator !== emulatorWebsiteName) {
    fail('generalError_0002', `Currently only the "${emulatorWebsiteName}" option is supported.`);
  }
  
  const emulatorDir = resolve(fullBase, source, emulatorName);

  if (fresh) {
    const piralInstances = [name];

    validateSharedDependencies(externals);

    await triggerBuildEmulator({
      root,
      logLevel,
      bundlerName,
      emulatorType: emulatorWebsiteName,
      hooks,
      targetDir: emulatorDir,
      ignored,
      externals,
      entryFiles,
      piralInstances,
      optimizeModules: true,
      sourceMaps: true,
      watch: false,
      scripts,
      contentHash: true,
      outFile: 'index.html',
      _,
    });

    logReset();
  }

  const { version } = await readJson(emulatorDir, emulatorJson);

  if (!version) {
    fail('missingEmulatorWebsite_0130', emulatorDir);
  }

  log('generalInfo_0000', `Using feed service "${url}".`);

  const files = await matchFiles(emulatorDir, '**/*');

  progress(`Publishing emulator to "%s" ...`, url);
  const result = await publishWebsiteEmulator(version, url, apiKey, mode, emulatorDir, files, interactive, headers, ca);

  if (!result.success) {
    fail('failedUploading_0064');
  }

  if (result.response) {
    log('httpPostResponse_0067', result);
  }

  progress(`Published successfully!`);

  logDone(`Emulator published successfully!`);
}
