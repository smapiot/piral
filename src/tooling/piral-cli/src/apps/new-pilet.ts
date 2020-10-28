import { resolve, basename } from 'path';
import { LogLevels, NpmClientType } from '../types';
import {
  ForceOverwrite,
  SourceLanguage,
  createDirectory,
  createFileIfNotExists,
  defaultRegistry,
  installPackage,
  dissectPackageName,
  copyPiralFiles,
  patchPiletPackage,
  scaffoldPiletSourceFiles,
  installDependencies,
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
  detectMonorepo,
  bootstrapMonorepo,
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
   * The NPM client to be used when scaffolding.
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
  registry: defaultRegistry,
  source: 'piral',
  forceOverwrite: ForceOverwrite.no,
  language: SourceLanguage.ts,
  install: true,
  template: 'default',
  logLevel: LogLevels.info,
  npmClient: undefined,
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
  setLogLevel(logLevel);
  progress('Preparing source and target ...');
  const root = resolve(baseDir, target);
  const [sourceName, sourceVersion, hadVersion, type] = await dissectPackageName(baseDir, source);
  const success = await createDirectory(root);

  if (success) {
    const npmClient = await determineNpmClient(root, options.npmClient);

    progress(`Scaffolding new pilet in %s ...`, root);

    await createFileIfNotExists(
      root,
      'package.json',
      JSON.stringify(
        {
          name: basename(root),
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

    if (registry !== newPiletDefaults.registry) {
      progress(`Setting up NPM registry (%s) ...`, registry);

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

      progress(`Installing NPM package %s ...`, packageRef);

      await installPackage(npmClient, packageRef, root, '--save-dev');
    } else {
      progress(`Using locally available NPM package %s ...`, sourceName);
    }

    const packageName = await getPackageName(root, sourceName, type);
    const packageVersion = getPackageVersion(hadVersion, sourceName, sourceVersion, type, root);
    const piralInfo = await readPiralPackage(root, packageName);

    const isEmulator = checkAppShellPackage(piralInfo);

    const { preScaffold, postScaffold, files } = getPiletsInfo(piralInfo);

    if (preScaffold) {
      progress(`Running preScaffold script ...`);
      log('generalDebug_0003', `Run: ${preScaffold}`);
      await runScript(preScaffold, root);
    }

    progress(`Taking care of templating ...`);

    await scaffoldPiletSourceFiles(template, registry, language, root, packageName, forceOverwrite, variables);

    if (isEmulator) {
      // in the emulator case we get the files (and files_once) from the contained tarballs
      await copyPiralFiles(root, packageName, piralInfo, ForceOverwrite.yes);
    } else {
      // otherwise, we perform the same action as in the emulator creation
      // just with a different target; not a created directory, but the root
      const packageRoot = getPiralPath(root, packageName);
      await copyScaffoldingFiles(packageRoot, root, files, piralInfo);
    }

    await patchPiletPackage(root, packageName, packageVersion, piralInfo, { language, bundler: bundlerName });

    if (install) {
      progress(`Installing dependencies ...`);
      const monorepoKind = await detectMonorepo(root);

      if (monorepoKind === 'lerna') {
        await bootstrapMonorepo(root);
      } else {
        await installDependencies(npmClient, root);
      }
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
