import { Agent } from 'https';
import { basename, dirname, relative } from 'path';
import { readBinary } from './io';
import { publishNpmPackage } from './npm';
import { FormDataObj, postForm } from './http';
import { PublishScheme } from '../types';

function nerfUrl(url: string) {
  const parsed = new URL(url);
  const from = `${parsed.protocol}//${parsed.host}${parsed.pathname}`;
  const rel = new URL('.', from);
  const res = `//${rel.host}${rel.pathname}`;
  return res;
}

export async function publishPackageEmulator(
  directory: string,
  file: string,
  url?: string,
  interactive = false,
  apiKey?: string,
) {
  const flags = url ? [`--registry=${url}`] : [];

  if (url && apiKey) {
    const authUrl = nerfUrl(url);
    const tokenKey = `${authUrl}:_authToken`;
    flags.push(`--${tokenKey}=${apiKey}`);
  }

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
  agent?: Agent,
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

  return await postForm(url, mode, apiKey, data, headers, agent, interactive);
}
