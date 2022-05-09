import { resolve } from 'path';
import { LogLevels, NpmClientType } from '../types';
import {
  readJson,
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
  SourceLanguage,
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
  } = options;
  const fullBase = resolve(process.cwd(), baseDir);
  const root = resolve(fullBase, target);
  setLogLevel(logLevel);
  const valid = await checkExistingDirectory(root);

  if (!valid) {
    fail('invalidPiletTarget_0040');
  }

  const npmClient = await determineNpmClient(root, options.npmClient);
  const pckg = await readJson(root, 'package.json');
  const { devDependencies = {}, dependencies = {}, piral, source } = pckg;

  if (piral && typeof piral === 'object') {
    const sourceName = piral.name;
    const language = /\.jsx?$/.test(source) ? SourceLanguage.js : SourceLanguage.ts;

    if (!sourceName || typeof sourceName !== 'string') {
      fail('invalidPiletPackage_0042');
    }

    const currentVersion = devDependencies[sourceName] ?? dependencies[sourceName];

    if (!currentVersion || typeof currentVersion !== 'string') {
      fail('invalidPiralReference_0043');
    }

    const monorepoRef = await isMonorepoPackageRef(sourceName, fullBase);
    const [packageRef, packageVersion] = await getCurrentPackageDetails(
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

    await patchPiletPackage(root, sourceName, packageVersion, piralInfo, isEmulator);

    if (install) {
      progress(`Updating dependencies ...`);
      await installNpmDependencies(npmClient, root);
    }

    if (postUpgrade) {
      progress(`Running postUpgrade script ...`);
      log('generalDebug_0003', `Run: ${postUpgrade}`);
      await runScript(postUpgrade, root);
    }

    logDone('Pilet upgraded successfully!');
  } else {
    fail('invalidPiletPackage_0041');
  }
}
