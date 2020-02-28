import { resolve, join } from 'path';
import { readJson, move } from './io';
import { createPackage } from './npm';
import { ForceOverwrite } from './types';
import { logFail, logInfo } from './log';

export async function createPiletPackage(baseDir: string, source: string, target: string) {
  const root = resolve(baseDir, source);
  const dest = resolve(baseDir, target);
  const pckg = await readJson(root, 'package.json');

  if (!pckg) {
    logFail('No valid package.json found.');
    throw new Error('Invalid pilet.');
  }

  if (!pckg.name) {
    logFail('Cannot pack the pilet - missing name.');
    throw new Error('Invalid pilet.');
  }

  if (!pckg.version) {
    logFail('Cannot pack the pilet - missing version.');
    throw new Error('Invalid pilet.');
  }

  logInfo(`Packing pilet in ${resolve(baseDir, target)} ...`);

  await createPackage(root);
  const name = `${pckg.name}-${pckg.version}.tgz`.replace(/@/g, '').replace(/\//g, '-');
  const file = join(root, name);

  if (dest !== root) {
    return await move(file, dest, ForceOverwrite.yes);
  }

  return file;
}
