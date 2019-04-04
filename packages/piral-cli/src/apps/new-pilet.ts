import { resolve, join, basename } from 'path';
import {
  createDirectory,
  createFileIfNotExists,
  defaultRegistry,
  installPackage,
  dissectPackageName,
  copyPiralFiles,
  patchPiletPackage,
  ForceOverwrite,
} from './common';

export interface NewPiletOptions {
  registry?: string;
  target?: string;
  source?: string;
  forceOverwrite?: ForceOverwrite;
}

export const newPiletDefaults = {
  target: '.',
  registry: defaultRegistry,
  source: 'piral',
  forceOverwrite: ForceOverwrite.no,
};

export async function newPilet(baseDir = process.cwd(), options: NewPiletOptions = {}) {
  const {
    target = newPiletDefaults.target,
    registry = newPiletDefaults.registry,
    source = newPiletDefaults.source,
    forceOverwrite = ForceOverwrite.no,
  } = options;
  const root = resolve(baseDir, target);
  const src = join(root, 'src');
  const apiName = 'Api';
  const [sourceName, sourceVersion, hadVersion] = dissectPackageName(source);
  const success = await createDirectory(root);

  if (success) {
    console.log(`Scaffolding new pilet in ${root} ...`);

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
    await createDirectory(src);

    if (registry !== newPiletDefaults.registry) {
      console.log(`Setting up NPM registry (${registry}) ...`);

      await createFileIfNotExists(
        src,
        '.npmrc',
        `registry=${registry}
always-auth=true`,
        forceOverwrite,
      );
    }

    console.log(`Installing NPM package ${sourceName}@${sourceVersion} ...`);

    await installPackage(sourceName, sourceVersion, root, '--no-save', '--no-package-lock');

    await createFileIfNotExists(
      src,
      'index.tsx',
      `import { ${apiName} } from '${sourceName}';

export function setup(app: ${apiName}) {
  app.showNotification('Hello World!');
}
`,
      forceOverwrite,
    );

    console.log(`Taking care of templating ...`);

    const files = await patchPiletPackage(root, sourceName, hadVersion && sourceVersion);
    await copyPiralFiles(root, sourceName, files, forceOverwrite);

    console.log(`All done!`);
  }
}
