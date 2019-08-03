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
} from './common';

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
  const [sourceName, sourceVersion, hadVersion] = dissectPackageName(source);
  const success = await createDirectory(root);

  if (success) {
    logInfo(`Scaffolding new pilet in %s ...`, root);

    const devDependencies = getDevDependencies(language);

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

    logInfo(`Installing NPM package %s ...`, `${sourceName}@${sourceVersion}`);

    await installPackage(sourceName, sourceVersion, root, '--no-save', '--no-package-lock');

    logInfo(`Taking care of templating ...`);

    await scaffoldPiletSourceFiles(language, root, sourceName, forceOverwrite);

    const files = await patchPiletPackage(root, sourceName, hadVersion && sourceVersion);
    await copyPiralFiles(root, sourceName, files, forceOverwrite);

    if (!skipInstall) {
      logInfo(`Installing dependencies ...`);

      await installDependencies(root, '--no-package-lock');
    }

    logDone(`All done!`);
  } else {
    throw new Error('Could not create directory.');
  }
}
