import { resolve } from 'path';
import { LogLevels, NpmClientType } from '../types';
import { isInteractive } from '../external';
import {
  installNpmPackage,
  checkExistingDirectory,
  patchPiletPackage,
  copyPiralFiles,
  getFileStats,
  readPiralPackage,
  getPiletsInfo,
  runScript,
  installNpmDependencies,
  getCurrentPackageDetails,
  checkAppShellPackage,
  setLogLevel,
  progress,
  fail,
  log,
  logDone,
  determineNpmClient,
  ForceOverwrite,
  copyScaffoldingFiles,
  getPiralPath,
  isMonorepoPackageRef,
  getPiletScaffoldData,
  retrievePiletData,
  ensure,
} from '../common';

export interface UpgradePiletOptions {
  /**
   * The version of the app shell to upgrade to.
   */
  version?: string;

  /**
   * The target pilet for upgrading. This is the root directory
   * of the pilet, i.e., where the package.json is stored.
   */
  target?: string;

  /**
   * Defines if files can be overwritten by scaffolding
   * template files, if available.
   */
  forceOverwrite?: ForceOverwrite;

  /**
   * Sets the log level to use (1-5).
   */
  logLevel?: LogLevels;

  /**
   * Defines if the dependencies should be installed, too.
   * If the option is disabled, only the package.json is
   * modified, but nothing is installed yet.
   */
  install?: boolean;

  /**
   * Defines the used npm client. By default, "npm" is used
   * if no other client is autodetected. The autodetection
   * works against Lerna, pnpm, and Yarn.
   */
  npmClient?: NpmClientType;

  /**
   * Places additional variables that should used when scaffolding.
   */
  variables?: Record<string, string>;
}

export const upgradePiletDefaults: UpgradePiletOptions = {
  version: undefined,
  target: '.',
  forceOverwrite: ForceOverwrite.no,
  logLevel: LogLevels.info,
  install: true,
  npmClient: undefined,
  variables: {},
};

export async function upgradePilet(baseDir = process.cwd(), options: UpgradePiletOptions = {}) {
  const {
    version = upgradePiletDefaults.version,
    target = upgradePiletDefaults.target,
    forceOverwrite = upgradePiletDefaults.forceOverwrite,
    logLevel = upgradePiletDefaults.logLevel,
    install = upgradePiletDefaults.install,
    variables = upgradePiletDefaults.variables,
    npmClient: defaultNpmClient = upgradePiletDefaults.npmClient,
  } = options;
  
  ensure('baseDir', baseDir, 'string');
  ensure('variables', variables, 'object');
  ensure('target', target, 'string');
  
  const fullBase = resolve(process.cwd(), baseDir);
  const root = resolve(fullBase, target);
  setLogLevel(logLevel);
  const valid = await checkExistingDirectory(root);

  if (!valid) {
    fail('invalidPiletTarget_0040');
  }

  const npmClient = await determineNpmClient(root, defaultNpmClient);

  // in case we run from a user's CLI we want to allow updating
  const interactive = isInteractive();
  const { apps, piletPackage } = await retrievePiletData(root, undefined, interactive);
  const { devDependencies = {}, dependencies = {}, source } = piletPackage;

  if (apps.length === 0) {
    fail('appInstancesNotGiven_0012');
  }

  for (const { appPackage } of apps) {
    //TODO distinguish if it's a website / remote emulator or an npm package
    const sourceName = appPackage.name;
    const language = /\.jsx?$/.test(source) ? 'js' : 'ts';

    if (!sourceName || typeof sourceName !== 'string') {
      fail('invalidPiletPackage_0042');
    }

    const currentVersion = devDependencies[sourceName] ?? dependencies[sourceName];

    if (!currentVersion || typeof currentVersion !== 'string') {
      fail('invalidPiralReference_0043');
    }

    const monorepoRef = await isMonorepoPackageRef(sourceName, fullBase);
    const [packageRef] = await getCurrentPackageDetails(
      fullBase,
      sourceName,
      currentVersion,
      version,
      root,
    );
    const originalFiles = await getFileStats(root, sourceName);

    if (!monorepoRef) {
      // only install the latest if the shell does come from remote
      progress(`Updating npm package to %s ...`, packageRef);
      await installNpmPackage(npmClient, packageRef, root, '--no-save');
    }

    const piralInfo = await readPiralPackage(root, sourceName);

    const isEmulator = checkAppShellPackage(piralInfo);

    const { preUpgrade, postUpgrade, files } = getPiletsInfo(piralInfo);

    if (preUpgrade) {
      progress(`Running preUpgrade script ...`);
      log('generalDebug_0003', `Run: ${preUpgrade}`);
      await runScript(preUpgrade, root);
    }

    progress(`Taking care of templating ...`);
    const data = getPiletScaffoldData(language, root, sourceName, variables);

    if (isEmulator) {
      // in the emulator case we get the files from the contained tarball
      await copyPiralFiles(root, sourceName, piralInfo, forceOverwrite, data, originalFiles);
    } else {
      // otherwise, we perform the same action as in the emulator creation
      // just with a different target; not a created directory, but the root
      const packageRoot = getPiralPath(root, sourceName);
      const notOnceFiles = files.filter((m) => typeof m === 'string' || !m.once);
      await copyScaffoldingFiles(packageRoot, root, notOnceFiles, piralInfo, data);
    }

    await patchPiletPackage(root, piralInfo, isEmulator);

    if (install) {
      progress(`Updating dependencies ...`);
      await installNpmDependencies(npmClient, root);
    }

    if (postUpgrade) {
      progress(`Running postUpgrade script ...`);
      log('generalDebug_0003', `Run: ${postUpgrade}`);
      await runScript(postUpgrade, root);
    }
  }

  logDone('Pilet upgraded successfully!');
}
