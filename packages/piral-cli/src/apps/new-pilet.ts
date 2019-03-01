import { resolve, join, basename } from 'path';
import {
  createDirectory,
  createFileIfNotExists,
  defaultRegistry,
  installPackage,
  dissectPackageName,
  copyPiralFiles,
  patchPiletPackage,
} from './common';

export interface NewPiletOptions {
  registry?: string;
  target?: string;
  source?: string;
}

export const newPiletDefaults = {
  target: '.',
  registry: defaultRegistry,
  source: 'piral',
};

export async function newPilet(baseDir = process.cwd(), options: NewPiletOptions = {}) {
  const {
    target = newPiletDefaults.target,
    registry = newPiletDefaults.registry,
    source = newPiletDefaults.source,
  } = options;
  const root = resolve(baseDir, target);
  const src = join(root, 'src');
  const apiName = 'Api';
  const [sourceName, sourceVersion, hadVersion] = dissectPackageName(source);
  if (createDirectory(root)) {
    console.log(`Scaffolding new pilet in ${root} ...`);

    createFileIfNotExists(
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
    createDirectory(src);

    if (registry !== newPiletDefaults.registry) {
      console.log(`Setting up NPM registry (${registry}) ...`);

      createFileIfNotExists(
        src,
        '.npmrc',
        `registry=${registry}
always-auth=true`,
      );
    }

    console.log(`Installing NPM package ${sourceName}@${sourceVersion} ...`);

    await installPackage(sourceName, sourceVersion, root, '--no-save', '--no-package-lock');

    createFileIfNotExists(
      src,
      'index.tsx',
      `import { ${apiName} } from '${sourceName}';

export function setup(app: ${apiName}) {
  app.showNotification('Hello World!');
}
`,
    );

    console.log(`Taking care of templating ...`);

    const files = patchPiletPackage(root, sourceName, hadVersion && sourceVersion);
    copyPiralFiles(root, sourceName, files);

    console.log(`All done!`);
  }
}
