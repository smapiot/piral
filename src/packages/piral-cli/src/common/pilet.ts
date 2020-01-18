import { resolve, dirname } from 'path';
import { VirtualPackager } from './VirtualPackager';

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
