import { resolve } from 'path';
import { removeDirectory, checkExists } from './io';

const bundleWithCodegen = require('parcel-plugin-codegen');

export function extendBundlerWithPlugins(bundler: any) {
  bundleWithCodegen(bundler);
}

export async function clearCache(root: string) {
  const cacheDir = resolve(root, '.cache');
  const exists = await checkExists(cacheDir);

  if (exists) {
    await removeDirectory(cacheDir);
  }
}
