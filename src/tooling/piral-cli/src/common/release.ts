import { basename, dirname, relative } from 'path';
import { readBinary } from './io';
import { publishNpmPackage } from './npm';
import { FormDataObj, postForm } from './http';
import { PublishScheme } from '../types';

export async function publishPackageEmulator(directory: string, file: string, url?: string, interactive = false) {
  const flags = url ? [`--registry=${url}`] : [];
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
