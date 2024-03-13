import { Agent } from 'https';
import { posix, relative, resolve } from 'path';
import { createPiralStubIndexIfNotExists } from './template';
import { getAuthorizationHeaders, getAxiosOptions, getCertificate, handleAxiosError } from './http';
import { packageJson } from './constants';
import { updateConfig } from './config';
import { ForceOverwrite } from './enums';
import { createDirectory, readJson, writeBinary } from './io';
import { writeJson } from './io';
import { progress, log } from './log';
import { axios, isInteractive } from '../external';
import { EmulatorWebsiteManifestFiles, EmulatorWebsiteManifest } from '../types';

async function requestManifest(url: string, interactive: boolean, httpsAgent?: Agent) {
  const opts = getAxiosOptions(url);

  try {
    return await axios.default.get(url, { ...opts, httpsAgent });
  } catch (error) {
    return await handleAxiosError(error, interactive, httpsAgent, async (mode, key) => {
      const headers = getAuthorizationHeaders(mode, key);
      await updateConfig('auth', {
        [url]: {
          mode: 'header',
          key: 'authorization',
          value: headers.authorization,
        },
      });
      return await requestManifest(url, false, httpsAgent);
    });
  }
}

async function downloadEmulatorFiles(
  manifestUrl: string,
  target: string,
  files: EmulatorWebsiteManifestFiles,
  httpsAgent?: Agent,
) {
  const requiredFiles = [files.typings, files.main, files.app];
  const opts = getAxiosOptions(manifestUrl);

  await Promise.all(
    requiredFiles.map(async (file) => {
      const url = new URL(file, manifestUrl);
      const res = await axios.default.get(url.href, { ...opts, httpsAgent, responseType: 'arraybuffer' });
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
  httpsAgent?: Agent,
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
      main: posix.join(appDirName, mainFile),
      typings: posix.join(appDirName, emulatorJson.files.typings),
      app: posix.join(appDirName, emulatorJson.files.app),
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

  await downloadEmulatorFiles(manifestUrl, appDir, emulatorJson.files, httpsAgent);
}

export async function updateFromEmulatorWebsite(targetDir: string, manifestUrl: string, interactive: boolean) {
  progress(`Updating emulator from %s ...`, manifestUrl);
  const ca = await getCertificate();
  const httpsAgent = ca ? new Agent({ ca }) : undefined;

  try {
    const response = await requestManifest(manifestUrl, interactive, httpsAgent);
    const nextEmulator: EmulatorWebsiteManifest = response.data;
    const currentEmulator = await readJson(targetDir, packageJson);

    if (currentEmulator.name !== nextEmulator.name) {
      log('remoteEmulatorNameChanged_0121', currentEmulator.name);
    } else if (currentEmulator.piralCLI.timstamp !== nextEmulator.timestamp) {
      log('generalDebug_0003', `The timestamp on "${currentEmulator.name}" is different (${nextEmulator.timestamp}).`);
      const appDir = resolve(targetDir, 'app');
      await createEmulatorFiles(targetDir, appDir, manifestUrl, nextEmulator, httpsAgent);
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
  const ca = await getCertificate();
  const httpsAgent = ca ? new Agent({ ca }) : undefined;
  const interactive = isInteractive();
  const response = await requestManifest(manifestUrl, interactive, httpsAgent);
  const emulatorJson: EmulatorWebsiteManifest = response.data;
  const targetDir = resolve(rootDir, 'node_modules', emulatorJson.name);
  const appDir = resolve(targetDir, 'app');
  await createDirectory(appDir);
  await createEmulatorFiles(targetDir, appDir, manifestUrl, emulatorJson, httpsAgent);
  return { name: emulatorJson.name, path: targetDir };
}
