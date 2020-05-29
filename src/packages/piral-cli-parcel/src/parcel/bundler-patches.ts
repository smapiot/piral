import { resolve } from 'path';
import { readText, writeText } from 'piral-cli/utils';

const windowOrGlobal = '(typeof window !== "undefined" ? window : global)';

async function replaceAll(dir: string, file: string, original: string, replacement: string) {
  const content = await readText(dir, file);

  if (content && content.indexOf(original) !== -1) {
    await writeText(dir, file, content.split(original).join(replacement));
  }
}

export const standardPatches: Record<string, (rootDir: string) => Promise<void>> = {
  async buffer(rootDir) {
    await replaceAll(rootDir, 'index.js', ' global.', ` ${windowOrGlobal}.`);
  },
  async 'has-symbols'(rootDir) {
    await replaceAll(rootDir, 'index.js', ' global.', ` ${windowOrGlobal}.`);
  },
  async ketting(rootDir) {
    const util = resolve(rootDir, 'dist', 'util');
    const utils = resolve(rootDir, 'dist', 'utils');
    await replaceAll(util, 'fetch-helper.js', 'global', windowOrGlobal);
    await replaceAll(utils, 'fetch-helper.js', 'global', windowOrGlobal);
    await replaceAll(utils, 'fetch-polyfill.js', 'global', windowOrGlobal);
  },
};
