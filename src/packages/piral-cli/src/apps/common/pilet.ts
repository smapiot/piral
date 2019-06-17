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

function getPath(path: string) {
  try {
    require.resolve(path);
    return path;
  } catch (_) {
    return require.resolve(path, {
      paths: [__dirname],
    });
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
        console.log('in here ... %s', item.value);
        // remove the first character (/) to prepare for concat
        const path = JSON.stringify(JSON.parse(match[1]).substr(1));
        const bundleURL = JSON.stringify(getPath('parcel-bundler/src/builtins/bundle-url'));
        item.value = `var r=require(${bundleURL}).getBundleURL();module.exports=r+${path};`;
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

export function postProcess(bundle: Bundler.ParcelBundle) {
  const promise = new Promise<void>((resolve, reject) => {
    if (/js|css/.test(bundle.type)) {
      readFile(bundle.name, 'utf8', (err, data) => {
        if (err) {
          return reject(err);
        }

        // Replace all the relative /src/img paths with the absolute prodution URL
        // https://gist.github.com/dfkaye/f43dbdfbcdee427dbe4339870ed979d0
        //let result = /js/.test(child.type) ? transformHTML(data) : transformCSS(data);
        let result = data;

        if (/js/.test(bundle.type)) {
          /*
           * Wrap the JavaScript output bundle in an IIFE, fixing `global` and
           * `parcelRequire` declaration problems, and preventing `parcelRequire`
           * from leaking into global (window).
           * @see https://github.com/parcel-bundler/parcel/issues/1401
           */

          result = [
            "!(function(global,parcelRequire){'use strict;'",
            result
              .split('"function"==typeof parcelRequire&&parcelRequire')
              .join('"function"==typeof global.$pr&&global.$pr'),
            ';global.$pr=parcelRequire}(window, window.$pr));',
          ].join('\n');
        }

        writeFile(bundle.name, result, 'utf8', err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
  });
  const promises = [promise];

  (bundle as any).childBundles.forEach(child => promises.push(postProcess(child)));

  return Promise.all(promises).then(() => {});
}
