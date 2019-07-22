import { join } from 'path';
import { ForceOverwrite, createDirectory, createFileIfNotExists } from './io';
import { PiletLanguage } from './language';

const sampleContent = `
  app.showNotification('Hello World!');
  app.registerMenu('sample-entry', () =>
    <a href="https://docs.piral.io" target="_blank">Documentation</a>
  );
  app.registerTile('sample-tile', () => <div>Hello World!</div>, {
    initialColumns: 2,
    initialRows: 1,
  });
`;

export async function scaffoldPiletSourceFiles(
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
import * as React from 'react';

export function setup(app: ${apiName}) {${sampleContent}}
`,
        forceOverwrite,
      );
      break;
    case PiletLanguage.js:
      await createFileIfNotExists(
        src,
        'index.jsx',
        `import * as React from 'react';

export function setup(app) {${sampleContent}}
`,
        forceOverwrite,
      );
      break;
  }
}
