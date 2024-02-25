import { basename, dirname, relative, resolve } from 'path';
import { fail, log } from './log';
import { publishNpmPackage } from './npm';
import { FormDataObj, postForm } from './http';
import { checkExists, matchFiles, readBinary } from './io';
import { PublishScheme } from '../types';

export async function publishPackageEmulator(
  baseDir: string,
  source: string,
  args: Record<string, string> = {},
  interactive = false,
) {
  const type = 'emulator';
  const directory = resolve(baseDir, source, type);
  const exists = await checkExists(directory);

  if (!exists) {
    fail('publishDirectoryMissing_0110', directory);
  }

  const files = await matchFiles(directory, '*.tgz');
  log('generalDebug_0003', `Found ${files.length} in "${directory}": ${files.join(', ')}`);

  if (files.length !== 1) {
    fail('publishEmulatorFilesUnexpected_0111', directory);
  }

  const [file] = files;
  const flags = Object.keys(args).reduce((p, c) => {
    p.push(`--${c}`, args[c]);
    return p;
  }, [] as Array<string>);

  await publishNpmPackage(directory, file, flags, interactive);
}

export async function publishWebsiteEmulator(
  version: string,
  url: string,
  apiKey: string,
  mode: PublishScheme,
  directory: string,
  files: Array<string>,
  interactive: boolean,
  headers?: Record<string, string>,
  ca?: Buffer,
) {
  const data: FormDataObj = {
    version,
    type: 'custom',
  };

  for (const file of files) {
    const relPath = relative(directory, file);
    const fileName = basename(file);
    const content = await readBinary(dirname(file), fileName);
    data[relPath] = [content, fileName];
  }

  return await postForm(url, mode, apiKey, data, headers, ca, interactive);
}
