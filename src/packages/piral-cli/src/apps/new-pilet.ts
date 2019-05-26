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
  scaffoldSourceFiles,
} from './common';

export interface NewPiletOptions {
  registry?: string;
  target?: string;
  source?: string;
  forceOverwrite?: ForceOverwrite;
  language?: PiletLanguage;
}

export const newPiletDefaults = {
  target: '.',
  registry: defaultRegistry,
  source: 'piral',
  forceOverwrite: ForceOverwrite.no,
  language: PiletLanguage.ts,
};

export async function newPilet(baseDir = process.cwd(), options: NewPiletOptions = {}) {
  const {
    target = newPiletDefaults.target,
    registry = newPiletDefaults.registry,
    source = newPiletDefaults.source,
    forceOverwrite = newPiletDefaults.forceOverwrite,
    language = newPiletDefaults.language,
  } = options;
  const root = resolve(baseDir, target);
  const [sourceName, sourceVersion, hadVersion] = dissectPackageName(source);
  const success = await createDirectory(root);

  if (success) {
    console.log(`Scaffolding new pilet in ${root} ...`);

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
      console.log(`Setting up NPM registry (${registry}) ...`);

      await createFileIfNotExists(
        root,
        '.npmrc',
        `registry=${registry}
always-auth=true`,
        forceOverwrite,
      );
    }

    console.log(`Installing NPM package ${sourceName}@${sourceVersion} ...`);

    await installPackage(sourceName, sourceVersion, root, '--no-save', '--no-package-lock');

    console.log(`Taking care of templating ...`);

    await scaffoldSourceFiles(language, root, sourceName, forceOverwrite);

    const files = await patchPiletPackage(root, sourceName, hadVersion && sourceVersion);
    await copyPiralFiles(root, sourceName, files, forceOverwrite);

    console.log(`All done!`);
  }
}
