import { join, dirname, relative } from 'path';
import { PiletLanguage, getLanguageExtension, getDevDependencies } from './language';
import { getPiletsInfo } from './package';
import { ForceOverwrite, createFileIfNotExists } from './io';

function getPiralAppContent(language: PiletLanguage) {
  const extension = getLanguageExtension(language);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<title>My Piral Instance</title>
</head>
<body>
<div id="app"></div>
<script src="./index${extension}"></script>
</body>
</html>`;
}

function getPiralMockContent() {
  return `const request = require('request');

function isPiletQuery(content) {
  try {
    const q = JSON.parse(content).query.replace(/\\s+/g, ' ');
    return q.indexOf('query initialData { pilets {') !== -1;
  } catch (e) {
    return false;
  }
}

// Place a script here to "redirect" a standard API to some GraphQL.
const apiService = '';// 'https://feed.piral.io/api/v1/pilet/sample';

module.exports = function(_, req, res) {
  if ((req.path = '/' && req.method === 'POST' && isPiletQuery(req.content)))
    if (apiService) {
      return new Promise(resolve => {
        request.get(apiService, (_1, _2, body) => {
          const response = res({
            content: JSON.stringify({
              data: {
                pilets: JSON.parse(body).items,
              },
            }),
          });
          resolve(response);
        });
      });
    } else {
      return res({
        content: JSON.stringify({
          data: {
            pilets: [],
          },
        }),
      });
    }
};
`;
}

function getPiralRootModuleContent(packageName: string) {
  switch (packageName) {
    case 'piral':
      return `import * as React from 'react';
import { renderInstance, buildLayout } from 'piral';

renderInstance({
  layout: buildLayout()
    .withError(({ type, error }) => (
      <span style={{ color: 'red', fontWeight: 'bold' }}>Error: {(error && error.message) || type}</span>
    )),
});
`;
    case 'piral-core':
    default:
      return '';
  }
}

export function getPiralPackage(app: string, language: PiletLanguage) {
  const baseData = {
    app,
    main: 'lib/index.js',
    pilets: getPiletsInfo({}),
    devDependencies: {
      ...getDevDependencies(language),
      'piral-cli': 'latest',
    },
  };

  switch (language) {
    case PiletLanguage.ts:
      return {
        ...baseData,
        typings: 'lib/index.d.ts',
      };
  }

  return baseData;
}

export async function scaffoldPiralSourceFiles(
  language: PiletLanguage,
  root: string,
  app: string,
  packageName: string,
  forceOverwrite: ForceOverwrite,
) {
  const src = dirname(join(root, app));
  const mocks = join(root, 'mocks');
  await createFileIfNotExists(root, app, getPiralAppContent(language), forceOverwrite);
  await createFileIfNotExists(mocks, 'backend.js', getPiralMockContent(), forceOverwrite);

  switch (language) {
    case PiletLanguage.ts:
      await createFileIfNotExists(
        root,
        'tsconfig.json',
        `{
  "compilerOptions": {
    "declaration": true,
    "target": "es6",
    "sourceMap": true,
    "outDir": "./lib",
    "skipLibCheck": true,
    "lib": ["dom", "es2018"],
    "moduleResolution": "node",
    "module": "esnext",
    "jsx": "react"
  },
  "include": [
    "./${relative(root, src)}"
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
        `${getPiralRootModuleContent(packageName)}
export * from '${packageName}';
`,
        forceOverwrite,
      );
      break;
    case PiletLanguage.js:
      await createFileIfNotExists(
        src,
        'index.jsx',
        `${getPiralRootModuleContent(packageName)}
`,
        forceOverwrite,
      );
      break;
  }
}
