import { resolve, basename } from 'path';
import {
  installPackage,
  updateExistingJson,
  PiletLanguage,
  ForceOverwrite,
  getPiralPackage,
  scaffoldPiralSourceFiles,
  createDirectory,
  createFileIfNotExists,
  logDone,
  logInfo,
  installDependencies,
} from './common';

export interface NewPiralOptions {
  app?: string;
  onlyCore?: boolean;
  target?: string;
  version?: string;
  forceOverwrite?: ForceOverwrite;
  language?: PiletLanguage;
  skipInstall?: boolean;
}

export const newPiralDefaults = {
  app: './src/index.html',
  onlyCore: false,
  target: '.',
  version: 'latest',
  forceOverwrite: ForceOverwrite.no,
  language: PiletLanguage.ts,
  skipInstall: false,
};

export async function newPiral(baseDir = process.cwd(), options: NewPiralOptions = {}) {
  const {
    app = newPiralDefaults.app,
    onlyCore = newPiralDefaults.onlyCore,
    target = newPiralDefaults.target,
    version = newPiralDefaults.version,
    forceOverwrite = newPiralDefaults.forceOverwrite,
    language = newPiralDefaults.language,
    skipInstall = newPiralDefaults.skipInstall,
  } = options;
  const root = resolve(baseDir, target);
  const packageName = onlyCore ? 'piral-core' : 'piral';
  const success = await createDirectory(root);

  if (success) {
    logInfo(`Creating a new Piral instance in %s ...`, root);

    await createFileIfNotExists(
      root,
      'package.json',
      JSON.stringify(
        {
          name: basename(root),
          version: '1.0.0',
          description: '',
          keywords: ['piral'],
          dependencies: {},
          scripts: {},
        },
        undefined,
        2,
      ),
    );

    await updateExistingJson(root, 'package.json', getPiralPackage(app, language));

    logInfo(`Installing NPM package ${packageName}@${version} ...`);

    await installPackage(packageName, version, root, '--no-package-lock');

    logInfo(`Taking care of templating ...`);

    await scaffoldPiralSourceFiles(language, root, app, packageName, forceOverwrite);

    if (!skipInstall) {
      logInfo(`Installing dependencies ...`);

      await installDependencies(root, '--no-package-lock');
    }

    logDone(`All done!`);
  } else {
    throw new Error('Could not create directory.');
  }
}
