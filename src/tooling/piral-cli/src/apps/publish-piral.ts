import { resolve } from 'path';
import { publishArtifacts } from '../release';
import { LogLevels, PiralBuildType } from '../types';
import { setLogLevel, progress, checkExists, fail, logDone, logReset, publishNpmPackage, matchFiles } from '../common';

export interface PublishPiralOptions {
  /**
   * The source folder, which was the target folder of `piral build`.
   */
  source?: string;

  /**
   * Sets the log level to use (1-5).
   */
  logLevel?: LogLevels;

  /**
   * The additional fields to supply for the provider.
   */
  fields?: Record<string, string>;

  /**
   * The provider to use for publishing the release artifacts.
   */
  provider?: string;

  /**
   * The type of publish.
   */
  type?: PiralBuildType;
}

export const publishPiralDefaults: PublishPiralOptions = {
  source: './dist',
  logLevel: LogLevels.info,
  type: 'all',
  provider: 'none',
  fields: {},
};

async function publishEmulator(baseDir: string, source: string, args: Record<string, string> = {}) {
  const type = 'emulator';
  const directory = resolve(baseDir, source, type);
  const exists = await checkExists(directory);

  if (!exists) {
    fail('publishDirectoryMissing_0110', directory);
  }

  const files = await matchFiles(directory, '*.tgz');

  if (files.length !== 1) {
    fail('publishEmulatorFilesUnexpected_0111', directory);
  }

  const [file] = files;
  const flags = Object.keys(args).reduce((p, c) => {
    p.push(`--${c}`, args[c]);
    return p;
  }, [] as Array<string>);
  await publishNpmPackage(directory, file, flags);
}

async function publishRelease(
  baseDir: string,
  source: string,
  providerName: string,
  args: Record<string, string> = {},
) {
  const type = 'release';
  const directory = resolve(baseDir, source, type);
  const exists = await checkExists(directory);

  if (!exists) {
    fail('publishDirectoryMissing_0110', directory);
  }

  const files = await matchFiles(directory, '**/*');
  await publishArtifacts(providerName, files, args);
}

export async function publishPiral(baseDir = process.cwd(), options: PublishPiralOptions = {}) {
  const {
    source = publishPiralDefaults.source,
    type = publishPiralDefaults.type,
    logLevel = publishPiralDefaults.logLevel,
    fields = publishPiralDefaults.fields,
    provider = publishPiralDefaults.provider,
  } = options;
  const fullBase = resolve(process.cwd(), baseDir);
  setLogLevel(logLevel);

  if (type === 'emulator-sources') {
    fail('publishEmulatorSourcesInvalid_0114');
  }

  progress('Reading configuration ...');

  if (type !== 'release') {
    progress('Publishing emulator package ...');
    await publishEmulator(fullBase, source, fields);
    logDone(`Successfully published emulator.`);
    logReset();
  }

  if (type !== 'emulator') {
    progress('Publishing release files ...');
    await publishRelease(fullBase, source, provider, fields);
    logDone(`Successfully published release.`);
    logReset();
  }
}
