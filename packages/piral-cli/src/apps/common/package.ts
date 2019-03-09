import { resolve, join } from 'path';
import { readJson, copyFile, updateExistingJson } from './io';
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

export function copyPiralFiles(root: string, name: string, files: Array<string | TemplateFileLocation>) {
  for (const file of files) {
    const { from, to } = typeof file === 'string' ? { from: file, to: file } : file;
    const sourcePath = getPiralFile(root, name, from);
    const targetPath = resolve(root, to);
    copyFile(sourcePath, targetPath);
  }
}

export function patchPiletPackage(root: string, name: string, version?: string) {
  const piralInfo = readPiralPackage(root, name);
  const piralDependencies = piralInfo.dependencies || {};
  const piralVersion = version || piralInfo.version;
  const { files = [], sharedDependencies = [], scripts = {} } = piralInfo.pilets || {};
  updateExistingJson(root, 'package.json', {
    piral: {
      comment: 'Keep this section to allow running "piral upgrade".',
      name,
      version: piralVersion,
      tooling: cliVersion,
      sharedDependencies,
      scripts,
      files,
    },
    devDependencies: {
      ...sharedDependencies.reduce((deps, name) => {
        deps[name] = piralDependencies[name] || 'latest';
        return deps;
      }, {}),
      [name]: `${piralVersion}`,
      'pilet-cli': `^${cliVersion}`,
    },
    peerDependencies: {
      ...sharedDependencies.reduce((deps, name) => {
        deps[name] = '*';
        return deps;
      }, {}),
      '@dbeining/react-atom': '*',
      react: '*',
      'react-dom': '*',
      [name]: `*`,
    },
    scripts: {
      'debug-pilet': 'pilet debug',
      'build-pilet': 'pilet build',
      ...scripts,
    },
  });
  return files;
}
