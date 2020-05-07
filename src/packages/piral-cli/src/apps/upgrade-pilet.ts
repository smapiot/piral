import { resolve } from 'path';
import { LogLevels, NpmClientType } from '../types';
import {
  readJson,
  installPackage,
  checkExistingDirectory,
  patchPiletPackage,
  copyPiralFiles,
  getFileStats,
  readPiralPackage,
  getPiletsInfo,
  runScript,
  installDependencies,
  getCurrentPackageDetails,
  checkAppShellPackage,
  defaultCacheDir,
  removeDirectory,
  setLogLevel,
  progress,
  fail,
  log,
  logDone,
  determineNpmClient,
  ForceOverwrite,
} from '../common';

export interface UpgradePiletOptions {
  version?: string;
  target?: string;
  forceOverwrite?: ForceOverwrite;
  logLevel?: LogLevels;
  install?: boolean;
  npmClient?: NpmClientType;
}

export const upgradePiletDefaults: UpgradePiletOptions = {
  version: undefined,
  target: '.',
  forceOverwrite: ForceOverwrite.no,
  logLevel: LogLevels.info,
  install: true,
  npmClient: undefined,
};

export async function upgradePilet(baseDir = process.cwd(), options: UpgradePiletOptions = {}) {
  const {
    version = upgradePiletDefaults.version,
    target = upgradePiletDefaults.target,
    forceOverwrite = upgradePiletDefaults.forceOverwrite,
    logLevel = upgradePiletDefaults.logLevel,
    install = upgradePiletDefaults.install,
  } = options;
  setLogLevel(logLevel);
  const root = resolve(baseDir, target);
  const cache = resolve(root, defaultCacheDir);
  const valid = await checkExistingDirectory(root);

  if (!valid) {
    fail('invalidPiletTarget_0040');
  }

  const npmClient = await determineNpmClient(root, options.npmClient);
  const pckg = await readJson(root, 'package.json');
  const { devDependencies = {}, piral } = pckg;

  if (piral && typeof piral === 'object') {
    const sourceName = piral.name;

    if (!sourceName || typeof sourceName !== 'string') {
      fail('invalidPiletPackage_0042');
    }

    const currentVersion = devDependencies[sourceName];

    if (!currentVersion || typeof currentVersion !== 'string') {
      fail('invalidPiralReference_0043');
    }

    const [packageRef, packageVersion] = await getCurrentPackageDetails(
      baseDir,
      sourceName,
      currentVersion,
      version,
      root,
    );
    const originalFiles = await getFileStats(root, sourceName);

    progress(`Updating NPM package to %s ...`, packageRef);

    await installPackage(npmClient, packageRef, root, '--no-save');

    const piralInfo = await readPiralPackage(root, sourceName);

    checkAppShellPackage(piralInfo);

    const { preUpgrade, postUpgrade } = getPiletsInfo(piralInfo);

    if (preUpgrade) {
      progress(`Running preUpgrade script ...`);
      log('generalDebug_0003', `Run: ${preUpgrade}`);
      await runScript(preUpgrade, root);
    }

    progress(`Taking care of templating ...`);

    await patchPiletPackage(root, sourceName, packageVersion, piralInfo);
    await copyPiralFiles(root, sourceName, forceOverwrite, originalFiles);

    if (install) {
      progress(`Updating dependencies ...`);
      await installDependencies(npmClient, root);
    }

    if (postUpgrade) {
      progress(`Running postUpgrade script ...`);
      log('generalDebug_0003', `Run: ${postUpgrade}`);
      await runScript(postUpgrade, root);
    }

    await removeDirectory(cache);
    logDone('Pilet upgraded successfully!');
  } else {
    fail('invalidPiletPackage_0041');
  }
}
