import { transpileModule, ModuleKind, ModuleResolutionKind, ScriptTarget, JsxEmit, version } from 'typescript';
import { join, resolve, basename, dirname, extname } from 'path';
import { exists, lstat, unlink, statSync } from 'fs';
import { mkdtemp, mkdir, constants } from 'fs';
import { writeFile, readFile, readdir, copyFile } from 'fs';
import { packageJson, piletJson } from './constants';
import { log } from './log';
import { deepMerge } from './merge';
import { computeHash } from './hash';
import { ForceOverwrite } from './enums';
import { promptConfirm } from './interactive';
import { glob, rimraf } from '../external';

function promptOverwrite(file: string) {
  const message = `The file ${file} exists already. Do you want to overwrite it?`;
  return promptConfirm(message, false);
}

function isFile(file: string) {
  return statSync(file).isFile();
}

export interface Destination {
  outDir: string;
  outFile: string;
}

export function getDestination(entryFiles: string, target: string): Destination {
  const isdir = extname(target) !== '.html';

  if (isdir) {
    return {
      outDir: target,
      outFile: basename(entryFiles),
    };
  } else {
    return {
      outDir: dirname(target),
      outFile: basename(target),
    };
  }
}

export async function removeAny(target: string) {
  const isDir = await checkIsDirectory(target);

  if (isDir) {
    await removeDirectory(target);
  } else {
    await removeFile(target);
  }
}

export function removeDirectory(targetDir: string) {
  log('generalDebug_0003', `Removing the directory "${targetDir}" ...`);
  return rimraf(targetDir);
}

export async function createDirectory(targetDir: string) {
  try {
    log('generalDebug_0003', `Trying to create "${targetDir}" ...`);
    await new Promise<void>((resolve, reject) => {
      mkdir(targetDir, { recursive: true }, (err) => (err ? reject(err) : resolve()));
    });
    return true;
  } catch (e) {
    log('cannotCreateDirectory_0044');
    log('generalDebug_0003', `Error while creating ${targetDir}: ${e}`);
    return false;
  }
}

export async function getEntryFiles(content: string, basePath: string) {
  log('generalDebug_0003', `Extract entry files from "${basePath}".`);
  const matcher = /<script\s.*?src=(?:"(.*?)"|'(.*?)'|([^\s>]*)).*?>/gi;
  const results: Array<string> = [];
  let result: RegExpExecArray = undefined;

  while ((result = matcher.exec(content))) {
    const src = result[1] || result[2] || result[3];
    log('generalDebug_0003', `Found potential entry file "${src}".`);
    const filePath = resolve(basePath, src);
    const exists = await checkExists(filePath);

    if (exists) {
      results.push(filePath);
    }
  }

  return results;
}

export function makeTempDir(prefix: string) {
  return new Promise<string>((resolve, reject) =>
    mkdtemp(prefix, (err, folder) => {
      if (err) {
        reject(err);
      } else {
        resolve(folder);
      }
    }),
  );
}

export function checkExists(target: string) {
  return new Promise<boolean>((resolve) => {
    if (target !== undefined) {
      exists(target, resolve);
    } else {
      resolve(false);
    }
  });
}

export async function checkExistingDirectory(target: string) {
  log('generalDebug_0003', `Checking directory "${target}" ...`);

  if (await checkExists(target)) {
    log('generalDebug_0003', `Target exists, but not yet clear if directory.`);
    return await checkIsDirectory(target);
  }

  return false;
}

export function checkIsDirectory(target: string) {
  return new Promise<boolean>((resolve) => {
    lstat(target, (err, stats) => {
      if (err) {
        resolve(extname(target) === '');
      } else {
        resolve(stats.isDirectory());
      }
    });
  });
}

export function getFileNames(target: string) {
  return new Promise<Array<string>>((resolve, reject) => {
    readdir(target, (err, files) => (err ? reject(err) : resolve(files)));
  });
}

export async function findFile(
  topDir: string,
  fileName: string | Array<string>,
  stopDir = resolve(topDir, '/'),
): Promise<string> {
  const fileNames = Array.isArray(fileName) ? fileName : [fileName];

  for (const fn of fileNames) {
    const path = join(topDir, fn);
    const exists = await checkExists(path);

    if (exists) {
      return path;
    }
  }

  if (topDir !== stopDir) {
    const parentDir = resolve(topDir, '..');
    return await findFile(parentDir, fileNames, stopDir);
  }

  return undefined;
}

interface AnyPattern {
  original: string;
  patterns: Array<string>;
}

function matchPattern(baseDir: string, pattern: string) {
  return new Promise<Array<string>>((resolve, reject) => {
    glob(
      pattern,
      {
        cwd: baseDir,
        nodir: true,
        absolute: true,
      },
      (err, files) => {
        if (err) {
          reject(err);
        } else {
          resolve(files);
        }
      },
    );
  });
}

async function matchAnyPattern(baseDir: string, pattern: AnyPattern) {
  const matches = await Promise.all(pattern.patterns.map((pattern) => matchPattern(baseDir, pattern)));

  return {
    pattern: pattern.original,
    results: matches.reduce((agg, curr) => [...agg, ...curr], []),
  };
}

const preferences = ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.cjs', '.esm', '.es', '.es6', '.html'];

export async function matchAnyPilet(baseDir: string, patterns: Array<string>) {
  const matches: Array<string> = [];
  const pilets: Array<string> = [];
  const matched = (name: string, path: string) => {
    pilets.push(name);
    matches.push(path);
  };
  const exts = preferences.map((s) => s.substring(1)).join(',');
  const allPatterns = patterns.reduce<Array<AnyPattern>>((agg, curr) => {
    const patterns = [];

    if (/[a-zA-Z0-9\-\*]$/.test(curr) && !preferences.find((ext) => curr.endsWith(ext))) {
      patterns.push(curr, `${curr}.{${exts}}`, `${curr}/${packageJson}`, `${curr}/${piletJson}`);
    } else if (curr.endsWith('/')) {
      patterns.push(`${curr}index.{${exts}}`, `${curr}${packageJson}`, `${curr}${piletJson}`);
    } else if (curr === '.' || curr === '..') {
      patterns.push(`${curr}/index.{${exts}}`, `${curr}/${packageJson}`, `${curr}/${piletJson}`);
    } else {
      patterns.push(curr);
    }

    agg.push({ original: curr, patterns });
    return agg;
  }, []);

  await Promise.all(
    allPatterns.map((patterns) =>
      matchAnyPattern(baseDir, patterns).then(async ({ results, pattern }) => {
        if (!results.length) {
          log('generalDebug_0003', `Found no potential entry points using "${pattern}".`);
        } else {
          //TODO -> shouldn't take the first one,
          // should be the first one, yes, but, PER pilet
          // so that multiple pilets can be considered, too
          log('generalDebug_0003', `Found ${results.length} potential entry points in "${pattern}".`);

          for (const result of results) {
            const fileName = basename(result);

            if (fileName === packageJson) {
              log('generalDebug_0003', `Entry point is a "${packageJson}" and needs further inspection.`);
              const targetDir = dirname(result);
              const { source, name } = await readJson(targetDir, fileName);

              if (!pilets.includes(name)) {
                if (typeof source === 'string') {
                  log('generalDebug_0003', `Found a "source" field with value "${source}".`);
                  const target = resolve(targetDir, source);
                  const exists = await checkExists(target);

                  if (exists) {
                    log('generalDebug_0003', `Taking existing target as "${target}".`);
                    matched(name, target);
                  } else {
                    log('generalDebug_0003', `Source target "${target}" does not exist. Skipped.`);
                  }
                } else {
                  log('generalDebug_0003', `No "source" field found. Trying combinations in "src".`);
                  const files = await matchPattern(targetDir, `src/index.{${exts}}`);

                  if (files.length > 0) {
                    log('generalDebug_0003', `Found a result; taking "${files[0]}".`);
                    matched(name, files[0]);
                  } else {
                    log('generalDebug_0003', `Found no results in "src". Skipped.`);
                  }
                }
              }
            } else {
              const packageJsonPath = await findFile(result, packageJson);

              if (packageJsonPath) {
                const targetDir = dirname(packageJsonPath);
                const { name } = await readJson(targetDir, packageJson);

                if (!pilets.includes(name)) {
                  log('generalDebug_0003', `Entry point result is "${result}".`);
                  matched(name, result);
                }
              } else {
                log('generalDebug_0003', `Could not find "${packageJson}" for entry "${result}". Skipping.`);
              }
            }
          }
        }
      }),
    ),
  );

  return matches;
}

export function matchFiles(baseDir: string, pattern: string) {
  return new Promise<Array<string>>((resolve, reject) => {
    glob(
      pattern,
      {
        cwd: baseDir,
        absolute: true,
        dot: true,
      },
      (err, files) => {
        if (err) {
          reject(err);
        } else {
          resolve(files.filter(isFile));
        }
      },
    );
  });
}

export async function createFileIfNotExists(
  targetDir: string,
  fileName: string,
  content: Buffer | string,
  forceOverwrite = ForceOverwrite.no,
) {
  const targetFile = join(targetDir, fileName);
  log('generalDebug_0003', `Checking if file "${targetFile}" exists ...`);
  const exists = await checkExists(targetFile);

  if (
    !exists ||
    forceOverwrite === ForceOverwrite.yes ||
    (forceOverwrite === ForceOverwrite.prompt && (await promptOverwrite(targetFile)))
  ) {
    await createDirectory(dirname(targetFile));
    log('generalDebug_0003', `Creating file "${targetFile}" ...`);

    if (typeof content === 'string') {
      await writeText(targetDir, fileName, content);
    } else {
      await writeBinary(targetDir, fileName, content);
    }
  }
}

export async function updateExistingFile(targetDir: string, fileName: string, content: string) {
  const targetFile = join(targetDir, fileName);
  log('generalDebug_0003', `Checking if file "${targetFile}" exists ...`);
  const exists = await checkExists(targetFile);

  if (exists) {
    log('generalDebug_0003', `Updating file "${targetFile}" ...`);
    await new Promise<void>((resolve, reject) => {
      writeFile(targetFile, content, 'utf8', (err) => (err ? reject(err) : resolve()));
    });
  }
}

export async function getHash(targetFile: string) {
  return new Promise<string>((resolve) => {
    readFile(targetFile, (err, c) => (err ? resolve(undefined) : resolve(computeHash(c))));
  });
}

export async function mergeWithJson<T>(targetDir: string, fileName: string, newContent: T) {
  const targetFile = join(targetDir, fileName);
  const content = await new Promise<string>((resolve) => {
    readFile(targetFile, 'utf8', (err, c) => (err ? resolve('{}') : resolve(c)));
  });
  const originalContent = JSON.parse(content);
  return deepMerge(originalContent, newContent);
}

export async function readJson<T = any>(targetDir: string, fileName: string, defaultValue = {}) {
  const targetFile = join(targetDir, fileName);
  const content = await new Promise<string>((resolve) => {
    readFile(targetFile, 'utf8', (err, c) => (err ? resolve('') : resolve(c)));
  });

  if (content) {
    try {
      return JSON.parse(content) as T;
    } catch (ex) {
      log('generalError_0002', `Invalid JSON found in file "${fileName}" at "${targetDir}".`);
    }
  }

  return defaultValue as T;
}

export function readBinary(targetDir: string, fileName: string) {
  const targetFile = join(targetDir, fileName);
  return new Promise<Buffer>((resolve) => {
    readFile(targetFile, (err, c) => (err ? resolve(undefined) : resolve(c)));
  });
}

export function readText(targetDir: string, fileName: string) {
  const targetFile = join(targetDir, fileName);
  return new Promise<string>((resolve) => {
    readFile(targetFile, 'utf8', (err, c) => (err ? resolve(undefined) : resolve(c)));
  });
}

export function writeJson<T = any>(targetDir: string, fileName: string, data: T, beautify = false) {
  const text = beautify ? JSON.stringify(data, undefined, 2) : JSON.stringify(data);
  return writeText(targetDir, fileName, text + '\n');
}

export function writeText(targetDir: string, fileName: string, content: string) {
  const data = Buffer.from(content, 'utf8');
  return writeBinary(targetDir, fileName, data);
}

export function writeBinary(targetDir: string, fileName: string, data: Buffer) {
  const targetFile = join(targetDir, fileName);
  return new Promise<void>((resolve, reject) => {
    writeFile(targetFile, data, (err) => (err ? reject(err) : resolve()));
  });
}

export async function updateExistingJson<T>(targetDir: string, fileName: string, newContent: T) {
  const content = await mergeWithJson(targetDir, fileName, newContent);
  const text = JSON.stringify(content, undefined, 2);
  await updateExistingFile(targetDir, fileName, text + '\n');
}

export async function copy(source: string, target: string, forceOverwrite = ForceOverwrite.no): Promise<boolean> {
  await createDirectory(dirname(target));

  try {
    const flag = forceOverwrite === ForceOverwrite.yes ? 0 : constants.COPYFILE_EXCL;
    const isDir = await checkIsDirectory(source);

    if (isDir) {
      const files = await getFileNames(source);
      const results = await Promise.all(
        files.map((file) => copy(resolve(source, file), resolve(target, file), forceOverwrite)),
      );
      return results.every(Boolean);
    } else {
      await new Promise<void>((resolve, reject) => {
        copyFile(source, target, flag, (err) => (err ? reject(err) : resolve()));
      });
      return true;
    }
  } catch (e) {
    if (forceOverwrite === ForceOverwrite.prompt) {
      const shouldOverwrite = await promptOverwrite(target);

      if (shouldOverwrite) {
        return await copy(source, target, ForceOverwrite.yes);
      }
    } else {
      log('didNotOverWriteFile_0045', target);
    }
  }

  return false;
}

/**
 * @deprecated Will be removed with v1. Please use "removeFile".
 */
export function remove(target: string) {
  return removeFile(target);
}

export function removeFile(target: string) {
  return new Promise<void>((resolve, reject) => {
    unlink(target, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export async function move(source: string, target: string, forceOverwrite = ForceOverwrite.no) {
  const dir = await checkIsDirectory(target);

  if (dir) {
    const file = basename(source);
    target = resolve(target, file);
  }

  const success = await copy(source, target, forceOverwrite);

  if (success) {
    await removeFile(source);
    return target;
  }

  return source;
}

function isVersion5OrHigher() {
  const currentMajor = parseInt(version.split('.').shift());
  return currentMajor >= 5;
}

export async function getSourceFiles(entry: string) {
  const dir = dirname(entry);
  log('generalDebug_0003', `Trying to get source files from "${dir}" ...`);
  const files = await matchFiles(dir, '**/*.?(jsx|tsx|js|ts)');
  return files.map((path) => {
    const directory = dirname(path);
    const name = basename(path);

    return {
      path,
      directory,
      name,
      async read() {
        const content = await readText(directory, name);

        if (name.endsWith('.ts') || name.endsWith('.tsx')) {
          return transpileModule(content, {
            fileName: path,
            moduleName: name,
            compilerOptions: {
              allowJs: true,
              skipLibCheck: true,
              declaration: false,
              sourceMap: false,
              checkJs: false,
              jsx: JsxEmit.React,
              module: ModuleKind.ESNext,
              moduleResolution: isVersion5OrHigher() ? ModuleResolutionKind.Bundler : ModuleResolutionKind.Node10,
              target: ScriptTarget.ESNext,
            },
          }).outputText;
        }

        return content;
      },
    };
  });
}
