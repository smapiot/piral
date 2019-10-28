import { join, dirname, relative } from 'path';
import { PiletLanguage, getLanguageExtension } from './language';
import { fillTemplate, createFileFromTemplateIfNotExists, TemplateType } from './template';
import { createDirectory, createFileIfNotExists, ForceOverwrite } from './io';

export async function scaffoldPiralSourceFiles(
  type: TemplateType,
  language: PiletLanguage,
  root: string,
  app: string,
  packageName: string,
  forceOverwrite: ForceOverwrite,
) {
  const src = dirname(join(root, app));
  const mocks = join(src, 'mocks');
  const appTemplate = await fillTemplate(type, 'piral-index.html', {
    extension: getLanguageExtension(language),
  });

  await createFileIfNotExists(root, app, appTemplate, forceOverwrite);
  await createFileFromTemplateIfNotExists(type, 'piral', mocks, 'backend.js', forceOverwrite);
  await createFileFromTemplateIfNotExists(type, 'piral', src, 'style.scss', forceOverwrite);

  switch (language) {
    case PiletLanguage.ts:
      await createFileFromTemplateIfNotExists(type, 'piral', root, 'tsconfig.json', forceOverwrite, {
        src: relative(root, src),
      });
      await createFileFromTemplateIfNotExists(type, 'piral', src, 'layout.tsx', forceOverwrite);
      await createFileFromTemplateIfNotExists(type, 'piral', src, 'index.tsx', forceOverwrite, {
        packageName,
      });
      break;
    case PiletLanguage.js:
      await createFileFromTemplateIfNotExists(type, 'piral', src, 'layout.jsx', forceOverwrite);
      await createFileFromTemplateIfNotExists(type, 'piral', src, 'index.jsx', forceOverwrite, {
        packageName,
      });
      break;
  }
}

export async function scaffoldPiletSourceFiles(
  type: TemplateType,
  language: PiletLanguage,
  root: string,
  sourceName: string,
  forceOverwrite: ForceOverwrite,
) {
  const src = join(root, 'src');

  await createDirectory(src);

  switch (language) {
    case PiletLanguage.ts:
      await createFileFromTemplateIfNotExists(type, 'pilet', root, 'tsconfig.json', forceOverwrite, {
        src: relative(root, src),
      });
      await createFileFromTemplateIfNotExists(type, 'pilet', src, 'index.tsx', forceOverwrite, {
        sourceName,
      });
      break;
    case PiletLanguage.js:
      await createFileFromTemplateIfNotExists(type, 'pilet', src, 'index.jsx', forceOverwrite, {
        sourceName,
      });
      break;
  }
}
