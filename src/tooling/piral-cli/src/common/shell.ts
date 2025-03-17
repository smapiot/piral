import { Agent } from 'https';
import { progress } from './log';
import { packageJson, piletJson } from './constants';
import { readJson, updateExistingJson, writeJson } from './io';
import { scaffoldFromEmulatorWebsite } from './website';
import { combinePackageRef, getPackageName, getPackageVersion } from './npm';
import { dissectPackageName, installNpmPackage, isLinkedPackage } from './npm';
import { NpmClient, PackageType, PiralInstanceDetails } from '../types';

async function updatePiletJson(target: string, appName: string, appDetails: PiralInstanceDetails) {
  const oldContent = await readJson(target, piletJson);
  const newContent = {
    ...oldContent,
    piralInstances: {
      ...oldContent.piralInstances,
      [appName]: appDetails,
    },
  };
  await writeJson(target, piletJson, newContent, true);
  await updateExistingJson(target, packageJson, {
    importmap: {
      inherit: [appName],
    },
  });
}

async function setupPiralInstance(
  sourceName: string,
  type: PackageType,
  hadVersion: boolean,
  rootDir: string,
  sourceVersion: string,
  npmClient: NpmClient,
) {
  if (!isLinkedPackage(sourceName, type, hadVersion, rootDir)) {
    const packageRef = combinePackageRef(sourceName, sourceVersion, type);

    progress(`Installing npm package %s ...`, packageRef);
    await installNpmPackage(npmClient, packageRef, rootDir, '--save-dev', '--save-exact');
    return await getPackageName(rootDir, sourceName, type);
  } else {
    progress(`Using locally available npm package %s ...`, sourceName);
    const packageName = await getPackageName(rootDir, sourceName, type);
    const packageVersion = getPackageVersion(hadVersion, sourceName, sourceVersion, type, rootDir);
    await updateExistingJson(rootDir, packageJson, {
      devDependencies: {
        [packageName]: packageVersion,
      },
    });
    return packageName;
  }
}

export async function installPiralInstance(
  usedSource: string,
  baseDir: string,
  rootDir: string,
  npmClient: NpmClient,
  agent: Agent,
  selected?: boolean,
): Promise<string> {
  const [sourceName, sourceVersion, hadVersion, type] = await dissectPackageName(baseDir, usedSource, npmClient);

  if (type === 'remote') {
    const emulator = await scaffoldFromEmulatorWebsite(rootDir, sourceName, agent);
    const packageName = emulator.name;
    await updatePiletJson(rootDir, packageName, {
      selected,
      url: sourceName,
    });
    return packageName;
  } else {
    const packageName = await setupPiralInstance(sourceName, type, hadVersion, rootDir, sourceVersion, npmClient);
    await updatePiletJson(rootDir, packageName, {
      selected,
    });
    return packageName;
  }
}
