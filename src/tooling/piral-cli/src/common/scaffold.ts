import { join, dirname, resolve, basename, isAbsolute } from 'path';
import { installNpmPackageFromOptionalRegistry } from './npm';
import { ForceOverwrite } from './enums';
import { createDirectory, createFileIfNotExists, updateExistingJson } from './io';
import { cliVersion, isWindows } from './info';
import { log, fail, getLogLevel } from './log';
import { Framework, SourceLanguage } from '../types';

interface TemplateFile {
  path: string;
  content: Buffer | string;
}

function getTemplatePackage(templatePackageName: string) {
  const idx = templatePackageName.indexOf('@', 1);
  const normalizedName =
    idx > 0 && !isAbsolute(templatePackageName) ? templatePackageName.substring(0, idx) : templatePackageName;

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
  forceOverwrite: ForceOverwrite,
): Promise<Array<TemplateFile>> {
  // debug in monorepo such as "../templates/pilet-template-react/lib/index.js"
  if (templatePackageName.startsWith('.')) {
    templatePackageName = resolve(process.cwd(), templatePackageName);
  } else {
    if (templatePackageName.indexOf('@', 1) === -1) {
      templatePackageName = `${templatePackageName}@latest`;
    }

    await installNpmPackageFromOptionalRegistry(templatePackageName, __dirname, registry);
  }

  const templateRunner = getTemplatePackage(templatePackageName);
  const logLevel = getLogLevel();
  const details = {
    forceOverwrite,
    cliVersion,
    isWindows,
    logLevel,
  };

  if (typeof templateRunner === 'function') {
    return await templateRunner(root, data, details);
  } else if ('default' in templateRunner && typeof templateRunner.default === 'function') {
    return await templateRunner.default(root, data, details);
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
  if (template.indexOf('/') === -1 && !template.startsWith('.')) {
    return `@smapiot/${type}-template-${template}`;
  }

  return template;
}

export function getPiralScaffoldData(
  language: SourceLanguage,
  root: string,
  app: string,
  packageName: Framework,
  variables: Record<string, string>,
) {
  const src = dirname(join(root, app));
  return {
    ...variables,
    root,
    src,
    language,
    packageName,
    reactVersion: parseInt(variables.reactVersion) || 18,
    reactRouterVersion: parseInt(variables.reactRouterVersion) || 5,
  } as const;
}

export async function scaffoldPiralSourceFiles(
  template: string,
  registry: string,
  data: ReturnType<typeof getPiralScaffoldData>,
  forceOverwrite: ForceOverwrite,
) {
  const { src, root } = data;
  const templatePackageName = getTemplatePackageName('piral', template);

  await createDirectory(src);

  const files = await getTemplateFiles(templatePackageName, registry, root, data, forceOverwrite);

  await writeFiles(root, files, forceOverwrite);
}

export function getPiletScaffoldData(
  language: SourceLanguage,
  root: string,
  sourceName: string,
  variables: Record<string, string>,
) {
  const src = join(root, 'src');
  return {
    ...variables,
    root,
    src,
    language,
    sourceName,
  } as const;
}

export async function scaffoldPiletSourceFiles(
  template: string,
  registry: string,
  data: ReturnType<typeof getPiletScaffoldData>,
  forceOverwrite: ForceOverwrite,
) {
  const { src, root } = data;
  const templatePackageName = getTemplatePackageName('pilet', template);

  await createDirectory(src);

  const files = await getTemplateFiles(templatePackageName, registry, root, data, forceOverwrite);

  await writeFiles(root, files, forceOverwrite);
}
