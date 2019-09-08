import { readdir, existsSync } from 'fs';
import { join, dirname, delimiter, normalize, resolve, basename } from 'path';
import * as api from './api';

const isWin32 = process.platform === 'win32';

// See: http://nodejs.org/docs/latest/api/modules.html#modules_loading_from_the_global_folders
// required?
function fromNode() {
  const nodePath = process.env.NODE_PATH;

  if (nodePath) {
    const nodePaths = nodePath.split(delimiter).map(normalize);

    for (let i = 0, l = nodePath.length; i < l; i += 1) {
      const modulePath = nodePaths[i];

      if (modulePath && existsSync(modulePath)) {
        return modulePath;
      }
    }
  }

  return undefined;
}

function fromHome() {
  const homePath = isWin32 ? process.env['USERPROFILE'] : process.env['HOME'];
  const paths = ['node_modules', 'node_libraries', 'node_packages'];

  for (let i = 0, l = paths.length; i < l; i += 1) {
    const modulePath = join(homePath, paths[i]);

    if (modulePath && existsSync(modulePath)) {
      return modulePath;
    }
  }

  return undefined;
}

// See: https://npmjs.org/doc/files/npm-folders.html#prefix-Configuration
// it uses execPath to discover the default prefix on *nix and %APPDATA% on Windows
function fromLibraries() {
  if (isWin32) {
    const prefix = join(process.env.APPDATA, 'npm');
    const path = join(prefix, 'node_modules');
    return existsSync(path) && path;
  } else {
    const prefix = join(dirname(process.execPath), '..');
    const path = join(prefix, 'lib', 'node_modules');
    return existsSync(path) && path;
  }
}

// Resolves packages using the node installation path
// Useful for resolving global packages such as npm when the prefix has been overriden by the user
function fromExecutable() {
  const execPath = dirname(process.execPath);
  const path = isWin32 ? execPath : join(execPath, '..', 'lib');
  return join(path, 'node_modules');
}

function fromEnvironment() {
  const nodeModule = process.env['NODE_MODULES'];

  if (typeof nodeModule === 'string') {
    const nodeModules = nodeModule.split(delimiter);

    for (let i = 0, l = nodeModules.length; i < l; i += 1) {
      const modulePath = nodeModules[i];

      if (modulePath && existsSync(modulePath)) {
        return modulePath;
      }
    }
  }

  return undefined;
}

// resolvers
const resolvers = [fromNode, fromHome, fromEnvironment, fromLibraries, fromExecutable];

function getGlobalPackageDir() {
  for (const resolver of resolvers) {
    const dir = resolver();

    if (dir) {
      return dir;
    }
  }

  return undefined;
}

function getLocalPackageDir() {
  return resolve(__dirname, '..', '..');
}

function getAllPlugins(rootDir: string): Promise<Array<string>> {
  return new Promise<Array<string>>(resolve => {
    if (rootDir) {
      readdir(rootDir, (err, files) => {
        resolve([]);
      });
    } else {
      resolve([]);
    }
  });
}

function includeUnique(localPlugins: Array<string>, value: string) {
  const globalPlugin = basename(value);

  for (const pluginPath of localPlugins) {
    const localPlugin = basename(pluginPath);

    if (localPlugin === globalPlugin) {
      return false;
    }
  }

  return true;
}

export async function loadPlugins() {
  const globalDir = getGlobalPackageDir();
  const localDir = getLocalPackageDir();
  const globalPlugins = await getAllPlugins(globalDir);
  const localPlugins = await getAllPlugins(localDir !== globalDir && localDir);
  const allPlugins = [...localPlugins, ...globalPlugins.filter(plugin => includeUnique(localPlugins, plugin))];

  for (const pluginPath of allPlugins) {
    try {
      const plugin = require(pluginPath);

      if (typeof plugin === 'function') {
        plugin(api);
      }
    } catch (ex) {
      console.warn(`Failed to load plugin from "${pluginPath}": ${ex}`);
    }
  }
}
