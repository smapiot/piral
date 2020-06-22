import { resolve, basename } from 'path';
import { LogLevels, TemplateType, NpmClientType } from '../types';
import {
  ForceOverwrite,
  PiletLanguage,
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
  registry?: string;
  target?: string;
  source?: string;
  forceOverwrite?: ForceOverwrite;
  language?: PiletLanguage;
  install?: boolean;
  template?: TemplateType;
  logLevel?: LogLevels;
  npmClient?: NpmClientType;
  bundler?: string;
}

export const newPiletDefaults: NewPiletOptions = {
  target: '.',
  registry: defaultRegistry,
  source: 'piral',
  forceOverwrite: ForceOverwrite.no,
  language: PiletLanguage.ts,
  install: true,
  template: 'default',
  logLevel: LogLevels.info,
  npmClient: undefined,
  bundler: 'none',
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
    bundler = newPiletDefaults.bundler,
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
    await scaffoldPiletSourceFiles(template, language, root, packageName, forceOverwrite);
    await patchPiletPackage(root, packageName, packageVersion, piralInfo, { language, bundler });

    if (isEmulator) {
      // in the emulator case we get the files (and files_once) from the contained tarballs
      await copyPiralFiles(root, packageName, ForceOverwrite.yes);
    } else {
      // otherwise, we perform the same action as in the emulator creation
      // just with a different target; not a created directory, but the root
      await copyScaffoldingFiles(getPiralPath(root, packageName), root, files);
    }

    if (install) {
      progress(`Installing dependencies ...`);
      const isMonorepo = await detectMonorepo(root);

      if (isMonorepo) {
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
