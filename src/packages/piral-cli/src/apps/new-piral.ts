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
} from './common';

export interface NewPiralOptions {
  app?: string;
  onlyCore?: boolean;
  target?: string;
  version?: string;
  forceOverwrite?: ForceOverwrite;
  language?: PiletLanguage;
}

export const newPiralDefaults = {
  app: './src/index.html',
  onlyCore: false,
  target: '.',
  version: 'latest',
  forceOverwrite: ForceOverwrite.no,
  language: PiletLanguage.ts,
};

export async function newPiral(baseDir = process.cwd(), options: NewPiralOptions = {}) {
  const {
    app = newPiralDefaults.app,
    onlyCore = newPiralDefaults.onlyCore,
    target = newPiralDefaults.target,
    version = newPiralDefaults.version,
    forceOverwrite = newPiralDefaults.forceOverwrite,
    language = newPiralDefaults.language,
  } = options;
  const root = resolve(baseDir, target);
  const packageName = onlyCore ? 'piral-core' : 'piral';
  const success = await createDirectory(root);

  if (success) {
    console.log(`Creating a new Piral instance in ${root} ...`);

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

    console.log(`Installing NPM package ${packageName}@${version} ...`);

    await installPackage(packageName, version, root, '--no-package-lock');

    console.log(`Taking care of templating ...`);

    await scaffoldPiralSourceFiles(language, root, app, packageName, forceOverwrite);

    console.log(`All done!`);
  } else {
    throw new Error('Could not create directory.');
  }
}
