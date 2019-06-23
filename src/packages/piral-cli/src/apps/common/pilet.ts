import * as Bundler from 'parcel-bundler';
import { writeFile, readFile } from 'fs';
import { resolve, dirname } from 'path';
import { VirtualPackager } from './VirtualPackager';
import { VirtualAsset } from './VirtualAsset';

function resolveModule(name: string, targetDir: string) {
  try {
    const moduleDefinitionFile = `${name}/package.json`;
    const moduleDefinition = require(moduleDefinitionFile);

    if (moduleDefinition && typeof moduleDefinition.module === 'string') {
      const moduleRoot = dirname(require.resolve(moduleDefinitionFile));

      return {
        name,
        path: resolve(moduleRoot, moduleDefinition.module),
      };
    }

    return {
      name,
      path: require.resolve(name, {
        paths: [targetDir],
      }),
    };
  } catch (ex) {
    console.warn(`Could not find module ${name}.`);
    return undefined;
  }
}

function modifyRawAsset(proto: any) {
  const g = proto.generate;
  proto.generate = function() {
    const result = g.call(this);

    if (Array.isArray(result) && result.length === 1) {
      const item = result[0];
      const match = /^module\.exports=(.*);$/.exec(item.value);

      if (match) {
        const path = JSON.stringify(JSON.parse(match[1]).substr(1));
        item.value = `module.exports=__bundleUrl__+${path};`;
      }
    }

    return result;
  };
}

export function extendBundler(bundler: any) {
  const RawAsset = bundler.parser.findParser('sample.png');
  bundler.parser.registerExtension('vm', VirtualAsset);
  bundler.packagers.add('vm', VirtualPackager);
  modifyRawAsset(RawAsset.prototype);
}

export function modifyBundler(proto: any, externalNames: Array<string>, targetDir: string) {
  const externals = externalNames.map(name => resolveModule(name, targetDir)).filter(m => !!m);
  const ra = proto.getLoadedAsset;
  proto.getLoadedAsset = function(path: string) {
    const [external] = externals.filter(m => m.path === path);

    if (external) {
      path = `/${external.name}.vm`;
    }

    return ra.call(this, path);
  };
}

export function postProcess(bundle: Bundler.ParcelBundle, prName = '') {
  const bundleUrl = `var __bundleUrl__=function(){try{throw new Error}catch(t){const e=(""+t.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\\/\\/[^)\\n]+/g);if(e)return e[0].replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\\/\\/.+)\\/[^\\/]+$/,"$1")+"/"}return"/"}();`;

  if (!prName) {
    prName = `pr_${(bundle as any).getHash()}`;
  }

  const promise = new Promise<void>((resolve, reject) => {
    if (/js|css/.test(bundle.type)) {
      readFile(bundle.name, 'utf8', (err, data) => {
        if (err) {
          return reject(err);
        }

        let result = data;

        if (/js/.test(bundle.type)) {
          /*
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
        } else if (/css/.test(bundle.type)) {
          // tbd
        }

        writeFile(bundle.name, result, 'utf8', err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    } else {
      resolve();
    }
  });
  const promises = [promise];

  (bundle as any).childBundles.forEach(child => promises.push(postProcess(child, prName)));

  return Promise.all(promises).then(() => {});
}
