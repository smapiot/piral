import { resolve, basename } from 'path';
import {
  createDirectory,
  createFileIfNotExists,
  defaultRegistry,
  installPackage,
  dissectPackageName,
  copyPiralFiles,
  patchPiletPackage,
  ForceOverwrite,
  PiletLanguage,
  getDevDependencies,
  scaffoldPiletSourceFiles,
  logInfo,
  logDone,
  installDependencies,
  combinePackageRef,
  getPackageName,
  getPackageVersion,
} from '../common';

export interface NewPiletOptions {
  registry?: string;
  target?: string;
  source?: string;
  forceOverwrite?: ForceOverwrite;
  language?: PiletLanguage;
  skipInstall?: boolean;
}

export const newPiletDefaults = {
  target: '.',
  registry: defaultRegistry,
  source: 'piral',
  forceOverwrite: ForceOverwrite.no,
  language: PiletLanguage.ts,
  skipInstall: false,
};

export async function newPilet(baseDir = process.cwd(), options: NewPiletOptions = {}) {
  const {
    target = newPiletDefaults.target,
    registry = newPiletDefaults.registry,
    source = newPiletDefaults.source,
    forceOverwrite = newPiletDefaults.forceOverwrite,
    language = newPiletDefaults.language,
    skipInstall = newPiletDefaults.skipInstall,
  } = options;
  const root = resolve(baseDir, target);
  const [sourceName, sourceVersion, hadVersion, type] = dissectPackageName(baseDir, source);
  const success = await createDirectory(root);

  if (success) {
    const devDependencies = getDevDependencies(language);

    logInfo(`Scaffolding new pilet in %s ...`, root);

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
          devDependencies,
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
      logInfo(`Setting up NPM registry (%s) ...`, registry);

      await createFileIfNotExists(
        root,
        '.npmrc',
        `registry=${registry}
always-auth=true`,
        forceOverwrite,
      );
    }

    const packageRef = combinePackageRef(sourceName, sourceVersion, type);

    logInfo(`Installing NPM package %s ...`, packageRef);

    await installPackage(packageRef, root, '--save-dev', '--no-package-lock');

    const packageName = await getPackageName(root, sourceName, type);
    const packageVersion = getPackageVersion(hadVersion, sourceName, sourceVersion, type);

    logInfo(`Taking care of templating ...`);

    await scaffoldPiletSourceFiles(language, root, packageName, forceOverwrite);

    const files = await patchPiletPackage(root, packageName, packageVersion);
    await copyPiralFiles(root, packageName, files, ForceOverwrite.yes);

    if (!skipInstall) {
      logInfo(`Installing dependencies ...`);

      await installDependencies(root, '--no-package-lock');
    }

    logDone(`All done!`);
  } else {
    throw new Error('Could not create directory.');
  }
}
