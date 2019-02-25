import { resolve, join, basename } from 'path';
import { createDirectory, createFileIfNotExists, updateExistingJson, cliVersion, getPackage } from './common';

export interface NewPiletOptions {
  registry?: string;
  target?: string;
  source?: string;
}

export const newPiletDefaults = {
  target: '.',
  registry: 'https://registry.npmjs.org/',
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
  const sourceVersion = '1.0.0';
  const devDependencies = {
    [source]: `^${sourceVersion}`,
    'pilet-cli': `^${cliVersion}`,
  };
  const peerDependencies = {
    [source]: `*`,
  };

  if (createDirectory(root)) {
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
      createFileIfNotExists(
        src,
        '.npmrc',
        `registry=${registry}
always-auth=true`,
      );
    }

    createFileIfNotExists(
      src,
      'index.tsx',
      `import { ${apiName} } from '${source}';

export function setup(app: ${apiName}) {
  app.showNotification('Hello World!');
}
`,
    );

    const packageFiles = await getPackage(source, registry);

    for (const file of packageFiles) {
      //TODO
    }

    updateExistingJson(root, 'package.json', {
      devDependencies,
      peerDependencies,
      scripts: {
        'debug-pilet': 'pilet debug',
        'build-pilet': 'pilet build',
      },
    });
  }
}
