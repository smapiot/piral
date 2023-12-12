import { resolve, relative, dirname, basename } from 'path';
import { createTgz } from './archive';
import { onlyUniqueFiles } from './utils';
import { log, progress, fail } from './log';
import { readJson, checkExists, createDirectory, checkIsDirectory, getFileNames } from './io';
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

async function getUniqueFiles(files: Array<string>) {
  const result: Array<string> = [];

  for (const file of files) {
    const isDirectory = await checkIsDirectory(file);

    if (isDirectory) {
      const names = await getFileNames(file);
      const subFiles = names.map((name) => resolve(file, name));
      const items = await getUniqueFiles(subFiles);
      const unique = items.filter((m) => onlyUniqueFiles(m, result.length, result));
      result.push(...unique);
    } else if (onlyUniqueFiles(file, result.length, result)) {
      result.push(file);
    }
  }

  return result;
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
    const additionalFiles = pckg.files
      .filter((f: string) => typeof f === 'string')
      .map((f: string) => resolve(root, f));
    files.push(...additionalFiles);
  }

  if (await checkExists(readme)) {
    files.push(readme);
  }

  log('generalDebug_0003', `Reading out unique files from "${content}" ...`);
  const uniqueFiles = await getUniqueFiles(files);

  // Edge case: If the files to be packaged contains the destination .tgz file, e.g., as a leftover
  // from a previous build/pack, exclude that file, because it will be overwritten/replaced in the
  // upcoming steps.
  if (uniqueFiles.includes(file)) {
    uniqueFiles.splice(uniqueFiles.indexOf(file), 1);
  }

  log('generalDebug_0003', `Creating directory if not exist for "${file}" ...`);
  await createDirectory(dirname(file));

  log('generalDebug_0003', `Creating compressed archive at "${file}" relative to "${root}" ...`);
  await createTgz(
    file,
    root,
    uniqueFiles.map((file) => relative(root, file)),
  );

  log('generalDebug_0003', `Successfully created package "${file}" from "${root}".`);
  return file;
}
