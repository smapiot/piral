import { resolve, basename } from 'path';
import { LogLevels, ForceOverwrite, PiletLanguage, TemplateType, PackageType } from '../types';
import {
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
  createContextLogger,
  setLogLevel,
  fail,
  progress,
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
};

function isLocalPackage(name: string, type: PackageType, hadVersion: boolean) {
  if (type === 'registry' && !hadVersion) {
    try {
      require.resolve(`${name}/package.json`);
      return true;
    } catch {}
  }

  return false;
}

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
  } = options;
  setLogLevel(logLevel);
  progress('Preparing source and target ...');
  const root = resolve(baseDir, target);
  const [sourceName, sourceVersion, hadVersion, type] = await dissectPackageName(baseDir, source);
  const success = await createDirectory(root);

  if (success) {
    const logger = createContextLogger();
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

    const isLocal = isLocalPackage(sourceName, type, hadVersion);

    if (!isLocal) {
      const packageRef = combinePackageRef(sourceName, sourceVersion, type);

      progress(`Installing NPM package %s ...`, packageRef);

      await installPackage(packageRef, root, '--save-dev', '--no-package-lock');
    } else {
      progress(`Using locally available NPM package %s ...`, sourceName);
    }

    const packageName = await getPackageName(root, sourceName, type);
    const packageVersion = getPackageVersion(hadVersion, sourceName, sourceVersion, type);
    const piralInfo = await readPiralPackage(root, packageName);

    checkAppShellPackage(piralInfo);

    const { preScaffold, postScaffold } = getPiletsInfo(piralInfo);

    if (preScaffold) {
      progress(`Running preScaffold script ...`);
      await runScript(preScaffold, root);
    }

    progress(`Taking care of templating ...`);
    await scaffoldPiletSourceFiles(template, language, root, packageName, forceOverwrite);
    await patchPiletPackage(root, packageName, packageVersion, piralInfo, language);
    await copyPiralFiles(root, packageName, ForceOverwrite.yes, [], logger.notify);

    if (install) {
      progress(`Installing dependencies ...`);
      await installDependencies(root, '--no-package-lock');
    }

    if (postScaffold) {
      progress(`Running postScaffold script ...`);
      await runScript(postScaffold, root);
    }

    logger.summary();
    logger.throwIfError();
  } else {
    fail('cannotCreateDirectory_0044');
  }
}
