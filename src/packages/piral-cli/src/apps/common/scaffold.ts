import { ForceOverwrite, createDirectory, createFileIfNotExists } from './io';
import { join } from 'path';

export enum PiletLanguage {
  ts,
  js,
}

export function getDevDependencies(language: PiletLanguage) {
  switch (language) {
    case PiletLanguage.ts:
      return {
        typescript: 'latest',
        '@types/react': 'latest',
        '@types/node': 'latest',
      };
    case PiletLanguage.js:
    default:
      return {};
  }
}

export async function scaffoldSourceFiles(
  language: PiletLanguage,
  root: string,
  sourceName: string,
  forceOverwrite: ForceOverwrite,
) {
  const apiName = 'PiletApi';
  const src = join(root, 'src');

  await createDirectory(src);

  switch (language) {
    case PiletLanguage.ts:
      await createFileIfNotExists(
        root,
        'tsconfig.json',
        `{
  "compilerOptions": {
    "declaration": true,
    "noImplicitAny": false,
    "removeComments": false,
    "noLib": false,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "target": "es6",
    "sourceMap": true,
    "outDir": "./dist",
    "skipLibCheck": true,
    "lib": ["dom", "es2018"],
    "moduleResolution": "node",
    "module": "esnext",
    "jsx": "react"
  },
  "include": [
    "./src"
  ],
  "exclude": [
    "node_modules"
  ]
}
      `,
        forceOverwrite,
      );

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
      break;
    case PiletLanguage.js:
      await createFileIfNotExists(
        src,
        'index.jsx',
        `export function setup(app) {
  app.showNotification('Hello World!');
}
`,
        forceOverwrite,
      );
      break;
  }
}
