import { join, dirname, relative } from 'path';
import { PiletLanguage, getLanguageExtension } from './language';
import { fillTemplate, createFileFromTemplateIfNotExists } from './template';
import { createDirectory, createFileIfNotExists, ForceOverwrite } from './io';

export async function scaffoldPiralSourceFiles(
  language: PiletLanguage,
  root: string,
  app: string,
  packageName: string,
  forceOverwrite: ForceOverwrite,
) {
  const src = dirname(join(root, app));
  const mocks = join(src, 'mocks');
  const appTemplate = await fillTemplate('piral-index.html', {
    extension: getLanguageExtension(language),
  });

  await createFileIfNotExists(root, app, appTemplate, forceOverwrite);
  await createFileFromTemplateIfNotExists('piral', mocks, 'backend.js', forceOverwrite);

  switch (language) {
    case PiletLanguage.ts:
      await createFileFromTemplateIfNotExists('piral', root, 'tsconfig.json', forceOverwrite, {
        src: relative(root, src),
      });
      await createFileFromTemplateIfNotExists(packageName, src, 'index.tsx', forceOverwrite, {
        packageName,
      });
      break;
    case PiletLanguage.js:
      await createFileFromTemplateIfNotExists(packageName, src, 'index.jsx', forceOverwrite, {
        packageName,
      });
      break;
  }
}

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
      await createFileFromTemplateIfNotExists('pilet', root, 'tsconfig.json', forceOverwrite, {
        src: relative(root, src),
      });
      await createFileFromTemplateIfNotExists('pilet', src, 'index.tsx', forceOverwrite, {
        apiName,
        sourceName,
      });
      break;
    case PiletLanguage.js:
      await createFileFromTemplateIfNotExists('pilet', src, 'index.jsx', forceOverwrite, {
        apiName,
        sourceName,
      });
      break;
  }
}
