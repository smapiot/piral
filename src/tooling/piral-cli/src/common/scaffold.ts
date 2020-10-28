import { join, dirname, resolve, basename } from 'path';
import { installDependencies } from './clients/npm';
import { ForceOverwrite, SourceLanguage } from './enums';
import { createDirectory, createFileIfNotExists, updateExistingJson } from './io';
import { Framework } from '../types';

interface TemplateFile {
  path: string;
  content: Buffer | string;
}

async function getTemplateFiles(
  templatePackageName: string,
  registry: string,
  root: string,
  data: Record<string, any>,
): Promise<Array<TemplateFile>> {
  await installDependencies(__dirname, templatePackageName, '--registry', registry);
  const templateRunner = require(templatePackageName);

  if (typeof templateRunner === 'function') {
    return await templateRunner(root, data);
  } else if ('default' in templateRunner && typeof templateRunner.default === 'function') {
    return await templateRunner.default(root, data);
  } else {
    //TODO log warning
  }

  return [];
}

function writeFiles(root: string, files: Array<TemplateFile>, forceOverwrite: ForceOverwrite) {
  const rootPackage = resolve(root, 'package.json');

  return Promise.all(
    files
      .filter((file) => {
        if (typeof file.path !== 'string') {
          //TODO warn due to invalid path
          return false;
        } else if (typeof file.content === 'undefined') {
          //TODO warn due to invalid content
          return false;
        }

        return true;
      })
      .map((file) => {
        const target = resolve(root, file.path);
        const name = basename(target);
        const dir = dirname(target);

        if (target !== rootPackage) {
          return createFileIfNotExists(dir, name, file.content, forceOverwrite);
        } else {
          return updateExistingJson(dir, name, JSON.parse(file.content.toString('utf8')));
        }
      }),
  );
}

function getTemplatePackageName(type: 'piral' | 'pilet', template: string) {
  if (template.indexOf('/') === -1) {
    return `@smapiot/${type}-template-${template}`;
  }

  return template;
}

export async function scaffoldPiralSourceFiles(
  template: string,
  registry: string,
  language: SourceLanguage,
  root: string,
  app: string,
  packageName: Framework,
  forceOverwrite: ForceOverwrite,
  variables: Record<string, string>,
) {
  const src = dirname(join(root, app));
  const templatePackageName = getTemplatePackageName('piral', template);

  await createDirectory(src);

  const files = await getTemplateFiles(templatePackageName, registry, root, {
    ...variables,
    src,
    language,
    packageName,
  });

  await writeFiles(root, files, forceOverwrite);
}

export async function scaffoldPiletSourceFiles(
  template: string,
  registry: string,
  language: SourceLanguage,
  root: string,
  sourceName: string,
  forceOverwrite: ForceOverwrite,
  variables: Record<string, string>,
) {
  const src = join(root, 'src');
  const templatePackageName = getTemplatePackageName('pilet', template);

  await createDirectory(src);

  const files = await getTemplateFiles(templatePackageName, registry, root, {
    ...variables,
    src,
    language,
    sourceName,
  });

  await writeFiles(root, files, forceOverwrite);
}
