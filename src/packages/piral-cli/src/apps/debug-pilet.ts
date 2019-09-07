import { join, dirname, relative, resolve } from 'path';
import { findFile, runDebug, logFail } from '../common';

function findRoot(pck: string, baseDir: string) {
  try {
    const path = require.resolve(pck, {
      paths: [baseDir],
    });

    return path;
  } catch (ex) {
    return undefined;
  }
}

function findPackage(pck: string | Array<string>, baseDir: string) {
  if (Array.isArray(pck)) {
    for (const item of pck) {
      const result = findPackage(item, baseDir);

      if (result) {
        return result;
      }
    }
  } else {
    try {
      const path = require.resolve(`${pck}/package.json`, {
        paths: [baseDir],
      });

      const appPackage = require(path);
      const relPath = appPackage && appPackage.app;
      appPackage.app = relPath && resolve(dirname(path), relPath);
      return appPackage;
    } catch (ex) {
      return undefined;
    }
  }
}

export interface DebugPiletOptions {
  entry?: string;
  port?: number;
  app?: string;
  logLevel?: 1 | 2 | 3;
  fresh?: boolean;
}

export const debugPiletDefaults = {
  entry: './src/index',
  port: 1234,
  logLevel: 3 as const,
  fresh: false,
};

export async function debugPilet(baseDir = process.cwd(), options: DebugPiletOptions = {}) {
  const {
    entry = debugPiletDefaults.entry,
    port = debugPiletDefaults.port,
    logLevel = debugPiletDefaults.logLevel,
    fresh = debugPiletDefaults.fresh,
    app,
  } = options;
  const entryFile = join(baseDir, entry);
  const target = dirname(entryFile);
  const packageJson = await findFile(target, 'package.json');

  if (!packageJson) {
    logFail('Cannot find the "%s". You need a valid package.json for your pilet.', 'package.json');
    throw new Error('Invalid pilet.');
  }

  const root = dirname(packageJson);
  const packageContent = require(packageJson);

  const appPackage = findPackage(
    app || (packageContent.piral && packageContent.piral.name) || Object.keys(packageContent.devDependencies),
    target,
  );
  const appFile = appPackage && appPackage.app;

  if (!appFile) {
    logFail(
      'Cannot find the Piral instance. Make sure the "%s" of the Piral instance is valid (has an "%s" field).',
      'package.json',
      'app',
    );
    throw new Error('Invalid Piral instance selected.');
  }

  const coreFile = findRoot('piral-core', appFile);
  const externals = Object.keys(packageContent.peerDependencies);

  if (!coreFile) {
    logFail('Cannot find the package "%s". Make sure your dependencies are correctly resolved.', 'piral-core');
    throw new Error('Invalid dependency structure.');
  }

  await runDebug(port, appFile, {
    source: entryFile,
    logLevel,
    fresh,
    root,
    options: {
      target,
      pilet: relative(dirname(coreFile), entryFile),
      piral: appPackage.name,
      dependencies: externals,
    },
  });
}
