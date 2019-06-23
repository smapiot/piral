import { resolve, basename, join } from 'path';
import { installPackage, updateExistingJson, createFileIfNotExists, getPiletsInfo, checkExists } from './common';

export interface InstallPiralOptions {
  app?: string;
  onlyCore?: boolean;
  target?: string;
  version?: string;
}

export const installPiralDefaults = {
  app: './src/index.html',
  onlyCore: false,
  target: '.',
  version: 'latest',
};

const defaultHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<title>My Piral Instance</title>
</head>
<body>
<div id="app"></div>
<script src="./index"></script>
</body>
</html>`;

export async function installPiral(baseDir = process.cwd(), options: InstallPiralOptions = {}) {
  const {
    app = installPiralDefaults.app,
    onlyCore = installPiralDefaults.onlyCore,
    target = installPiralDefaults.target,
    version = installPiralDefaults.version,
  } = options;
  const root = resolve(baseDir, target);
  const packageName = onlyCore ? 'piral-core' : 'piral';
  const exists = await checkExists(join(root, 'package.json'));

  if (exists) {
    console.log(`Creating a new Piral instance in ${root} ...`);

    await updateExistingJson(root, 'package.json', {
      app,
      pilets: getPiletsInfo({}),
    });

    console.log(`Installing NPM package ${packageName}@${version} ...`, '--no-package-lock');

    await installPackage(packageName, version, root);

    await createFileIfNotExists(root, app, defaultHtml);

    console.log(`All done!`);
  } else {
    console.error('Could not find a "package.json" file at the current target. Aborting.');
    throw new Error('Invalid target.');
  }
}
