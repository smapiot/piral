import { join, dirname, relative, resolve } from 'path';
import { findFile, runDebug } from './common';

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
}

export const debugPiletDefaults = {
  entry: './src/index',
  port: 1234,
};

export async function debugPilet(baseDir = process.cwd(), options: DebugPiletOptions = {}) {
  const { entry = debugPiletDefaults.entry, port = debugPiletDefaults.port, app } = options;
  const entryFile = join(baseDir, entry);
  const targetDir = dirname(entryFile);
  const packageJson = await findFile(targetDir, 'package.json');

  if (!packageJson) {
    console.error('Cannot find any package.json. You need a valid package.json for your pilet.');
    throw new Error('Invalid pilet.');
  }

  const packageContent = require(packageJson);

  const appFile = findRoot(
    app || (packageContent.piral && packageContent.piral.name) || Object.keys(packageContent.devDependencies),
    targetDir,
    true,
  );

  if (!appFile) {
    console.error(
      'Cannot find the Piral instance. Make sure the package.json of the Piral instance is valid (has a `app` field).',
    );
    throw new Error('Invalid Piral instance selected.');
  }

  const coreFile = findRoot('piral-core', appFile);

  if (!coreFile) {
    console.error('Cannot find the piral-core package. Make sure your dependencies are correctly resolved.');
    throw new Error('Invalid dependency structure.');
  }

  await runDebug(port, appFile, undefined, {
    target: dirname(entry),
    pilet: relative(dirname(coreFile), entryFile),
  });
}
