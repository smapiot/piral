import { readText, writeText } from './io';

const patchMap: Record<string, (rootDir: string) => Promise<void>> = {
  async buffer(rootDir) {
    const gn = ' global.';
    const content = await readText(rootDir, 'index.js');

    if (content && content.indexOf(gn) !== -1) {
      await writeText(rootDir, 'index.js', content.split(gn).join(' window.'));
    }
  },
};

export async function patchModule(packageName: string, rootDir: string) {
  const applyPatchAt = patchMap[packageName];

  if (typeof applyPatchAt === 'function') {
    await applyPatchAt(rootDir);
  }
}
