import { resolve, join } from 'path';
import { readJson, createPackage, move, ForceOverwrite } from './common';

export interface PackPiletOptions {
  source?: string;
  target?: string;
}

export const packPiletDefaults = {
  source: '.',
  target: '.',
};

export async function packPilet(baseDir = process.cwd(), options: PackPiletOptions = {}) {
  const { source = packPiletDefaults.source, target = packPiletDefaults.target } = options;
  const root = resolve(baseDir, source);
  const dest = resolve(baseDir, target);
  const pckg = await readJson(root, 'package.json');

  if (!pckg) {
    return console.error('No valid package.json found.');
  }

  if (!pckg.name) {
    return console.error('Cannot pack the pilet - missing name.');
  }

  if (!pckg.version) {
    return console.error('Cannot pack the pilet - missing version.');
  }

  console.log(`Packing pilet in ${resolve(baseDir, target)} ...`);

  await createPackage(root);

  if (dest !== root) {
    const file = join(root, `${pckg.name}-${pckg.version}.tgz`);
    await move(file, dest, ForceOverwrite.yes);
  }

  console.log(`All done!`);
}
