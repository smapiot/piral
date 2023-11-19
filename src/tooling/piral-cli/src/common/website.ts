import { resolve as resolveUrl } from 'url';
import { join, resolve } from 'path';
import { createPiralStubIndexIfNotExists } from './template';
import { packageJson } from './constants';
import { ForceOverwrite } from './enums';
import { createDirectory, writeBinary } from './io';
import { writeJson } from './io';
import { axios } from '../external';
import { EmulatorWebsiteManifestFiles, EmulatorWebsiteManifest } from '../types';

async function downloadEmulatorFiles(manifestUrl: string, target: string, files: EmulatorWebsiteManifestFiles) {
  const requiredFiles = [files.typings, files.main, files.app];

  await Promise.all(
    requiredFiles.map(async (file) => {
      const res = await axios.default.get(resolveUrl(manifestUrl, file), { responseType: 'arraybuffer' });
      const data: Buffer = res.data;
      await writeBinary(target, file, data);
    }),
  );
}

export async function scaffoldFromEmulatorWebsite(rootDir: string, manifestUrl: string) {
  const response = await axios.default.get(manifestUrl);
  const emulatorJson: EmulatorWebsiteManifest = response.data;

  const targetDir = resolve(rootDir, 'node_modules', emulatorJson.name);
  const appDirName = 'app';
  const mainFile = 'index.js';
  const appDir = resolve(targetDir, appDirName);
  await createDirectory(appDir);

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
      files: emulatorJson.files,
      main: `./${join(appDirName, mainFile)}`,
      typings: `./${join(appDirName, emulatorJson.files.typings)}`,
      app: `./${join(appDirName, emulatorJson.files.app)}`,
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
  return emulatorJson;
}
