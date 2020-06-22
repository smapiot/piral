import { join, dirname, relative } from 'path';
import { log } from './log';
import { ForceOverwrite, PiletLanguage } from './enums';
import { getLanguageExtension } from './language';
import { fillTemplate, createFileFromTemplateIfNotExists } from './template';
import { createDirectory, createFileIfNotExists } from './io';
import { Framework, TemplateType } from '../types';

export async function scaffoldPiralSourceFiles(
  type: TemplateType,
  language: PiletLanguage,
  root: string,
  app: string,
  packageName: Framework,
  forceOverwrite: ForceOverwrite,
) {
  const src = dirname(join(root, app));
  const mocks = join(src, 'mocks');

  switch (packageName) {
    case 'piral': {
      log('generalDebug_0003', `Scaffolding Piral Instance files using "piral" ...`);
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
          await createFileFromTemplateIfNotExists(type, 'piral', src, 'index.tsx', forceOverwrite);
          break;
        case PiletLanguage.js:
          await createFileFromTemplateIfNotExists(type, 'piral', src, 'layout.jsx', forceOverwrite);
          await createFileFromTemplateIfNotExists(type, 'piral', src, 'index.jsx', forceOverwrite);
          break;
      }
      break;
    }

    case 'piral-core': {
      log('generalDebug_0003', `Scaffolding Piral Instance files using "piral-core" ...`);
      const appTemplate = await fillTemplate(type, 'piral-core-index.html', {
        extension: getLanguageExtension(language),
      });

      await createFileIfNotExists(root, app, appTemplate, forceOverwrite);
      await createFileFromTemplateIfNotExists(type, 'piral', mocks, 'backend.js', forceOverwrite);

      switch (language) {
        case PiletLanguage.ts:
          await createFileFromTemplateIfNotExists(type, 'piral', root, 'tsconfig.json', forceOverwrite, {
            src: relative(root, src),
          });
          await createFileFromTemplateIfNotExists(type, 'piral-core', src, 'index.tsx', forceOverwrite);
          break;
        case PiletLanguage.js:
          await createFileFromTemplateIfNotExists(type, 'piral-core', src, 'index.jsx', forceOverwrite);
          break;
      }
      break;
    }

    case 'piral-base':
      log('generalDebug_0003', `Scaffolding Piral Instance files using "piral-base" ...`);
      await createFileFromTemplateIfNotExists(type, 'piral', mocks, 'backend.js', forceOverwrite);

      switch (language) {
        case PiletLanguage.ts:
          await createFileFromTemplateIfNotExists(type, 'piral', root, 'tsconfig.json', forceOverwrite, {
            src: relative(root, src),
          });
          await createFileFromTemplateIfNotExists(type, 'piral-base', src, 'index.ts', forceOverwrite);
          break;
        case PiletLanguage.js:
          await createFileFromTemplateIfNotExists(type, 'piral-base', src, 'index.js', forceOverwrite);
          break;
      }
      break;

    default:
      log('generalDebug_0003', `Not scaffolding Piral Instance files. Uknown type "${packageName}" ...`);
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
      log('generalDebug_0003', `Scaffolding pilet for TypeScript ...`);
      await createFileFromTemplateIfNotExists(type, 'pilet', root, 'tsconfig.json', forceOverwrite, {
        src: relative(root, src),
      });
      await createFileFromTemplateIfNotExists(type, 'pilet', src, 'index.tsx', forceOverwrite, {
        sourceName,
      });
      break;
    case PiletLanguage.js:
      log('generalDebug_0003', `Scaffolding pilet for JavaScript ...`);
      await createFileFromTemplateIfNotExists(type, 'pilet', src, 'index.jsx', forceOverwrite, {
        sourceName,
      });
      break;
    default:
      log('generalDebug_0003', `Not scaffolding pilet. Unknown language "${language}" ...`);
      break;
  }
}
