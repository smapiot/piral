import * as Bundler from 'parcel-bundler';
import extendBundlerWithPlugins = require('parcel-plugin-codegen');
import { existsSync, statSync, readFile, writeFile } from 'fs';
import { resolve, dirname, basename } from 'path';
import { computeHash } from './hash';
import { logFail } from './log';
import { ParcelConfig, extendConfig } from './settings';
import { modifyBundlerForPilet, extendBundlerForPilet } from './pilet';
import { modifyBundlerForPiral, extendBundlerForPiral } from './piral';
import {
  checkExists,
  readJson,
  writeText,
  writeJson,
  createFileIfNotExists,
  checkIsDirectory,
  getFileNames,
  readText,
  ForceOverwrite,
} from './io';

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

export interface PiralBundlerSetup {
  type: 'piral';
  entryFiles: string;
  config: ParcelConfig;
}

export interface PiletBundlerSetup {
  type: 'pilet';
  targetDir: string;
  externals: Array<string>;
  entryModule: string;
  config: ParcelConfig;
}

export type BundlerSetup = PiralBundlerSetup | PiletBundlerSetup;

let original: any;

export function setupBundler(setup: BundlerSetup) {
  const proto = Bundler.prototype as any;
  let bundler: Bundler;

  if (!original) {
    original = proto.getLoadedAsset;
  } else {
    proto.getLoadedAsset = original;
  }

  if (setup.type === 'pilet') {
    const { entryModule, targetDir, externals, config } = setup;
    modifyBundlerForPilet(proto, externals, targetDir);
    bundler = new Bundler(entryModule, extendConfig(config));
    extendBundlerForPilet(bundler);
  } else {
    const { entryFiles, config } = setup;
    modifyBundlerForPiral(proto, dirname(entryFiles));
    bundler = new Bundler(entryFiles, extendConfig(config));
    extendBundlerForPiral(bundler);
  }

  extendBundlerWithPlugins(bundler);
  return bundler;
}

export interface BundleSource {
  children: Set<Bundler.ParcelBundle>;
  src: string;
  map: string;
}

export function gatherJsBundles(bundle: Bundler.ParcelBundle, gatheredBundles: Array<BundleSource> = []) {
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
          if (folderName.startsWith('@')) {
            // if we are scoped, just go down
            await patch(rootName, ignoredPackages);
          } else {
            try {
              const packageFileData = await readJson(rootName, 'package.json');

              if (packageFileData.name && packageFileData._piralOptimized === undefined) {
                delete packageFileData.browserslist;
                packageFileData._piralOptimized = true;

                await writeJson(rootName, 'package.json', packageFileData);
                await writeText(rootName, '.browserslistrc', 'node 10.11');
              }

              await patchFolder(rootName, ignoredPackages);
            } catch (e) {}
          }
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
  const file = '.patched';
  const prevHash = await readText(cacheDir, file);
  const lockContent = (await readText(rootDir, 'package-lock.json')) || (await readText(rootDir, 'yarn.lock'));
  const currHash = computeHash(lockContent);

  if (prevHash !== currHash) {
    await patchFolder(rootDir, ignoredPackages);
    await createFileIfNotExists(cacheDir, file, currHash, ForceOverwrite.yes);
  }
}

const bundleUrlRef = '__bundleUrl__';

function isFile(bundleDir: string, name: string) {
  const path = resolve(bundleDir, name);
  return existsSync(path) && statSync(path).isFile();
}

export function postProcess(bundle: Bundler.ParcelBundle, prName = '') {
  const bundleUrl = `var ${bundleUrlRef}=function(){try{throw new Error}catch(t){const e=(""+t.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\\/\\/[^)\\n]+/g);if(e)return e[0].replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\\/\\/.+)\\/[^\\/]+$/,"$1")+"/"}return"/"}();`;

  if (!prName) {
    prName = `pr_${(bundle as any).getHash()}`;
  }

  const bundles = gatherJsBundles(bundle);

  return Promise.all(
    bundles.map(
      ({ src, children }) =>
        new Promise<void>((resolve, reject) => {
          const bundleDir = dirname(src);

          readFile(src, 'utf8', (err, data) => {
            if (err) {
              return reject(err);
            }

            let result = data.replace(/^module\.exports="(.*)";$/gm, (str, value) => {
              if (isFile(bundleDir, value)) {
                return str.replace(`"${value}"`, `${bundleUrlRef}+"${value}"`);
              }

              return str;
            });

            /**
             * In pure JS bundles (i.e., we are not starting with an HTML file) Parcel
             * just omits the included CSS... This is bad (to say the least).
             * Here, we search for any sibling CSS bundles (there should be at most 1)
             * and include it asap using a standard approach.
             * Note: In the future we may allow users to disable this behavior (via a Piral
             * setting to disallow CSS inject).
             */
            const [cssBundle] = [...children].filter(m => /\.css$/.test(m.name));

            if (cssBundle) {
              const cssName = basename(cssBundle.name);
              const stylesheet = [
                `var d=document`,
                `var e=d.createElement("link")`,
                `e.type="text/css"`,
                `e.rel="stylesheet"`,
                `e.href=${bundleUrlRef}+${JSON.stringify(cssName)}`,
                `d.head.appendChild(e)`,
              ].join(';');
              result = `(function(){${stylesheet}})();${result}`;
            }

            /**
             * Wrap the JavaScript output bundle in an IIFE, fixing `global` and
             * `parcelRequire` declaration problems, and preventing `parcelRequire`
             * from leaking into global (window).
             * @see https://github.com/parcel-bundler/parcel/issues/1401
             */
            result = [
              `!(function(global,parcelRequire){'use strict';${bundleUrl}`,
              result
                .split('"function"==typeof parcelRequire&&parcelRequire')
                .join(`"function"==typeof global.${prName}&&global.${prName}`),
              `;global.${prName}=parcelRequire}(window, window.${prName}));`,
            ].join('\n');

            writeFile(src, result, 'utf8', err => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          });
        }),
    ),
  );
}
