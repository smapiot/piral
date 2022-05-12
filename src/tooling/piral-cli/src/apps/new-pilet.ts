import { resolve, basename } from 'path';
import { LogLevels, NpmClientType } from '../types';
import {
  ForceOverwrite,
  SourceLanguage,
  createDirectory,
  createFileIfNotExists,
  installNpmPackage,
  dissectPackageName,
  copyPiralFiles,
  patchPiletPackage,
  scaffoldPiletSourceFiles,
  installNpmDependencies,
  combinePackageRef,
  getPackageName,
  getPackageVersion,
  readPiralPackage,
  getPiletsInfo,
  runScript,
  checkAppShellPackage,
  setLogLevel,
  fail,
  progress,
  log,
  logDone,
  determineNpmClient,
  isLinkedPackage,
  copyScaffoldingFiles,
  getPiralPath,
  getPiletScaffoldData,
  config,
  initNpmProject,
} from '../common';

export interface NewPiletOptions {
  /**
   * The package registry to use for resolving the specified Piral app.
   */
  registry?: string;

  /**
   * The target directory for scaffolding. By default, the current directory.
   */
  target?: string;

  /**
   * The source package containing a Piral instance for templating the scaffold process.
   */
  source?: string;

  /**
   * Determines if files should be overwritten by the scaffolding.
   */
  forceOverwrite?: ForceOverwrite;

  /**
   * Determines the programming language for the new pilet.
   * @example 'ts'
   */
  language?: SourceLanguage;

  /**
   * States if the npm dependencies should be installed when scaffolding.
   */
  install?: boolean;

  /**
   * Sets the boilerplate template to be used when scaffolding.
   * @example 'empty'
   */
  template?: string;

  /**
   * Sets the log level to use (1-5).
   */
  logLevel?: LogLevels;

  /**
   * The npm client to be used when scaffolding.
   * @example 'yarn'
   */
  npmClient?: NpmClientType;

  /**
   * Sets the default bundler to install.
   * @example 'parcel'
   */
  bundlerName?: string;

  /**
   * Places additional variables that should used when scaffolding.
   */
  variables?: Record<string, string>;
}

export const newPiletDefaults: NewPiletOptions = {
  target: '.',
  registry: config.registry,
  source: 'piral',
  forceOverwrite: ForceOverwrite.no,
  language: config.language,
  install: true,
  template: undefined,
  logLevel: LogLevels.info,
  npmClient: config.npmClient,
  bundlerName: 'none',
  variables: {},
};

export async function newPilet(baseDir = process.cwd(), options: NewPiletOptions = {}) {
  const {
    target = newPiletDefaults.target,
    registry = newPiletDefaults.registry,
    source = newPiletDefaults.source,
    forceOverwrite = newPiletDefaults.forceOverwrite,
    language = newPiletDefaults.language,
    install = newPiletDefaults.install,
    template = newPiletDefaults.template,
    logLevel = newPiletDefaults.logLevel,
    bundlerName = newPiletDefaults.bundlerName,
    variables = newPiletDefaults.variables,
  } = options;
  const fullBase = resolve(process.cwd(), baseDir);
  const root = resolve(fullBase, target);
  setLogLevel(logLevel);
  progress('Preparing source and target ...');
  const [sourceName, sourceVersion, hadVersion, type] = await dissectPackageName(fullBase, source);
  const success = await createDirectory(root);

  if (success) {
    const npmClient = await determineNpmClient(root, options.npmClient);
    const projectName = basename(root);

    progress(`Scaffolding new pilet in %s ...`, root);

    await createFileIfNotExists(
      root,
      'package.json',
      JSON.stringify(
        {
          name: projectName,
          version: '1.0.0',
          description: '',
          keywords: ['pilet'],
          dependencies: {},
          devDependencies: {},
          peerDependencies: {},
          scripts: {},
          main: 'dist/index.js',
          files: ['dist'],
        },
        undefined,
        2,
      ),
    );

    await initNpmProject(npmClient, projectName, root);

    if (registry !== newPiletDefaults.registry) {
      progress(`Setting up npm registry (%s) ...`, registry);

      await createFileIfNotExists(
        root,
        '.npmrc',
        `registry=${registry}
always-auth=true`,
        forceOverwrite,
      );
    }

    const isLocal = isLinkedPackage(sourceName, type, hadVersion);

    if (!isLocal) {
      const packageRef = combinePackageRef(sourceName, sourceVersion, type);

      progress(`Installing npm package %s ...`, packageRef);
      await installNpmPackage(npmClient, packageRef, root, '--save-dev', '--save-exact');
    } else {
      progress(`Using locally available npm package %s ...`, sourceName);
    }

    const packageName = await getPackageName(root, sourceName, type);
    const packageVersion = getPackageVersion(hadVersion, sourceName, sourceVersion, type, root);
    const piralInfo = await readPiralPackage(root, packageName);

    const isEmulator = checkAppShellPackage(piralInfo);

    const { preScaffold, postScaffold, files, template: preSelectedTemplate } = getPiletsInfo(piralInfo);

    if (preScaffold) {
      progress(`Running preScaffold script ...`);
      log('generalDebug_0003', `Run: ${preScaffold}`);
      await runScript(preScaffold, root);
    }

    progress(`Taking care of templating ...`);

    const data = getPiletScaffoldData(language, root, packageName, variables);
    const chosenTemplate = template || preSelectedTemplate || 'default';
    await scaffoldPiletSourceFiles(chosenTemplate, registry, data, forceOverwrite);

    if (isEmulator) {
      // in the emulator case we get the files (and files_once) from the contained tarballs
      await copyPiralFiles(root, packageName, piralInfo, ForceOverwrite.yes, data);
    } else {
      // otherwise, we perform the same action as in the emulator creation
      // just with a different target; not a created directory, but the root
      const packageRoot = getPiralPath(root, packageName);
      await copyScaffoldingFiles(packageRoot, root, files, piralInfo, data);
    }

    await patchPiletPackage(root, packageName, packageVersion, piralInfo, isEmulator, {
      language,
      bundler: bundlerName,
    });

    if (install) {
      progress(`Installing dependencies ...`);
      await installNpmDependencies(npmClient, root);
    }

    if (postScaffold) {
      progress(`Running postScaffold script ...`);
      log('generalDebug_0003', `Run: ${postScaffold}`);
      await runScript(postScaffold, root);
    }

    logDone(`Pilet scaffolded successfully!`);
  } else {
    fail('cannotCreateDirectory_0044');
  }
}
