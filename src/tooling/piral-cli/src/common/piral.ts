import { join } from 'path';
import { runScript } from './scripts';
import { removeDirectory } from './io';
import { flattenExternals } from './package';
import { log, logDone, logInfo, progress } from './log';
import { createEmulatorSources, createEmulatorWebsite, packageEmulator } from './emulator';
import { emulatorName, emulatorPackageName, emulatorSourcesName, emulatorWebsiteName, releaseName } from './constants';
import { callPiralBuild } from '../bundler';
import { LogLevels, SharedDependency } from '../types';

async function runLifecycle(root: string, scripts: Record<string, string>, type: string) {
  const script = scripts?.[type];

  if (script) {
    log('generalDebug_0003', `Running "${type}" ("${script}") ...`);
    await runScript(script, root);
    log('generalDebug_0003', `Finished running "${type}".`);
  } else {
    log('generalDebug_0003', `No script for "${type}" found ...`);
  }
}

export interface BaseBuildPiralOptions {
  root: string;
  targetDir: string;
  logLevel: LogLevels;
  bundlerName: string;
  externals: Array<SharedDependency>;
  ignored: Array<string>;
  outFile: string;
  entryFiles: string;
  optimizeModules: boolean;
  sourceMaps: boolean;
  watch: boolean;
  contentHash: boolean;
  piralInstances: Array<string>;
  scripts?: Record<string, string>;
  hooks?: {
    beforeBuild?(e: any): Promise<void>;
    afterBuild?(e: any): Promise<void>;
    beforeEmulator?(e: any): Promise<void>;
    afterEmulator?(e: any): Promise<void>;
    beforePackage?(e: any): Promise<void>;
    afterPackage?(e: any): Promise<void>;
  };
  _: Record<string, any>;
}

export interface BuildEmulatorOptions extends BaseBuildPiralOptions {
  emulatorType: string;
}

export async function triggerBuildEmulator({
  root,
  logLevel,
  externals,
  emulatorType,
  bundlerName,
  optimizeModules,
  sourceMaps,
  watch,
  ignored,
  contentHash,
  targetDir,
  outFile,
  scripts,
  entryFiles,
  piralInstances,
  hooks,
  _,
}: BuildEmulatorOptions) {
  progress('Starting emulator build ...');

  const emulatorPublicUrl = '/';
  const appDir = emulatorType !== emulatorWebsiteName ? join(targetDir, 'app') : targetDir;

  // since we create this anyway let's just pretend we want to have it clean!
  await removeDirectory(targetDir);

  await hooks.beforeBuild?.({ root, publicUrl: emulatorPublicUrl, externals, entryFiles, targetDir, piralInstances });

  logInfo(`Bundle ${emulatorName} ...`);

  const {
    dir: outDir,
    name,
    hash,
  } = await callPiralBuild(
    {
      root,
      piralInstances,
      emulator: true,
      standalone: false,
      optimizeModules,
      sourceMaps,
      watch,
      contentHash,
      minify: false,
      externals: flattenExternals(externals),
      publicUrl: emulatorPublicUrl,
      entryFiles,
      logLevel,
      ignored,
      outDir: appDir,
      outFile,
      _,
    },
    bundlerName,
  );

  await hooks.afterBuild?.({
    root,
    publicUrl: emulatorPublicUrl,
    externals,
    entryFiles,
    targetDir,
    piralInstances,
    hash,
    outDir,
    outFile: name,
  });

  await runLifecycle(root, scripts, 'piral:postbuild');
  await runLifecycle(root, scripts, `piral:postbuild-${emulatorName}`);

  await hooks.beforeEmulator?.({ root, externals, targetDir, outDir });

  let rootDir = root;

  switch (emulatorType) {
    case emulatorPackageName:
      rootDir = await createEmulatorSources(root, externals, outDir, outFile, logLevel);
      await hooks.beforePackage?.({ root, externals, targetDir, outDir, rootDir });
      await packageEmulator(rootDir);
      await hooks.afterPackage?.({ root, externals, targetDir, outDir, rootDir });
      break;
    case emulatorSourcesName:
      rootDir = await createEmulatorSources(root, externals, outDir, outFile, logLevel);
      logDone(`Emulator package sources available in "${rootDir}".`);
      break;
    case emulatorWebsiteName:
      rootDir = await createEmulatorWebsite(root, externals, outDir, outFile, logLevel);
      logDone(`Emulator website available in "${rootDir}".`);
      break;
  }

  await hooks.afterEmulator?.({ root, externals, targetDir, outDir, rootDir });
}

export interface BuildShellOptions extends BaseBuildPiralOptions {
  minify: boolean;
  publicUrl: string;
}

export async function triggerBuildShell({
  root,
  targetDir,
  bundlerName,
  minify,
  optimizeModules,
  entryFiles,
  piralInstances,
  sourceMaps,
  logLevel,
  ignored,
  watch,
  outFile,
  publicUrl,
  contentHash,
  externals,
  hooks,
  scripts,
  _,
}: BuildShellOptions) {
  progress('Starting release build ...');

  // since we create this anyway let's just pretend we want to have it clean!
  await removeDirectory(targetDir);

  logInfo(`Bundle ${releaseName} ...`);

  await hooks.beforeBuild?.({ root, publicUrl, externals, entryFiles, targetDir, piralInstances });

  const {
    dir: outDir,
    name,
    hash,
  } = await callPiralBuild(
    {
      root,
      piralInstances,
      emulator: false,
      standalone: false,
      optimizeModules,
      sourceMaps,
      watch,
      contentHash,
      minify,
      externals: flattenExternals(externals),
      publicUrl,
      outFile,
      outDir: targetDir,
      entryFiles,
      logLevel,
      ignored,
      _,
    },
    bundlerName,
  );

  await hooks.afterBuild?.({
    root,
    publicUrl,
    externals,
    entryFiles,
    targetDir,
    piralInstances,
    outDir,
    outFile: name,
    hash,
  });

  await runLifecycle(root, scripts, 'piral:postbuild');
  await runLifecycle(root, scripts, `piral:postbuild-${releaseName}`);

  logDone(`Files for publication available in "${outDir}".`);
}
