import { resolve, dirname, isAbsolute, basename } from 'path';
import { log, fail } from './log';
import { satisfies, validate } from './version';
import { computeHash } from './hash';
import { getHash, readJson, findFile, checkExists, checkIsDirectory } from './io';
import { tryResolvePackage } from './npm';
import { SharedDependency, Importmap, ImportmapVersions, ImportmapMode } from '../types';

const shorthandsUrls = ['', '.', '...'];

function addLocalDependencies(
  dependencies: Array<SharedDependency>,
  realIdentifier: string,
  identifier: string,
  version: string,
  requireVersion: string,
  entry: string,
  assetName: string,
  isAsync: boolean,
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
    isAsync,
  });
}

function getAnyPatch(version: string) {
  const [major, minor] = version.split('.');
  return `~${major}.${minor}.0`;
}

function getMatchMajor(version: string) {
  const [major] = version.split('.');
  return `^${major}.0.0`;
}

function makeAssetName(id: string) {
  return (id.startsWith('@') ? id.substring(1) : id).replace(/[\/\.]/g, '-').replace(/(\-)+/, '-');
}

function getDependencyDetails(
  depName: string,
  availableSpecs: Record<string, string>,
): [assetName: string, identifier: string, versionSpec: string, isAsync: boolean] {
  const name = depName.replace(/\?+$/, '');
  const isAsync = depName.endsWith('?');
  const sep = name.indexOf('@', 1);

  if (sep > 0) {
    const id = name.substring(0, sep);
    const version = name.substring(sep + 1);
    const assetName = makeAssetName(id);
    return [assetName, id, version, isAsync];
  } else {
    const version = availableSpecs[name] || '';
    const assetName = makeAssetName(name);
    return [assetName, name, version, isAsync];
  }
}

async function getLocalDependencyVersion(
  packageJson: string,
  depName: string,
  versionSpec: string,
  versionBehavior: ImportmapVersions,
): Promise<[realIdentifier: string, offeredVersion: string, requiredVersion: string]> {
  const packageDir = dirname(packageJson);
  const packageFile = basename(packageJson);
  const details = await readJson(packageDir, packageFile);

  if (versionSpec) {
    if (!validate(versionSpec)) {
      fail('importMapVersionSpecInvalid_0026', depName);
    }

    if (!satisfies(details.version, versionSpec)) {
      fail('importMapVersionSpecNotSatisfied_0025', depName, details.version, versionSpec);
    }

    return [details.name, details.version, versionSpec];
  }

  switch (versionBehavior) {
    case 'all':
      return [details.name, details.version, '*'];
    case 'match-major':
      return [details.name, details.version, getMatchMajor(details.version)];
    case 'any-patch':
      return [details.name, details.version, getAnyPatch(details.version)];
    case 'exact':
    default:
      return [details.name, details.version, details.version];
  }
}

async function getInheritedDependencies(
  inheritedImport: string,
  dir: string,
  excludedDependencies: Array<string>,
  inheritanceBehavior: ImportmapMode,
): Promise<Array<SharedDependency>> {
  const packageJson = tryResolvePackage(`${inheritedImport}/package.json`, dir);

  if (packageJson) {
    const packageDir = dirname(packageJson);
    const packageDetails = await readJson(packageDir, 'package.json');
    return await consumeImportmap(packageDir, packageDetails, true, 'exact', inheritanceBehavior, excludedDependencies);
  } else {
    const directImportmap = tryResolvePackage(inheritedImport, dir);

    if (directImportmap) {
      const baseDir = dirname(directImportmap);
      const content = await readJson(baseDir, basename(directImportmap));
      return await resolveImportmap(baseDir, content, {
        availableSpecs: {},
        inheritanceBehavior,
        excludedDependencies,
        ignoreFailure: true,
        versionBehavior: 'exact',
      });
    }
  }

  return [];
}

interface ImportmapResolutionOptions {
  availableSpecs: Record<string, string>;
  excludedDependencies: Array<string>;
  versionBehavior: ImportmapVersions;
  inheritanceBehavior: ImportmapMode;
  ignoreFailure: boolean;
}

async function resolveImportmap(
  dir: string,
  importmap: Importmap,
  options: ImportmapResolutionOptions,
): Promise<Array<SharedDependency>> {
  const dependencies: Array<SharedDependency> = [];
  const sharedImports = importmap?.imports;
  const inheritedImports = importmap?.inherit;
  const excludedImports = importmap?.exclude;

  const onUnresolved = (name: string, version: string) => {
    if (options.ignoreFailure) {
      const id = version ? `${name}@${version}` : name;
      log('skipUnresolvedDependency_0054', id);
    } else {
      fail('importMapReferenceNotFound_0027', dir, name);
    }
  };

  if (typeof sharedImports === 'object' && sharedImports) {
    for (const depName of Object.keys(sharedImports)) {
      const url = sharedImports[depName];
      const [assetName, identifier, versionSpec, isAsync] = getDependencyDetails(depName, options.availableSpecs);

      if (options.excludedDependencies.includes(identifier)) {
        continue;
      } else if (typeof url !== 'string') {
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
          isAsync,
        });
      } else if (url === identifier || shorthandsUrls.includes(url)) {
        const entry = tryResolvePackage(identifier, dir);

        if (entry) {
          const packageJson = await findFile(dirname(entry), 'package.json');
          const [realIdentifier, version, requireVersion] = await getLocalDependencyVersion(
            packageJson,
            depName,
            versionSpec,
            options.versionBehavior,
          );

          addLocalDependencies(
            dependencies,
            realIdentifier,
            identifier,
            version,
            requireVersion,
            entry,
            assetName,
            isAsync,
          );
        } else {
          onUnresolved(identifier, versionSpec);
        }
      } else if (!url.startsWith('.') && !isAbsolute(url)) {
        const entry = tryResolvePackage(url, dir);

        if (entry) {
          const packageJson = await findFile(dirname(entry), 'package.json');
          const [realIdentifier, version, requireVersion] = await getLocalDependencyVersion(
            packageJson,
            depName,
            versionSpec,
            options.versionBehavior,
          );

          addLocalDependencies(
            dependencies,
            realIdentifier,
            identifier,
            version,
            requireVersion,
            entry,
            assetName,
            isAsync,
          );
        } else {
          onUnresolved(url, versionSpec);
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
              options.versionBehavior,
            );

            addLocalDependencies(
              dependencies,
              realIdentifier,
              identifier,
              version,
              requireVersion,
              isDirectory ? tryResolvePackage(entry, dir) : entry,
              assetName,
              isAsync,
            );
          } else if (isDirectory) {
            onUnresolved(entry, versionSpec);
          } else {
            const hash = await getHash(entry);

            dependencies.push({
              id: `${identifier}@${hash}`,
              requireId: `${identifier}@${hash}`,
              entry,
              name: identifier,
              ref: `${assetName}.js`,
              type: 'local',
              isAsync,
            });
          }
        } else {
          onUnresolved(url, versionSpec);
        }
      }
    }
  }

  if (Array.isArray(inheritedImports)) {
    const includedImports = [...options.excludedDependencies, ...dependencies.map((m) => m.name)];
    const excluded = Array.isArray(excludedImports) ? [...includedImports, ...excludedImports] : includedImports;

    for (const inheritedImport of inheritedImports) {
      const otherDependencies = await getInheritedDependencies(
        inheritedImport,
        dir,
        excluded,
        options.inheritanceBehavior,
      );

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
async function consumeImportmap(
  dir: string,
  packageDetails: any,
  inherited: boolean,
  versionBehavior: ImportmapVersions,
  mode: ImportmapMode,
  excludedDependencies: Array<string>,
): Promise<Array<SharedDependency>> {
  const importmap = packageDetails.importmap;
  const appShell = inherited && mode === 'remote';
  const availableSpecs = appShell ? packageDetails.devDependencies ?? {} : {};
  const inheritanceBehavior = appShell ? 'host' : mode;

  if (typeof importmap === 'string') {
    const notFound = {};
    const content = await readJson(dir, importmap, notFound);

    if (content === notFound) {
      fail('importMapFileNotFound_0028', dir, importmap);
    }

    const baseDir = dirname(resolve(dir, importmap));
    return await resolveImportmap(baseDir, content, {
      availableSpecs,
      ignoreFailure: inherited,
      excludedDependencies,
      versionBehavior,
      inheritanceBehavior,
    });
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

  return await resolveImportmap(dir, importmap, {
    availableSpecs,
    excludedDependencies,
    ignoreFailure: inherited,
    versionBehavior,
    inheritanceBehavior,
  });
}

export function readImportmap(
  dir: string,
  packageDetails: any,
  versionBehavior: ImportmapVersions = 'exact',
  inheritanceBehavior: ImportmapMode = 'remote',
): Promise<Array<SharedDependency>> {
  return consumeImportmap(dir, packageDetails, false, versionBehavior, inheritanceBehavior, []);
}
