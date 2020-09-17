import { readdir, stat } from 'fs';
import { join, resolve } from 'path';
import { log } from './common';
import { inject } from './inject';

function getLocalPackageDir() {
  return resolve(__dirname, '..', '..');
}

function isDirectory(dir: string) {
  return new Promise<boolean>((resolve, reject) => {
    stat(dir, (err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats.isDirectory());
      }
    });
  });
}

function listDirectory(rootDir: string) {
  return new Promise<Array<string>>((resolve) => {
    readdir(rootDir, (_, files) => resolve(files || []));
  });
}

async function isPluginDirectory(dir: string) {
  try {
    return await isDirectory(dir);
  } catch (err) {
    log('generalDebug_0003', `Could not load the plugin at "${dir}": ${err}`);
    return false;
  }
}

function isPlugin(name: string) {
  const prefix = 'piral-cli-';
  return name.startsWith(prefix) && name.length > prefix.length;
}

function isScope(name: string) {
  const prefix = '@';
  return name.startsWith(prefix) && name.length > prefix.length;
}

async function fillPlugins(candidates: Array<string>, plugins: Array<string>) {
  await Promise.all(
    candidates.map(async (path) => {
      if (await isPluginDirectory(path)) {
        plugins.push(path);
      }
    }),
  );
}

async function getAllPlugins(rootDir: string): Promise<Array<string>> {
  if (rootDir) {
    log('generalDebug_0003', `Getting plugins from dir "${rootDir}" ...`);
    const pluginPaths = await listDirectory(rootDir);
    const plugins: Array<string> = [];
    const nested = pluginPaths.filter(isScope).map((m) => join(rootDir, m));

    await Promise.all([
      fillPlugins(
        pluginPaths.filter(isPlugin).map((m) => join(rootDir, m)),
        plugins,
      ),
      ...nested.map(async (path) => {
        const files = await listDirectory(path);
        await fillPlugins(
          files.filter(isPlugin).map((m) => join(path, m)),
          plugins,
        );
      }),
    ]);

    return plugins;
  } else {
    log('generalDebug_0003', `Skipping plugins from dir "${rootDir}" ...`);
    return [];
  }
}

export async function loadPlugins() {
  const localDir = getLocalPackageDir();
  const allPlugins = await getAllPlugins(localDir);

  for (const pluginPath of allPlugins) {
    inject(pluginPath);
  }
}
