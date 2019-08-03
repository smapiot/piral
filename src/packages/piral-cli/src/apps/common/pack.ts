import { resolve, join } from 'path';
import { readJson, ForceOverwrite, move } from './io';
import { createPackage } from './npm';

export async function createPiletPackage(baseDir: string, source: string, target: string) {
  const root = resolve(baseDir, source);
  const dest = resolve(baseDir, target);
  const pckg = await readJson(root, 'package.json');

  if (!pckg) {
    console.error('No valid package.json found.');
    throw new Error('Invalid pilet.');
  }

  if (!pckg.name) {
    console.error('Cannot pack the pilet - missing name.');
    throw new Error('Invalid pilet.');
  }

  if (!pckg.version) {
    console.error('Cannot pack the pilet - missing version.');
    throw new Error('Invalid pilet.');
  }

  console.log(`Packing pilet in ${resolve(baseDir, target)} ...`);

  await createPackage(root);
  const name = `${pckg.name}-${pckg.version}.tgz`.replace(/@/g, '').replace(/\//g, '-');
  const file = join(root, name);

  if (dest !== root) {
    return await move(file, dest, ForceOverwrite.yes);
  }

  return file;
}
