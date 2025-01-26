import { resolve } from 'path';
import { LogLevels, PiralPublishType, PublishScheme } from '../types';
import {
  setLogLevel,
  progress,
  fail,
  logDone,
  log,
  config,
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
  getCertificate,
  releaseName,
  packageJson,
  triggerBuildShell,
  publishPackageEmulator,
  ensure,
  getAgent,
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
   * Allow self-signed certificates.
   */
  allowSelfSigned?: boolean;

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

  /**
   * Selects the target type of the build (e.g. 'release'). "all" builds all target types.
   */
  type?: PiralPublishType;
}

export const publishPiralDefaults: PublishPiralOptions = {
  source: './dist',
  logLevel: LogLevels.info,
  url: undefined,
  interactive: false,
  apiKey: undefined,
  fresh: false,
  mode: 'basic',
  headers: {},
  type: 'emulator',
  cert: undefined,
  allowSelfSigned: config.allowSelfSigned,
};

export async function publishPiral(baseDir = process.cwd(), options: PublishPiralOptions = {}) {
  const {
    source = publishPiralDefaults.source,
    logLevel = publishPiralDefaults.logLevel,
    interactive = publishPiralDefaults.interactive,
    fresh = publishPiralDefaults.fresh,
    url = config.url ?? publishPiralDefaults.url,
    apiKey = config.apiKeys?.[url] ?? config.apiKey ?? publishPiralDefaults.apiKey,
    headers = publishPiralDefaults.headers,
    mode = publishPiralDefaults.mode,
    type = publishPiralDefaults.type,
    cert = publishPiralDefaults.cert,
    allowSelfSigned = publishPiralDefaults.allowSelfSigned,
    _ = {},
    hooks = {},
    bundlerName,
  } = options;

  ensure('baseDir', baseDir, 'string');
  ensure('headers', headers, 'object');
  ensure('_', _, 'object');
  ensure('hooks', hooks, 'object');

  const fullBase = resolve(process.cwd(), baseDir);
  setLogLevel(logLevel);
  progress('Reading configuration ...');

  if (!url) {
    fail('missingPiletFeedUrl_0060');
  }

  const ca = await getCertificate(cert);
  const agent = getAgent({ ca, allowSelfSigned });

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

  if (type === 'emulator' && ![emulatorPackageName, emulatorWebsiteName].includes(emulator)) {
    fail(
      'generalError_0002',
      `The emulator type "${emulator}" is not supported. Select one of these types to use the publish command: "${emulatorWebsiteName}", "${emulatorPackageName}".`,
    );
  }

  const dir = type === 'release' ? releaseName : emulatorName;
  const targetDir = resolve(fullBase, source, dir);

  if (fresh) {
    const piralInstances = [name];

    validateSharedDependencies(externals);

    if (type === 'release') {
      await triggerBuildShell({
        targetDir,
        logLevel,
        bundlerName,
        contentHash: true,
        externals,
        ignored,
        minify: true,
        optimizeModules: false,
        publicUrl: '/',
        outFile: 'index.html',
        root,
        sourceMaps: true,
        watch: false,
        hooks,
        entryFiles,
        piralInstances,
        scripts,
        _,
      });
    } else {
      await triggerBuildEmulator({
        root,
        logLevel,
        bundlerName,
        emulatorType: emulator,
        hooks,
        targetDir,
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
    }

    logReset();
  }

  if (type === 'release') {
    const { version } = await readJson(root, packageJson);

    log('generalInfo_0000', `Using feed service "${url}".`);
    const files = await matchFiles(targetDir, '**/*');

    progress(`Publishing release artifacts to "%s" ...`, url);
    const result = await publishWebsiteEmulator(
      version,
      url,
      apiKey,
      mode,
      targetDir,
      files,
      interactive,
      headers,
      agent,
    );

    if (!result.success) {
      fail('failedUploading_0064');
    }

    if (result.response) {
      log('httpPostResponse_0067', result);
    }

    progress(`Published successfully!`);

    logDone(`Release artifacts published successfully!`);
  } else if (emulator === emulatorWebsiteName) {
    const { version } = await readJson(targetDir, emulatorJson);

    if (!version) {
      fail('missingEmulatorWebsite_0130', targetDir);
    }

    log('generalInfo_0000', `Using feed service "${url}".`);

    const files = await matchFiles(targetDir, '**/*');

    progress(`Publishing emulator to "%s" ...`, url);
    const result = await publishWebsiteEmulator(
      version,
      url,
      apiKey,
      mode,
      targetDir,
      files,
      interactive,
      headers,
      agent,
    );

    if (!result.success) {
      fail('failedUploading_0064');
    }

    if (result.response) {
      log('httpPostResponse_0067', result);
    }

    progress(`Published successfully!`);

    logDone(`Emulator published successfully!`);
  } else if (emulator === emulatorPackageName) {
    log('generalInfo_0000', `Using npm registry "${url}".`);

    const files = await matchFiles(targetDir, '*.tgz');
    log('generalDebug_0003', `Found ${files.length} in "${targetDir}": ${files.join(', ')}`);
    const file = files[0];

    if (!file) {
      fail('publishEmulatorFilesUnexpected_0111', targetDir);
    }

    progress(`Publishing emulator to "%s" ...`, url);

    try {
      await publishPackageEmulator(targetDir, file, url, interactive, apiKey);
      progress(`Published successfully!`);
    } catch {
      fail('failedUploading_0064');
    }

    logDone(`Emulator published successfully!`);
  } else {
    // we should not enter here - anyway let's do nothing
  }
}
