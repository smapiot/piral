import { join, dirname, resolve, basename } from 'path';
import { installPackage } from './clients/npm';
import { ForceOverwrite, SourceLanguage } from './enums';
import { createDirectory, createFileIfNotExists, updateExistingJson } from './io';
import { log, fail } from './log';
import { Framework } from '../types';

interface TemplateFile {
  path: string;
  content: Buffer | string;
}

function getTemplatePackage(templatePackageName: string) {
  const idx = templatePackageName.indexOf('@');
  const normalizedName = idx > 0 ? templatePackageName.substr(0, idx) : templatePackageName;

  try {
    return require(normalizedName);
  } catch {
    fail(
      'generalError_0002',
      `Could not find the given template "${templatePackageName}". Package "${normalizedName}" could not be resolved.`,
    );
  }
}

async function getTemplateFiles(
  templatePackageName: string,
  registry: string,
  root: string,
  data: Record<string, any>,
): Promise<Array<TemplateFile>> {
  await installPackage(templatePackageName, __dirname, '--registry', registry);
  const templateRunner = getTemplatePackage(templatePackageName);

  if (typeof templateRunner === 'function') {
    return await templateRunner(root, data);
  } else if ('default' in templateRunner && typeof templateRunner.default === 'function') {
    return await templateRunner.default(root, data);
  } else {
    fail(
      'generalError_0002',
      `The provided template package "${templatePackageName}" does not export a template factory function.`,
    );
  }
}

function writeFiles(root: string, files: Array<TemplateFile>, forceOverwrite: ForceOverwrite) {
  const rootPackage = resolve(root, 'package.json');

  return Promise.all(
    files
      .filter((file) => {
        if (typeof file.path !== 'string') {
          log('generalWarning_0001', `The supplied file path ("${file.path}") is not a string. Skipping.`);
          return false;
        } else if (typeof file.content === 'undefined') {
          log('generalWarning_0001', `The file "${file.path}" did not specify any content. Skipping.`);
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

function getLanguageName(language: SourceLanguage) {
  switch (language) {
    case SourceLanguage.js:
      return 'js';
    case SourceLanguage.ts:
    default:
      return 'ts';
  }
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
    language: getLanguageName(language),
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
    language: getLanguageName(language),
    sourceName,
  });

  await writeFiles(root, files, forceOverwrite);
}
