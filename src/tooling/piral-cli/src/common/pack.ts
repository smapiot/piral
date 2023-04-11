import { tmpdir } from 'os';
import { resolve, relative, join, dirname, basename } from 'path';
import { createTgz } from './archive';
import { onlyUnique } from './utils';
import { log, progress, fail } from './log';
import { readJson, copy, removeDirectory, checkExists, makeTempDir, createDirectory } from './io';
import { getPossiblePiletMainPaths } from './inspect';

async function getPiletContentDir(root: string, packageData: any) {
  const paths = getPossiblePiletMainPaths(packageData);

  for (const path of paths) {
    const file = resolve(root, path);

    if (await checkExists(file)) {
      return dirname(file);
    }
  }

  return root;
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

  const isFileTarget = target.endsWith('.tgz');
  progress(`Packing pilet in "${root}" ...`);

  const pckgName = pckg.name.replace(/@/g, '').replace(/\//g, '-');
  const id = `${pckgName}-${pckg.version}`;
  const name = isFileTarget ? basename(target) : `${id}.tgz`;
  const file = isFileTarget ? dest : resolve(dest, name);
  log('generalDebug_0003', `Assume package name "${name}".`);

  const content = await getPiletContentDir(root, pckg);
  const files = [resolve(root, 'package.json'), content];
  const readme = resolve(root, 'README.md');

  if (Array.isArray(pckg.files)) {
    files.push(...pckg.files.map((f) => resolve(root, f)));
  }

  if (await checkExists(readme)) {
    files.push(readme);
  }

  const prefix = join(tmpdir(), `${id}-`);
  const cwd = await makeTempDir(prefix);
  log('generalDebug_0003', `Creating package with content from "${content}" ...`);

  await Promise.all(files.filter(onlyUnique).map((file) => copy(file, resolve(cwd, relative(root, file)))));

  log('generalDebug_0003', `Creating directory if not exist for "${file}" ...`);

  await createDirectory(dirname(file));

  log('generalDebug_0003', `Creating compressed archive at "${file}" relative to "${root}" ...`);

  await createTgz(
    file,
    cwd,
    files.map((f) => relative(root, f)),
  );

  log('generalDebug_0003', `Successfully created package from "${cwd}".`);

  await removeDirectory(cwd);

  log('generalDebug_0003', `Packed file "${file}".`);
  return file;
}
