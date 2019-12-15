import * as glob from 'glob';
import * as rimraf from 'rimraf';
import { transpileModule, ModuleKind, ModuleResolutionKind, ScriptTarget, JsxEmit } from 'typescript';
import { join, resolve, basename, dirname, extname, isAbsolute, sep } from 'path';
import {
  writeFile,
  readFile,
  copyFile,
  constants,
  exists,
  mkdir,
  lstat,
  unlink,
  mkdirSync,
  existsSync,
  statSync,
} from 'fs';
import { deepMerge } from './merge';
import { promptConfirm } from './interactive';
import { nodeVersion } from './info';
import { computeHash } from './hash';

export enum ForceOverwrite {
  no,
  prompt,
  yes,
}

function promptOverwrite(file: string) {
  const message = `The file ${file} exists already. Do you want to overwrite it?`;
  return promptConfirm(message, false);
}

function createDirectoryLegacy(targetDir: string) {
  const initDir = isAbsolute(targetDir) ? sep : '';

  return targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = resolve(parentDir, childDir);

    try {
      mkdirSync(curDir);
    } catch (err) {
      if (err.code === 'EEXIST') {
        return curDir;
      }

      if (err.code === 'ENOENT') {
        throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
      }

      const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;

      if (!caughtErr || (caughtErr && curDir === resolve(targetDir))) {
        throw err;
      }
    }

    return curDir;
  }, initDir);
}

function isFile(file: string) {
  return statSync(file).isFile();
}

function isLegacy() {
  const parts = nodeVersion.split('.');
  return +parts[0] < 10 || (+parts[0] === 10 && +parts[1] < 12);
}

export function removeDirectory(targetDir: string) {
  return new Promise<void>((resolve, reject) => rimraf(targetDir, err => (err ? reject(err) : resolve())));
}

export async function createDirectory(targetDir: string) {
  if (isLegacy()) {
    try {
      createDirectoryLegacy(targetDir);
      return true;
    } catch (e) {
      console.error(`Error while creating ${targetDir}: `, e);
      return false;
    }
  }

  try {
    await new Promise((resolve, reject) => {
      mkdir(targetDir, { recursive: true }, err => (err ? reject(err) : resolve()));
    });
    return true;
  } catch (e) {
    console.error(`Error while creating ${targetDir}: `, e);
    return false;
  }
}

export function checkExists(target: string) {
  return new Promise<boolean>(resolve => {
    exists(target, resolve);
  });
}

export async function checkExistingDirectory(target: string) {
  if (await checkExists(target)) {
    return await checkIsDirectory(target);
  }

  return false;
}

export function checkIsDirectory(target: string) {
  return new Promise<boolean>(resolve => {
    lstat(target, (err, stats) => {
      if (err) {
        resolve(extname(target) === '');
      } else {
        resolve(stats.isDirectory());
      }
    });
  });
}

export function getFileWithExtension(fileName: string): string {
  if (!extname(fileName)) {
    const extensions = ['.tsx', '.ts', '.jsx', '.js'];

    for (const extension of extensions) {
      const file = fileName + extension;

      if (existsSync(file)) {
        return file;
      }
    }
  }

  return fileName;
}

export async function findFile(topDir: string, fileName: string): Promise<string> {
  const path = join(topDir, fileName);
  const exists = await checkExists(path);

  if (!exists) {
    const parentDir = resolve(topDir, '..');

    if (parentDir !== topDir) {
      return await findFile(parentDir, fileName);
    }

    return undefined;
  }

  return path;
}

export async function matchFiles(baseDir: string, pattern: string) {
  return new Promise<Array<string>>((resolve, reject) => {
    glob(
      pattern,
      {
        cwd: baseDir,
        absolute: true,
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
  content: string,
  forceOverwrite = ForceOverwrite.no,
) {
  const targetFile = join(targetDir, fileName);
  const exists = await checkExists(targetFile);

  if (
    !exists ||
    forceOverwrite === ForceOverwrite.yes ||
    (forceOverwrite === ForceOverwrite.prompt && (await promptOverwrite(targetFile)))
  ) {
    await createDirectory(dirname(targetFile));
    await new Promise((resolve, reject) => {
      writeFile(targetFile, content, 'utf8', err => (err ? reject(err) : resolve()));
    });
  }
}

export async function updateExistingFile(targetDir: string, fileName: string, content: string) {
  const targetFile = join(targetDir, fileName);
  const exists = await checkExists(targetFile);

  if (exists) {
    await new Promise((resolve, reject) => {
      writeFile(targetFile, content, 'utf8', err => (err ? reject(err) : resolve()));
    });
  }
}

export async function getHash(targetFile: string) {
  return new Promise<string>(resolve => {
    readFile(targetFile, (err, c) => (err ? resolve(undefined) : resolve(computeHash(c))));
  });
}

export async function mergeWithJson<T>(targetDir: string, fileName: string, newContent: T) {
  const targetFile = join(targetDir, fileName);
  const content = await new Promise<string>((resolve, reject) => {
    readFile(targetFile, 'utf8', (err, c) => (err ? reject(err) : resolve(c)));
  });
  const originalContent = JSON.parse(content);
  return deepMerge(originalContent, newContent);
}

export async function readJson<T = any>(targetDir: string, fileName: string) {
  const targetFile = join(targetDir, fileName);
  const content = await new Promise<string>(resolve => {
    readFile(targetFile, 'utf8', (err, c) => (err ? resolve('') : resolve(c)));
  });
  return JSON.parse(content || '{}') as T;
}

export function writeJson<T = any>(targetDir: string, fileName: string, data: T) {
  return writeText(targetDir, fileName, JSON.stringify(data));
}

export function readBinary(targetDir: string, fileName: string) {
  const targetFile = join(targetDir, fileName);
  return new Promise<Buffer>(resolve => {
    readFile(targetFile, (err, c) => (err ? resolve(undefined) : resolve(c)));
  });
}

export function writeText(targetDir: string, fileName: string, data: string) {
  const targetFile = join(targetDir, fileName);
  return new Promise<void>((resolve, reject) => {
    writeFile(targetFile, data, 'utf8', err => (err ? reject() : resolve()));
  });
}

export function readText(targetDir: string, fileName: string) {
  const targetFile = join(targetDir, fileName);
  return new Promise<string>(resolve => {
    readFile(targetFile, 'utf8', (err, c) => (err ? resolve(undefined) : resolve(c)));
  });
}

export async function updateExistingJson<T>(targetDir: string, fileName: string, newContent: T) {
  const content = await mergeWithJson(targetDir, fileName, newContent);
  await updateExistingFile(targetDir, fileName, JSON.stringify(content, undefined, 2));
}

export async function copy(source: string, target: string, forceOverwrite = ForceOverwrite.no) {
  await createDirectory(dirname(target));

  try {
    const flag = forceOverwrite === ForceOverwrite.yes ? 0 : constants.COPYFILE_EXCL;
    await new Promise((resolve, reject) => {
      copyFile(source, target, flag, err => (err ? reject(err) : resolve()));
    });
  } catch (e) {
    if (forceOverwrite === ForceOverwrite.prompt) {
      const shouldOverwrite = await promptOverwrite(target);

      if (shouldOverwrite) {
        await copy(source, target, ForceOverwrite.yes);
      }
    } else {
      console.warn(e.message || `Did not overwrite: File ${target} already exists.`);
    }
  }
}

export function remove(target: string) {
  return new Promise((resolve, reject) => {
    unlink(target, err => {
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

  await copy(source, target, forceOverwrite);
  await remove(source);
  return target;
}

export async function getSourceFiles(entry: string) {
  const dir = dirname(entry);
  const files = await matchFiles(dir, '**/*.?(jsx|tsx|js|ts)');
  return files.map(path => {
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
              moduleResolution: ModuleResolutionKind.NodeJs,
              target: ScriptTarget.ESNext,
            },
          }).outputText;
        }

        return content;
      },
    };
  });
}
