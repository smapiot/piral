import { join, relative, resolve } from 'path';
import { createPiralStubIndexIfNotExists } from './template';
import { config } from './config';
import { packageJson } from './constants';
import { ForceOverwrite } from './enums';
import { createDirectory, readJson, writeBinary } from './io';
import { writeJson } from './io';
import { progress, log } from './log';
import { axios } from '../external';
import { EmulatorWebsiteManifestFiles, EmulatorWebsiteManifest } from '../types';

function requestManifest(url: string) {
  const auth = config.auth?.[url];

  switch (auth?.mode) {
    case 'header':
      return axios.default.get(url, {
        headers: {
          [auth.key]: auth.value,
        },
      });
    case 'http':
      return axios.default.get(url, {
        auth: {
          username: auth.username,
          password: auth.password,
        },
      });
    default:
      return axios.default.get(url);
  }
}

async function downloadEmulatorFiles(manifestUrl: string, target: string, files: EmulatorWebsiteManifestFiles) {
  const requiredFiles = [files.typings, files.main, files.app];

  await Promise.all(
    requiredFiles.map(async (file) => {
      const url = new URL(file, manifestUrl);
      const res = await axios.default.get(url.href, { responseType: 'arraybuffer' });
      const data: Buffer = res.data;
      await writeBinary(target, file, data);
    }),
  );
}

async function createEmulatorFiles(
  targetDir: string,
  appDir: string,
  manifestUrl: string,
  emulatorJson: EmulatorWebsiteManifest,
) {
  const mainFile = 'index.js';
  const appDirName = relative(targetDir, appDir);

  await writeJson(
    targetDir,
    packageJson,
    {
      name: emulatorJson.name,
      description: emulatorJson.description,
      version: emulatorJson.version,
      importmap: emulatorJson.importmap,
      pilets: emulatorJson.scaffolding.pilets,
      piralCLI: {
        version: emulatorJson.scaffolding.cli,
        timestamp: emulatorJson.timestamp,
        source: manifestUrl,
        generated: true,
      },
      files: emulatorJson.files.assets,
      main: join(appDirName, mainFile),
      typings: join(appDirName, emulatorJson.files.typings),
      app: join(appDirName, emulatorJson.files.app),
      peerDependencies: {},
      optionalDependencies: emulatorJson.dependencies.optional,
      devDependencies: emulatorJson.dependencies.included,
    },
    true,
  );

  // actually including this one hints that the app shell should have been included - which is forbidden
  await createPiralStubIndexIfNotExists(appDir, mainFile, ForceOverwrite.yes, {
    name: emulatorJson.name,
    outFile: emulatorJson.files.main,
  });

  await downloadEmulatorFiles(manifestUrl, appDir, emulatorJson.files);
}

export async function updateFromEmulatorWebsite(targetDir: string, manifestUrl: string) {
  progress(`Updating emulator from %s ...`, manifestUrl);

  try {
    const response = await requestManifest(manifestUrl);
    const nextEmulator: EmulatorWebsiteManifest = response.data;
    const currentEmulator = await readJson(targetDir, packageJson);

    if (currentEmulator.name !== nextEmulator.name) {
      log('remoteEmulatorNameChanged_0121', currentEmulator.name);
    } else if (currentEmulator.piralCLI.timstamp !== nextEmulator.timestamp) {
      log('generalDebug_0003', `The timestamp on "${currentEmulator.name}" is different (${nextEmulator.timestamp}).`);
      const appDir = resolve(targetDir, 'app');
      await createEmulatorFiles(targetDir, appDir, manifestUrl, nextEmulator);
    } else {
      log('generalDebug_0003', `Nothing to update for "${currentEmulator.name}".`);
    }
  } catch (ex) {
    log('generalDebug_0003', `HTTP request for emulator update failed: ${ex}`);
    log('skipEmulatorUpdate_0120', manifestUrl);
  }
}

export async function scaffoldFromEmulatorWebsite(rootDir: string, manifestUrl: string) {
  progress(`Downloading emulator from %s ...`, manifestUrl);
  const response = await requestManifest(manifestUrl);
  const emulatorJson: EmulatorWebsiteManifest = response.data;
  const targetDir = resolve(rootDir, 'node_modules', emulatorJson.name);
  const appDir = resolve(targetDir, 'app');
  await createDirectory(appDir);
  await createEmulatorFiles(targetDir, appDir, manifestUrl, emulatorJson);
  return { name: emulatorJson.name, path: targetDir };
}
