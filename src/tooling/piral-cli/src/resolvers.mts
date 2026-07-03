import { existsSync } from 'fs';
import { join, dirname, delimiter, normalize } from 'path';

const isWin32 = process.platform === 'win32';

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

function fromExecutable() {
  const execPath = dirname(process.execPath);
  const path = isWin32 ? execPath : join(execPath, '..', 'lib');
  return join(path, 'node_modules');
}

export const resolvers = [fromNode, fromHome, fromEnvironment, fromLibraries, fromExecutable];
