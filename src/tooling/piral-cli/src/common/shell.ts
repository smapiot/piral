import { progress } from './log';
import {
  combinePackageRef,
  dissectPackageName,
  getPackageName,
  getPackageVersion,
  installNpmPackage,
  isLinkedPackage,
} from './npm';
import { NpmClientType } from '../types';

export async function installPiralInstance(
  usedSource: string,
  baseDir: string,
  rootDir: string,
  npmClient: NpmClientType,
): Promise<[name: string, version: string]> {
  const [sourceName, sourceVersion, hadVersion, type] = await dissectPackageName(baseDir, usedSource);
  const isLocal = isLinkedPackage(sourceName, type, hadVersion, rootDir);

  if (!isLocal) {
    const packageRef = combinePackageRef(sourceName, sourceVersion, type);

    progress(`Installing npm package %s ...`, packageRef);
    await installNpmPackage(npmClient, packageRef, rootDir, '--save-dev', '--save-exact');
  } else {
    progress(`Using locally available npm package %s ...`, sourceName);
  }

  const packageName = await getPackageName(rootDir, sourceName, type);
  const packageVersion = getPackageVersion(hadVersion, sourceName, sourceVersion, type, rootDir);

  return [packageName, packageVersion];
}
