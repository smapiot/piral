import { basename, dirname, isAbsolute, relative, resolve } from 'path';
import { config } from './config';
import { removeDirectory } from './io';
import { ForceOverwrite } from './enums';
import { logInfo, progress } from './log';
import { defaultSchemaVersion } from './constants';
import { createPiletDeclaration } from './declaration';
import { combinePiletExternals, retrievePiletData, validateSharedDependencies } from './package';
import { callPiletBuild } from '../bundler';
import { LogLevels, PiletSchemaVersion } from '../types';

const defaultOutput = 'dist/index.js';

function isSubDir(parent: string, dir: string) {
  const rel = relative(parent, dir);
  return rel && !rel.startsWith('..') && !isAbsolute(rel);
}

function getTarget(root: string, main: string, source: string, target?: string) {
  if (typeof target === 'undefined') {
    const propDest = resolve(root, main);
    const propDestDir = dirname(propDest);
    const usePropDest = propDestDir !== root && propDestDir !== source && isSubDir(root, propDest);
    return usePropDest ? propDest : resolve(root, defaultOutput);
  }

  return resolve(root, target);
}

export interface BuildPiletOptions {
  entryModule: string;
  app?: string;
  originalSchemaVersion: PiletSchemaVersion;
  target?: string;
  fresh: boolean;
  logLevel: LogLevels;
  bundlerName: string;
  optimizeModules: boolean;
  sourceMaps: boolean;
  watch: boolean;
  contentHash: boolean;
  minify: boolean;
  declaration: boolean;
  hooks?: {
    beforeBuild?(e: any): Promise<void>;
    afterBuild?(e: any): Promise<void>;
    beforeDeclaration?(e: any): Promise<void>;
    afterDeclaration?(e: any): Promise<void>;
  };
  _: Record<string, any>;
}

export async function triggerBuildPilet({
  target,
  app,
  originalSchemaVersion,
  fresh,
  entryModule,
  logLevel,
  optimizeModules,
  sourceMaps,
  watch,
  contentHash,
  declaration,
  minify,
  hooks,
  bundlerName,
  _,
}: BuildPiletOptions) {
  const targetDir = dirname(entryModule);
  const { peerDependencies, peerModules, root, apps, piletPackage, ignored, importmap, schema } =
    await retrievePiletData(targetDir, app);
  const schemaVersion = originalSchemaVersion || schema || config.schemaVersion || defaultSchemaVersion;
  const piralInstances = apps.map((m) => m.appPackage.name);
  const externals = combinePiletExternals(piralInstances, peerDependencies, peerModules, importmap);
  const { main = defaultOutput } = piletPackage;
  const dest = getTarget(root, main, targetDir, target);
  const outDir = dirname(dest);
  const outFile = basename(dest);

  validateSharedDependencies(importmap);

  if (fresh) {
    progress('Removing output directory ...');
    await removeDirectory(outDir);
  }

  logInfo('Bundle pilet ...');

  await hooks.beforeBuild?.({ root, outDir, importmap, entryModule, schemaVersion, piletPackage });

  await callPiletBuild(
    {
      root,
      piralInstances,
      optimizeModules,
      sourceMaps,
      watch,
      contentHash,
      minify,
      externals,
      targetDir,
      importmap,
      outFile,
      outDir,
      entryModule: `./${relative(root, entryModule)}`,
      logLevel,
      version: schemaVersion,
      ignored,
      _,
    },
    bundlerName,
  );

  await hooks.afterBuild?.({ root, outDir, importmap, entryModule, schemaVersion, piletPackage });

  if (declaration) {
    await hooks.beforeDeclaration?.({ root, outDir, entryModule, piletPackage });
    await createPiletDeclaration(
      piralInstances,
      root,
      entryModule,
      externals,
      outDir,
      ForceOverwrite.yes,
      logLevel,
    );
    await hooks.afterDeclaration?.({ root, outDir, entryModule, piletPackage });
  }

  return {
    piletPackage,
    root,
    outDir,
    apps,
    outFile,
    dest,
  };
}
