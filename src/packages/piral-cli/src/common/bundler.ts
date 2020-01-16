import { ParcelBundle } from 'parcel-bundler';
import { transformFileAsync } from '@babel/core';
import { resolve, dirname, basename } from 'path';
import { logInfo, logFail } from './log';
import { computeHash } from './hash';
import {
  removeDirectory,
  checkExists,
  readJson,
  writeText,
  writeJson,
  checkIsDirectory,
  getFileNames,
  readText,
} from './io';

const bundleWithCodegen = require('parcel-plugin-codegen');

export async function openBrowser(shouldOpen: boolean, port: number) {
  if (shouldOpen) {
    try {
      const open = require('opn');
      await open(`http://localhost:${port}`, undefined);
    } catch (err) {
      logFail(`Unexpected error while opening in browser: ${err}`);
    }
  }
}

export function extendBundlerWithPlugins(bundler: any) {
  bundleWithCodegen(bundler);
}

export async function clearCache(root: string, dir = '.cache') {
  const cacheDir = resolve(root, dir);
  const exists = await checkExists(cacheDir);

  if (exists) {
    await removeDirectory(cacheDir);
  }
}

interface BundleSource {
  children: Set<ParcelBundle>;
  src: string;
  map: string;
}

export function gatherJsBundles(bundle: ParcelBundle, gatheredBundles: Array<BundleSource> = []) {
  if (bundle.type === 'js') {
    let map = undefined;

    for (const childBundle of bundle.childBundles) {
      if (childBundle.name.endsWith('.js.map')) {
        map = childBundle.name;
        break;
      }
    }

    gatheredBundles.push({
      children: bundle.childBundles,
      src: bundle.name,
      map,
    });
  }

  for (const childBundle of bundle.childBundles) {
    gatherJsBundles(childBundle, gatheredBundles);
  }

  return gatheredBundles;
}

/**
 * Changes the files from the generated bundle to *really*
 * follow the desired preset environment - which includes also
 * packages coming from node_modules.
 * @param mainBundle The main bundle coming from Parcel.
 * @param rootDir The project's root dir.
 */
export function postTransform(mainBundle: ParcelBundle, rootDir: string) {
  const bundles = gatherJsBundles(mainBundle);

  logInfo('Post-transforming the emitted bundle(s) ...');

  return Promise.all(
    bundles.map(async bundle => {
      const inputSourceMap = bundle.map && (await readJson(dirname(bundle.map), basename(bundle.map)));

      const { code, map } = await transformFileAsync(bundle.src, {
        presets: [['@babel/preset-env']],
        sourceMaps: true,
        minified: true,
        inputSourceMap,
        sourceType: 'script',
        cwd: rootDir,
      });

      await writeText(dirname(bundle.src), basename(bundle.src), code);

      if (bundle.map) {
        await writeJson(dirname(bundle.map), basename(bundle.map), map);
      }
    }),
  );
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
  const folderNames = await getFileNames(staticPath);
  return Promise.all(
    folderNames.map(async folderName => {
      if (!ignoredPackages.includes(folderName)) {
        const rootName = resolve(staticPath, folderName);
        const isDirectory = await checkIsDirectory(rootName);

        if (isDirectory) {
          try {
            const packageFileData = await readJson(rootName, 'package.json');

            if (packageFileData._piralOptimized === undefined) {
              delete packageFileData['browserslist'];
              packageFileData._piralOptimized = true;

              await writeJson(rootName, 'package.json', packageFileData);
              await writeText(rootName, '.browserslistrc', 'node 10.11');
            }

            await patchFolder(rootName, ignoredPackages);
          } catch (e) {}
        }
      }
    }),
  );
}

async function patchFolder(rootDir: string, ignoredPackages: Array<string>) {
  const modulesDir = resolve(rootDir, 'node_modules');
  const exists = await checkExists(modulesDir);

  if (exists) {
    await patch(modulesDir, ignoredPackages);
  }
}

export async function patchModules(rootDir: string, cacheDir: string, ignoredPackages = defaultIgnoredPackages) {
  const target = resolve(rootDir, cacheDir);
  const file = '.patched';
  const prevHash = await readText(target, file);
  const lockContent = (await readText(rootDir, 'package-lock.json')) || (await readText(rootDir, 'yarn.lock'));
  const currHash = computeHash(lockContent);

  if (prevHash !== currHash) {
    await patchFolder(rootDir, ignoredPackages);
    await writeText(target, file, currHash);
  }
}
