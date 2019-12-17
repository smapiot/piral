import { ParcelBundle } from 'parcel-bundler';
import { transformFileAsync } from '@babel/core';
import { resolve, dirname, basename } from 'path';
import { removeDirectory, checkExists, readJson, writeText, writeJson } from './io';
import { logInfo, logFail } from './log';

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
  src: string;
  map: string;
}

function gatherJsBundles(bundle: ParcelBundle, gatheredBundles: Array<BundleSource> = []) {
  if (bundle.type === 'js') {
    let map = undefined;

    for (const childBundle of bundle.childBundles) {
      if (childBundle.name.endsWith('.js.map')) {
        map = childBundle.name;
        break;
      }
    }

    gatheredBundles.push({
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
