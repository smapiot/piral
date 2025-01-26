import { readdir, stat } from 'fs';
import { join, resolve, sep, posix } from 'path';
import { cliName, cliVersion, log } from './common';
import { inject } from './inject';

var rx = new RegExp(`/\\.pnpm/${cliName}@${cliVersion}(_[a-z0-9@_\\-\\.]+)?/node_modules/${cliName}/`);

function getContainerDir() {
  const currentDir = __dirname.split(sep).join(posix.sep);

  if (!rx.test(currentDir)) {
    return resolve(__dirname, '..', '..');
  }

  return undefined;
}

async function getLocalPackageDir() {
  const proposedDirs = [
    getContainerDir(),
    resolve(process.cwd(), 'node_modules'),
    resolve(process.cwd(), '..', 'node_modules'),
    resolve(process.cwd(), '..', '..', 'node_modules'),
    resolve(process.cwd(), '..', '..', '..', 'node_modules'),
  ];

  // Right now we always take the first one, but in the future this may be different
  // once we come up with more / better criteria to identify if its a good/valid
  // plugin root directory
  for (const dir of proposedDirs.filter(Boolean)) {
    log('generalDebug_0003', `Checking for potential plugin directory "${dir}" ...`);

    if (await isValidModulesDirectory(dir)) {
      return dir;
    }
  }

  return undefined;
}

function isValidModulesDirectory(dir: string) {
  return isDirectory(resolve(dir, 'piral-cli'));
}

function isDirectory(dir: string) {
  return new Promise<boolean>((resolve) => {
    stat(dir, (err, stats) => {
      if (err) {
        // this happens, e.g., when the path does not exist
        // see: https://github.com/smapiot/piral/issues/624
        resolve(false);
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
  const localDir = await getLocalPackageDir();
  const allPlugins = await getAllPlugins(localDir);

  for (const pluginPath of allPlugins) {
    inject(pluginPath);
  }
}
