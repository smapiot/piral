import { resolve, join, extname, basename, dirname } from 'path';
import { logFail } from './log';
import { cliVersion } from './info';
import { getDevDependencies, PiletLanguage } from './language';
import { readJson, copy, updateExistingJson, ForceOverwrite, findFile, checkExists, getHash } from './io';

export interface TemplateFileLocation {
  from: string;
  to: string;
}

export interface FileInfo {
  path: string;
  hash: string;
  changed: boolean;
}

function getPiralPath(root: string, name: string) {
  return resolve(root, 'node_modules', name);
}

function getPiralFile(root: string, name: string, file: string) {
  const path = getPiralPath(root, name);
  return join(path, file);
}

export function readPiralPackage(root: string, name: string) {
  const path = getPiralPath(root, name);
  return readJson(path, 'package.json');
}

export function getPiralPackage(app: string, language: PiletLanguage) {
  const baseData = {
    app,
    main: 'lib/index.js',
    pilets: {
      ...getPiletsInfo({}),
      scripts: {
        build: 'npm run build-pilet',
        start: 'npm run debug-pilet',
      },
    },
    devDependencies: {
      ...getDevDependencies(language),
      'piral-cli': 'latest',
    },
  };

  switch (language) {
    case PiletLanguage.ts:
      return {
        ...baseData,
        typings: 'lib/index.d.ts',
        scripts: {
          build: 'npm run build:deploy && npm run build:pilets',
          'build:deploy': 'piral build',
          'build:pilets': 'tsc',
        },
      };
    case PiletLanguage.js:
      return {
        ...baseData,
        scripts: {
          build: 'piral build',
        },
      };
  }

  return baseData;
}

export function getFileStats(
  root: string,
  name: string,
  files: Array<string | TemplateFileLocation> = [],
): Promise<Array<FileInfo>> {
  return Promise.all(
    files.map(async file => {
      const { from, to } = typeof file === 'string' ? { from: file, to: file } : file;
      const sourcePath = getPiralFile(root, name, from);
      const targetPath = resolve(root, to);
      const sourceHash = await getHash(sourcePath);
      const targetHash = await getHash(targetPath);
      return {
        path: targetPath,
        hash: targetHash,
        changed: sourceHash !== targetHash,
      };
    }),
  );
}

export async function copyPiralFiles(
  root: string,
  name: string,
  files: Array<string | TemplateFileLocation>,
  forceOverwrite: ForceOverwrite,
  originalFiles: Array<FileInfo> = [],
) {
  for (const file of files) {
    const { from, to } = typeof file === 'string' ? { from: file, to: file } : file;
    const sourcePath = getPiralFile(root, name, from);
    const targetPath = resolve(root, to);
    const overwrite = originalFiles.some(m => m.path === targetPath && !m.changed);
    const force = overwrite ? ForceOverwrite.yes : forceOverwrite;
    await copy(sourcePath, targetPath, force);
  }
}

export interface PiletsInfo {
  files: Array<string>;
  externals: Array<string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
  preScaffold: string;
  postScaffold: string;
  preUpgrade: string;
  postUpgrade: string;
}

export function getPiletsInfo(piralInfo: any): PiletsInfo {
  const {
    files = [],
    externals = [],
    scripts = {},
    devDependencies = {},
    preScaffold = '',
    postScaffold = '',
    preUpgrade = '',
    postUpgrade = '',
  } = piralInfo.pilets || {};
  return {
    files,
    externals,
    devDependencies,
    scripts,
    preScaffold,
    postScaffold,
    preUpgrade,
    postUpgrade,
  };
}

export async function retrievePiralRoot(baseDir: string, entry: string) {
  const rootDir = join(baseDir, entry);

  if (extname(rootDir) !== '.html') {
    const packageName = basename(rootDir) === 'package.json' ? rootDir : join(rootDir, 'package.json');
    const exists = await checkExists(packageName);

    if (!exists) {
      logFail(`Cannot find a valid entry point. Missing package.json in "%s".`, rootDir);
      throw new Error('Invalid Piral instance.');
    }

    const { app } = require(packageName);

    if (!app) {
      logFail(`Cannot find a valid entry point. Missing field "%s" in the "%s".`, 'app', 'package.json');
      throw new Error('Invalid Piral instance.');
    }

    return join(dirname(packageName), app);
  }

  return rootDir;
}

export async function retrievePiletsInfo(entryFile: string) {
  const exists = await checkExists(entryFile);

  if (!exists) {
    logFail(`The given entry pointing to "%s" does not exist.`, entryFile);
    throw new Error('Invalid Piral instance.');
  }

  const packageJson = await findFile(entryFile, 'package.json');

  if (!packageJson) {
    logFail('Cannot find any package.json. You need a valid package.json for your Piral instance.');
    throw new Error('Invalid Piral instance.');
  }

  const packageInfo = require(packageJson);

  return {
    ...getPiletsInfo(packageInfo),
    name: packageInfo.name,
    version: packageInfo.version,
  };
}

export async function patchPiletPackage(root: string, name: string, version: string, piralInfo: any) {
  const piralDependencies = piralInfo.dependencies || {};
  const { files, externals, scripts, devDependencies, ...rest } = getPiletsInfo(piralInfo);
  await updateExistingJson(root, 'package.json', {
    piral: {
      comment: 'Keep this section to allow running `piral upgrade`.',
      name,
      version: piralInfo.version,
      tooling: cliVersion,
      externals,
      devDependencies,
      scripts,
      files,
      ...rest,
    },
    devDependencies: {
      ...devDependencies,
      ...externals.reduce(
        (deps, name) => {
          deps[name] = piralDependencies[name] || 'latest';
          return deps;
        },
        {} as Record<string, string>,
      ),
      [name]: `${version || piralInfo.version}`,
      'piral-cli': `^${cliVersion}`,
    },
    peerDependencies: {
      ...externals.reduce(
        (deps, name) => {
          deps[name] = '*';
          return deps;
        },
        {} as Record<string, string>,
      ),
      '@dbeining/react-atom': '*',
      '@libre/atom': '*',
      history: '*',
      react: '*',
      'react-dom': '*',
      'react-router': '*',
      'react-router-dom': '*',
      tslib: '*',
      'path-to-regexp': '*',
      [name]: `*`,
    },
    scripts: {
      'debug-pilet': 'pilet debug',
      'build-pilet': 'pilet build',
      'upgrade-pilet': 'pilet upgrade',
      ...scripts,
    },
  });
  return files;
}
