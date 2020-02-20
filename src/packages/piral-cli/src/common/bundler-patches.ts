import { readText, writeText } from './io';
import { resolve } from 'path';

async function replaceAll(dir: string, file: string, original: string, replacement: string) {
  const content = await readText(dir, file);

  if (content && content.indexOf(original) !== -1) {
    await writeText(dir, file, content.split(original).join(replacement));
  }
}

const patchMap: Record<string, (rootDir: string) => Promise<void>> = {
  async buffer(rootDir) {
    await replaceAll(rootDir, 'index.js', ' global.', ' window.');
  },
  async 'has-symbols'(rootDir) {
    await replaceAll(rootDir, 'index.js', ' global.', ' window.');
  },
  async ketting(rootDir) {
    const util = resolve(rootDir, 'dist', 'util');
    const utils = resolve(rootDir, 'dist', 'utils');
    await replaceAll(util, 'fetch-helper.js', 'global', 'window');
    await replaceAll(utils, 'fetch-helper.js', 'global', 'window');
    await replaceAll(utils, 'fetch-polyfill.js', 'global', 'window');
  },
};

export async function patchModule(packageName: string, rootDir: string) {
  const applyPatchAt = patchMap[packageName];

  if (typeof applyPatchAt === 'function') {
    await applyPatchAt(rootDir);
  }
}
