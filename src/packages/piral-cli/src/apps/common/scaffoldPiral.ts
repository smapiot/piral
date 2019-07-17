import { PiletLanguage, getLanguageExtension, getDevDependencies } from './language';
import { getPiletsInfo } from './package';
import { ForceOverwrite, createFileIfNotExists } from './io';
import { join, dirname, relative } from 'path';

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

function getPiralRootModuleContent(packageName: string) {
  switch (packageName) {
    case 'piral':
      return `import { renderInstance, buildLayout } from 'piral';

renderInstance({ layout: buildLayout() });
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
  await createFileIfNotExists(root, app, getPiralAppContent(language), forceOverwrite);

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
