import { readdir, statSync } from 'fs';
import { join, resolve, basename } from 'path';
import * as api from './api';
import { resolvers } from './resolvers';
import { CliPlugin } from './types';

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
      readdir(rootDir, (_, files) => {
        const prefix = 'piral-cli-';
        const pluginPaths = (files || [])
          .filter(m => m.startsWith(prefix) && m.length > prefix.length)
          .map(m => join(rootDir, m))
          .filter(m => statSync(m).isDirectory());
        resolve(pluginPaths);
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
      const plugin: CliPlugin = require(pluginPath);

      if (typeof plugin === 'function') {
        plugin(api);
      }
    } catch (ex) {
      console.warn(`Failed to load plugin from "${pluginPath}": ${ex}`);
    }
  }
}
