import { basename, resolve } from 'path';
import { LogLevels, PiralBuildType } from '../types';
import {
  setLogLevel,
  progress,
  checkExists,
  fail,
  logDone,
  logReset,
  publishPackage,
  matchFiles,
  copy,
} from '../common';

export interface PublishPiralOptions {
  source?: string;
  logLevel?: LogLevels;
  fields?: Record<string, string>;
  provider?: string;
  type?: PiralBuildType;
}

export const publishPiralDefaults: PublishPiralOptions = {
  source: './dist',
  logLevel: LogLevels.info,
  type: 'emulator',
  provider: 'xcopy',
  fields: {},
};

interface ReleaseProvider {
  (files: Array<string>, args: Record<string, string>): Promise<void>;
}

const providers: Record<string, ReleaseProvider> = {
  async xcopy(files, args) {
    const { target } = args;

    if (!target) {
      fail('publishXcopyMissingTarget_0112');
    }

    await Promise.all(files.map(async (file) => copy(file, resolve(target, basename(file)))));
  },
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
  await publishPackage(directory, file, flags);
}

async function publishRelease(baseDir: string, source: string, provider: string, args: Record<string, string> = {}) {
  const type = 'release';
  const directory = resolve(baseDir, source, type);
  const exists = await checkExists(directory);

  if (!exists) {
    fail('publishDirectoryMissing_0110', directory);
  }

  const files = await matchFiles(directory, '**/*');
}

export async function publishPiral(baseDir = process.cwd(), options: PublishPiralOptions = {}) {
  const {
    source = publishPiralDefaults.source,
    type = publishPiralDefaults.type,
    logLevel = publishPiralDefaults.logLevel,
    fields = publishPiralDefaults.fields,
    provider = publishPiralDefaults.provider,
  } = options;
  setLogLevel(logLevel);
  progress('Reading configuration ...');

  if (type !== 'release') {
    progress('Publishing emulator package ...');
    await publishEmulator(baseDir, source, fields);
    logDone(`Successfully published emulator.`);
    logReset();
  }

  if (type !== 'emulator') {
    progress('Publishing release files ...');
    await publishRelease(baseDir, source, provider, fields);
    logDone(`Successfully published release.`);
    logReset();
  }
}
