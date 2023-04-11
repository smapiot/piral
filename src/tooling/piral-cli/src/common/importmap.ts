import { resolve, dirname, isAbsolute, basename } from 'path';
import { log, fail } from './log';
import { satisfies, validate } from './version';
import { computeHash } from './hash';
import { getHash, readJson, findFile, checkExists, checkIsDirectory } from './io';
import { tryResolvePackage } from './npm';
import { SharedDependency, Importmap } from '../types';

const shorthandsUrls = ['', '.', '...'];

function addLocalDependencies(
  dependencies: Array<SharedDependency>,
  realIdentifier: string,
  identifier: string,
  version: string,
  requireVersion: string,
  entry: string,
  assetName: string,
) {
  const alias = realIdentifier !== identifier ? realIdentifier : undefined;

  dependencies.push({
    id: `${identifier}@${version}`,
    requireId: `${identifier}@${requireVersion}`,
    entry,
    name: identifier,
    ref: `${assetName}.js`,
    type: 'local',
    alias,
  });
}

function getDependencyDetails(depName: string): [assetName: string, identifier: string, versionSpec: string] {
  const sep = depName.indexOf('@', 1);
  const version = sep > 0 ? depName.substring(sep + 1) : '';
  const id = sep > 0 ? depName.substring(0, sep) : depName;
  const assetName = (id.startsWith('@') ? id.substring(1) : id).replace(/[\/\.]/g, '-').replace(/(\-)+/, '-');
  return [assetName, id, version];
}

async function getLocalDependencyVersion(
  packageJson: string,
  depName: string,
  versionSpec: string,
): Promise<[realIdentifier: string, offeredVersion: string, requiredVersion: string]> {
  const packageDir = dirname(packageJson);
  const packageFile = basename(packageJson);
  const details = await readJson(packageDir, packageFile);

  if (versionSpec) {
    if (!validate(versionSpec)) {
      fail('importMapVersionSpecInvalid_0026', depName);
    }

    if (!satisfies(details.version, versionSpec)) {
      fail('importMapVersionSpecNotSatisfied_0025', depName, details.version);
    }

    return [details.name, details.version, versionSpec];
  }

  return [details.name, details.version, details.version];
}

async function getInheritedDependencies(inheritedImport: string, dir: string): Promise<Array<SharedDependency>> {
  const packageJson = tryResolvePackage(`${inheritedImport}/package.json`, dir);

  if (packageJson) {
    const packageDir = dirname(packageJson);
    const packageDetails = await readJson(packageDir, 'package.json');
    return readImportmap(packageDir, packageDetails, true);
  } else {
    const directImportmap = tryResolvePackage(inheritedImport, dir);

    if (directImportmap) {
      const baseDir = dirname(directImportmap);
      const content = await readJson(baseDir, basename(directImportmap));
      return await resolveImportmap(baseDir, content);
    }
  }

  return [];
}

async function resolveImportmap(dir: string, importmap: Importmap): Promise<Array<SharedDependency>> {
  const dependencies: Array<SharedDependency> = [];
  const sharedImports = importmap?.imports;
  const inheritedImports = importmap?.inherit;

  if (typeof sharedImports === 'object' && sharedImports) {
    for (const depName of Object.keys(sharedImports)) {
      const url = sharedImports[depName];
      const [assetName, identifier, versionSpec] = getDependencyDetails(depName);

      if (typeof url !== 'string') {
        log('generalInfo_0000', `The value of "${depName}" in the importmap is not a string and will be ignored.`);
      } else if (/^https?:\/\//.test(url)) {
        const hash = computeHash(url).substring(0, 7);

        dependencies.push({
          id: `${identifier}@${hash}`,
          requireId: `${identifier}@${hash}`,
          entry: url,
          name: identifier,
          ref: url,
          type: 'remote',
        });
      } else if (url === identifier || shorthandsUrls.includes(url)) {
        const entry = tryResolvePackage(identifier, dir);

        if (entry) {
          const packageJson = await findFile(dirname(entry), 'package.json');
          const [realIdentifier, version, requireVersion] = await getLocalDependencyVersion(
            packageJson,
            depName,
            versionSpec,
          );

          addLocalDependencies(dependencies, realIdentifier, identifier, version, requireVersion, entry, assetName);
        } else {
          fail('importMapReferenceNotFound_0027', dir, identifier);
        }
      } else if (!url.startsWith('.') && !isAbsolute(url)) {
        const entry = tryResolvePackage(url, dir);

        if (entry) {
          const packageJson = await findFile(dirname(entry), 'package.json');
          const [realIdentifier, version, requireVersion] = await getLocalDependencyVersion(
            packageJson,
            depName,
            versionSpec,
          );

          addLocalDependencies(dependencies, realIdentifier, identifier, version, requireVersion, entry, assetName);
        } else {
          fail('importMapReferenceNotFound_0027', dir, url);
        }
      } else {
        const entry = resolve(dir, url);
        const exists = await checkExists(entry);

        if (exists) {
          const isDirectory = await checkIsDirectory(entry);
          const packageJson = isDirectory
            ? resolve(entry, 'package.json')
            : await findFile(dirname(entry), 'package.json');
          const packageJsonExists = await checkExists(packageJson);

          if (packageJsonExists) {
            const [realIdentifier, version, requireVersion] = await getLocalDependencyVersion(
              packageJson,
              depName,
              versionSpec,
            );

            addLocalDependencies(
              dependencies,
              realIdentifier,
              identifier,
              version,
              requireVersion,
              isDirectory ? tryResolvePackage(entry, dir) : entry,
              assetName,
            );
          } else if (isDirectory) {
            fail('importMapReferenceNotFound_0027', entry, 'package.json');
          } else {
            const hash = await getHash(entry);

            dependencies.push({
              id: `${identifier}@${hash}`,
              requireId: `${identifier}@${hash}`,
              entry,
              name: identifier,
              ref: `${assetName}.js`,
              type: 'local',
            });
          }
        } else {
          fail('importMapReferenceNotFound_0027', dir, url);
        }
      }
    }
  }

  if (Array.isArray(inheritedImports)) {
    for (const inheritedImport of inheritedImports) {
      const otherDependencies = await getInheritedDependencies(inheritedImport, dir);

      for (const dependency of otherDependencies) {
        const entry = dependencies.find((dep) => dep.name === dependency.name);

        if (!entry) {
          dependencies.push({
            ...dependency,
            parents: [inheritedImport],
          });
        } else if (Array.isArray(entry.parents)) {
          entry.parents.push(inheritedImport);
        }
      }
    }
  }

  return dependencies;
}

export async function readImportmap(
  dir: string,
  packageDetails: any,
  inherited = false,
): Promise<Array<SharedDependency>> {
  const importmap = packageDetails.importmap;

  if (typeof importmap === 'string') {
    const notFound = {};
    const content = await readJson(dir, importmap, notFound);

    if (content === notFound) {
      fail('importMapFileNotFound_0028', dir, importmap);
    }

    const baseDir = dirname(resolve(dir, importmap));
    return await resolveImportmap(baseDir, content);
  } else if (typeof importmap === 'undefined' && inherited) {
    // Fall back to sharedDependencies or pilets.external if available
    const shared: Array<string> = packageDetails.sharedDependencies ?? packageDetails.pilets?.externals;

    if (Array.isArray(shared)) {
      return shared.map((dep) => ({
        id: dep,
        name: dep,
        entry: dep,
        type: 'local',
        ref: undefined,
        requireId: dep,
      }));
    }
  }

  return await resolveImportmap(dir, importmap);
}
