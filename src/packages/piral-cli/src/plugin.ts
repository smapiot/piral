import { readdir, statSync } from 'fs';
import { join, resolve, basename } from 'path';
import { log } from './common';
import { resolvers } from './resolvers';
import { inject } from './inject';

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

function isPluginDirectory(dir: string) {
  try {
    return statSync(dir).isDirectory();
  } catch (err) {
    log('generalDebug_0003', `Could not load the plugin at "${dir}": ${err}`);
    return false;
  }
}

function getAllPlugins(rootDir: string): Promise<Array<string>> {
  return new Promise<Array<string>>(resolve => {
    if (rootDir) {
      log('generalDebug_0003', `Getting plugins from dir "${rootDir}" ...`);
      readdir(rootDir, (_, files) => {
        const prefix = 'piral-cli-';
        const pluginPaths = (files || [])
          .filter(m => m.startsWith(prefix) && m.length > prefix.length)
          .map(m => join(rootDir, m))
          .filter(isPluginDirectory);
        resolve(pluginPaths);
      });
    } else {
      log('generalDebug_0003', `Skipping plugins from dir "${rootDir}" ...`);
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
    inject(pluginPath);
  }
}
