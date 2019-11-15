import * as Bundler from 'parcel-bundler';
import { writeFile, readFile, existsSync, statSync } from 'fs';
import { resolve, dirname, basename } from 'path';
import { VirtualPackager } from './VirtualPackager';

const bundleUrlRef = '__bundleUrl__';

function isFile(bundleDir: string, name: string) {
  const path = resolve(bundleDir, name);
  return existsSync(path) && statSync(path).isFile();
}

function resolveModule(name: string, targetDir: string) {
  try {
    const moduleDefinitionFile = `${name}/package.json`;
    const moduleDefinition = require(moduleDefinitionFile);
    const replacements = {};

    if (moduleDefinition) {
      const moduleRoot = dirname(require.resolve(moduleDefinitionFile));

      if (typeof moduleDefinition.browser === 'string') {
        return {
          name,
          path: resolve(moduleRoot, moduleDefinition.browser),
        };
      }

      if (typeof moduleDefinition.browser === 'object') {
        Object.keys(moduleDefinition.browser).forEach(repl => {
          const desired = moduleDefinition.browser[repl];
          replacements[resolve(moduleRoot, repl)] = resolve(moduleRoot, desired);
        });
      }

      if (typeof moduleDefinition.module === 'string') {
        const modulePath = resolve(moduleRoot, moduleDefinition.module);
        return {
          name,
          path: replacements[modulePath] || modulePath,
        };
      }
    }

    const directPath = require.resolve(name, {
      paths: [targetDir],
    });
    return {
      name,
      path: replacements[directPath] || directPath,
    };
  } catch (ex) {
    console.warn(`Could not find module ${name}.`);
    return undefined;
  }
}

export function extendBundlerForPilet(bundler: any) {
  bundler.parser.registerExtension('vm', require.resolve('./VirtualAsset'));
  bundler.packagers.add('vm', VirtualPackager);
}

export function modifyBundlerForPilet(proto: any, externalNames: Array<string>, targetDir: string) {
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
  const bundleUrl = `var ${bundleUrlRef}=function(){try{throw new Error}catch(t){const e=(""+t.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\\/\\/[^)\\n]+/g);if(e)return e[0].replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\\/\\/.+)\\/[^\\/]+$/,"$1")+"/"}return"/"}();`;

  if (!prName) {
    prName = `pr_${(bundle as any).getHash()}`;
  }

  const promise = new Promise<void>((resolve, reject) => {
    if (/js|css/.test(bundle.type)) {
      const bundleDir = dirname(bundle.name);

      readFile(bundle.name, 'utf8', (err, data) => {
        if (err) {
          return reject(err);
        }

        let result = data.replace(/^module\.exports="(.*)";$/gm, (str, value) => {
          if (isFile(bundleDir, value)) {
            return str.replace(`"${value}"`, `${bundleUrlRef}+"${value}"`);
          }

          return str;
        });

        if (/js/.test(bundle.type)) {
          /**
           * In pure JS bundles (i.e., we are not starting with an HTML file) Parcel
           * just omits the included CSS... This is bad (to say the least).
           * Here, we search for any sibling CSS bundles (there should be at most 1)
           * and include it asap using a standard approach.
           * Note: In the future we may llow users to disable this behavior (via a Piral
           * setting to disallow CSS inject).
           */
          const [cssBundle] = [...bundle.childBundles].filter(m => /\.css$/.test(m.name));

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
