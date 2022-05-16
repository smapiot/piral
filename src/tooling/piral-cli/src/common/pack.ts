import { resolve, join } from 'path';
import { log, progress, fail } from './log';
import { readJson, move } from './io';
import { createNpmPackage } from './npm';
import { ForceOverwrite } from './enums';

async function getFile(root: string, name: string, dest: string) {
  const proposed = join(root, name);

  if (dest !== root) {
    log('generalDebug_0003', `Moving file from "${root}" to "${dest}" ...`);
    const file = await move(proposed, dest, ForceOverwrite.yes);
    log('generalDebug_0003', 'Successfully moved file.');
    return file;
  }

  return proposed;
}

export async function createPiletPackage(baseDir: string, source: string, target: string) {
  const root = resolve(baseDir, source);
  const dest = resolve(baseDir, target);
  log('generalDebug_0003', `Reading the package at "${root}" ...`);
  const pckg = await readJson(root, 'package.json');
  log('generalDebug_0003', 'Successfully read package.');

  if (!pckg) {
    fail('packageJsonNotFound_0020');
  }

  if (!pckg.name) {
    fail('packageJsonMissingName_0021');
  }

  if (!pckg.version) {
    fail('packageJsonMissingVersion_0022');
  }

  progress(`Packing pilet in ${dest} ...`);
  log('generalDebug_0003', 'Creating package ...');
  await createNpmPackage(root);
  log('generalDebug_0003', 'Successfully created package.');
  const name = `${pckg.name}-${pckg.version}.tgz`.replace(/@/g, '').replace(/\//g, '-');
  log('generalDebug_0003', `Assumed package name "${name}".`);
  const file = await getFile(root, name, dest);
  log('generalDebug_0003', `Packed file "${file}".`);
  return file;
}
