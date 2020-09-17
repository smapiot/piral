import { resolve } from 'path';
import { log } from './log';
import { getPatch } from './patches';
import { computeHash } from './hash';
import { ForceOverwrite } from './enums';
import {
  getFileNames,
  checkIsDirectory,
  readJson,
  writeJson,
  writeText,
  checkExists,
  readText,
  createFileIfNotExists,
} from './io';

async function patchModule(packageName: string, rootDir: string) {
  const applyPatchAt = getPatch(packageName);

  if (typeof applyPatchAt === 'function') {
    log('generalDebug_0003', `Applying patchers for ${packageName} in "${rootDir}" ...`);
    await applyPatchAt(rootDir);
  }
}
// See https://github.com/smapiot/piral/issues/121#issuecomment-572055594
const defaultIgnoredPackages = ['core-js'];

/**
 * The motivation for this method came from:
 * https://github.com/parcel-bundler/parcel/issues/1655#issuecomment-568175592
 * General idea:
 * Treat all modules as non-optimized for the current output target.
 * This makes sense in general as only the application should determine the target.
 */
async function patch(staticPath: string, ignoredPackages: Array<string>) {
  log('generalDebug_0003', `Patching files in "${staticPath}" ...`);
  const folderNames = await getFileNames(staticPath);
  return Promise.all(
    folderNames.map(async (folderName) => {
      if (!ignoredPackages.includes(folderName)) {
        const rootName = resolve(staticPath, folderName);
        const isDirectory = await checkIsDirectory(rootName);

        if (isDirectory) {
          if (folderName.startsWith('@')) {
            // if we are scoped, just go down
            await patch(rootName, ignoredPackages);
          } else {
            try {
              const packageFileData = await readJson(rootName, 'package.json');

              if (packageFileData.name && packageFileData._piralOptimized === undefined) {
                packageFileData._piralOptimized = packageFileData.browserslist || true;
                delete packageFileData.browserslist;

                await writeJson(rootName, 'package.json', packageFileData, true);
                await writeText(rootName, '.browserslistrc', 'node 10.11');
                await patchModule(folderName, rootName);
              }

              await patchFolder(rootName, ignoredPackages);
            } catch (e) {
              log('generalDebug_0003', `Encountered a patching error: ${e}`);
            }
          }
        }
      }
    }),
  );
}

async function patchFolder(rootDir: string, ignoredPackages: Array<string>) {
  const file = '.patched';
  const modulesDir = resolve(rootDir, 'node_modules');
  const exists = await checkExists(modulesDir);

  if (exists) {
    const lockContent = (await readText(rootDir, 'package-lock.json')) || (await readText(rootDir, 'yarn.lock'));
    const currHash = computeHash(lockContent);
    const prevHash = await readText(modulesDir, file);
    log('generalDebug_0003', `Evaluated patch module hashes: "${currHash}" and "${prevHash}".`);

    if (prevHash !== currHash) {
      await patch(modulesDir, ignoredPackages);
      await createFileIfNotExists(modulesDir, file, currHash, ForceOverwrite.yes);
    }
  }
}

export async function patchModules(rootDir: string, ignoredPackages = defaultIgnoredPackages) {
  log('generalDebug_0003', `Patching modules starting in "${rootDir}" ...`);
  const otherRoot = resolve(require.resolve('piral-cli/package.json'), '..', '..', '..');
  await patchFolder(rootDir, ignoredPackages);

  if (otherRoot !== rootDir) {
    log('generalDebug_0003', `Also patching modules in "${otherRoot}" ...`);
    await patchFolder(otherRoot, ignoredPackages);
  }
}
