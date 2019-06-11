import { resolve, join } from 'path';
import { readJson, copy, updateExistingJson, ForceOverwrite } from './io';
import { cliVersion } from './info';

export interface TemplateFileLocation {
  from: string;
  to: string;
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

export async function copyPiralFiles(
  root: string,
  name: string,
  files: Array<string | TemplateFileLocation>,
  forceOverwrite: ForceOverwrite,
) {
  for (const file of files) {
    const { from, to } = typeof file === 'string' ? { from: file, to: file } : file;
    const sourcePath = getPiralFile(root, name, from);
    const targetPath = resolve(root, to);
    await copy(sourcePath, targetPath, forceOverwrite);
  }
}

export interface PiletsInfo {
  files: Array<string>;
  externals: Array<string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
}

export function getPiletsInfo(piralInfo: any): PiletsInfo {
  const { files = [], externals = [], scripts = {}, devDependencies = {} } = piralInfo.pilets || {};
  return {
    files,
    externals,
    devDependencies,
    scripts,
  };
}

export async function patchPiletPackage(root: string, name: string, version?: string) {
  const piralInfo = await readPiralPackage(root, name);
  const piralDependencies = piralInfo.dependencies || {};
  const piralVersion = version || piralInfo.version;
  const { files, externals, scripts, devDependencies } = getPiletsInfo(piralInfo);
  await updateExistingJson(root, 'package.json', {
    piral: {
      comment: 'Keep this section to allow running `piral upgrade`.',
      name,
      version: piralVersion,
      tooling: cliVersion,
      externals,
      devDependencies,
      scripts,
      files,
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
      [name]: `${piralVersion}`,
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
      react: '*',
      'react-dom': '*',
      'react-router': '*',
      'react-router-dom': '*',
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
