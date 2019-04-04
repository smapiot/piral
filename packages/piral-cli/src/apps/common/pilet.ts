import * as Bundler from 'parcel-bundler';
import { writeFile, readFile } from 'fs';
import { VirtualPackager } from './VirtualPackager';
import { VirtualAsset } from './VirtualAsset';

function resolveModule(name: string) {
  try {
    return {
      name,
      path: require.resolve(name),
    };
  } catch (ex) {
    console.warn(`Could not find module ${name}.`);
    return undefined;
  }
}

export function extendBundler(bundler: any) {
  bundler.parser.registerExtension('vm', VirtualAsset);
  bundler.packagers.add('vm', VirtualPackager);
}

export function modifyBundler(proto: any, externalNames: Array<string>) {
  const externals = externalNames.map(resolveModule).filter(m => !!m);
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

        // Fail the build if the transforms didn't work
        // assert(result.match(RegExp(getProdSrc(), 'g')), 'should match at least one transformed URL for ' + child.name);

        if (/js/.test(bundle.type)) {
          /*
           * Wrap the JavaScript output bundle in an IIFE, fixing `global` and
           * `parcelRequire` declaration problems, and preventing `parcelRequire`
           * from leaking into global (window).
           * @see https://github.com/parcel-bundler/parcel/issues/1401
           */

          result = ["!(function(global,parcelRequire){'use strict;'", result, '}(window));'].join('\n');
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
