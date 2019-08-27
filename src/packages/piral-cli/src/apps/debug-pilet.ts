import { join, dirname, relative, resolve } from 'path';
import { findFile, runDebug, logFail } from '../common';

function findRoot(pck: string | Array<string>, baseDir: string, app = false) {
  if (Array.isArray(pck)) {
    for (const item of pck) {
      const result = findRoot(item, baseDir, app);

      if (result) {
        return result;
      }
    }
  } else {
    const suffix = app ? '/package.json' : '';

    try {
      const path = require.resolve(`${pck}${suffix}`, {
        paths: [baseDir],
      });

      if (app && path) {
        const relPath = require(path).app;

        if (relPath) {
          return resolve(dirname(path), relPath);
        }

        return undefined;
      }

      return path;
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
}

export const debugPiletDefaults = {
  entry: './src/index',
  port: 1234,
  logLevel: 3 as const,
};

export async function debugPilet(baseDir = process.cwd(), options: DebugPiletOptions = {}) {
  const {
    entry = debugPiletDefaults.entry,
    port = debugPiletDefaults.port,
    logLevel = debugPiletDefaults.logLevel,
    app,
  } = options;
  const entryFile = join(baseDir, entry);
  const targetDir = dirname(entryFile);
  const packageJson = await findFile(targetDir, 'package.json');

  if (!packageJson) {
    logFail('Cannot find the "%s". You need a valid package.json for your pilet.', 'package.json');
    throw new Error('Invalid pilet.');
  }

  const packageContent = require(packageJson);

  const appFile = findRoot(
    app || (packageContent.piral && packageContent.piral.name) || Object.keys(packageContent.devDependencies),
    targetDir,
    true,
  );

  if (!appFile) {
    logFail(
      'Cannot find the Piral instance. Make sure the "%s" of the Piral instance is valid (has an "%s" field).',
      'package.json',
      'app',
    );
    throw new Error('Invalid Piral instance selected.');
  }

  const coreFile = findRoot('piral-core', appFile);

  if (!coreFile) {
    logFail('Cannot find the package "%s". Make sure your dependencies are correctly resolved.', 'piral-core');
    throw new Error('Invalid dependency structure.');
  }

  await runDebug(port, appFile, {
    source: entryFile,
    logLevel,
    options: {
      target: dirname(entry),
      pilet: relative(dirname(coreFile), entryFile),
    },
  });
}
