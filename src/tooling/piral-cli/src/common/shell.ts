import { progress } from './log';
import { scaffoldFromEmulatorWebsite } from './website';
import { combinePackageRef, getPackageName, getPackageVersion } from './npm';
import { dissectPackageName, installNpmPackage, isLinkedPackage } from './npm';
import { NpmClientType, PiralInstanceDetails } from '../types';

export async function installPiralInstance(
  usedSource: string,
  baseDir: string,
  rootDir: string,
  npmClient: NpmClientType,
): Promise<[name: string, version: string, details: PiralInstanceDetails]> {
  const [sourceName, sourceVersion, hadVersion, type] = await dissectPackageName(baseDir, usedSource);

  if (type === 'remote') {
    progress(`Downloading emulator from %s ...`, sourceName);
    const emulatorJson = await scaffoldFromEmulatorWebsite(rootDir, sourceName);
    const details = {
      url: sourceName,
    };

    return [emulatorJson.name, emulatorJson.version, details];
  } else if (!isLinkedPackage(sourceName, type, hadVersion, rootDir)) {
    const packageRef = combinePackageRef(sourceName, sourceVersion, type);

    progress(`Installing npm package %s ...`, packageRef);
    await installNpmPackage(npmClient, packageRef, rootDir, '--save-dev', '--save-exact');
  } else {
    progress(`Using locally available npm package %s ...`, sourceName);
  }

  const packageName = await getPackageName(rootDir, sourceName, type);
  const packageVersion = getPackageVersion(hadVersion, sourceName, sourceVersion, type, rootDir);
  return [packageName, packageVersion, {}];
}
