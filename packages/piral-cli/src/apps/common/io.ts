import { mkdirSync, existsSync, writeFileSync, readFileSync, copyFileSync, constants } from 'fs';
import { join, resolve } from 'path';
import { deepMerge } from './merge';
import { promptSelect } from './interactive';

export enum ForceOverwrite {
  no,
  prompt,
  yes,
}

function promptOverwrite(file: string) {
  const message = `The file ${file} exists already. Do you want to overwrite it?`;
  return promptSelect(message, ['no', 'yes'], 'no') === 'yes';
}

export function createDirectory(targetDir: string) {
  try {
    mkdirSync(targetDir, { recursive: true });
    return true;
  } catch (e) {
    console.error(`Error while creating ${targetDir}: `, e);
    return false;
  }
}

export function findFile(topDir: string, fileName: string): string {
  const path = join(topDir, fileName);

  if (!existsSync(path)) {
    const parentDir = resolve(topDir, '..');

    if (parentDir !== topDir) {
      return findFile(parentDir, fileName);
    }

    return undefined;
  }

  return path;
}

export function createFileIfNotExists(
  targetDir: string,
  fileName: string,
  content: string,
  forceOverwrite = ForceOverwrite.no,
) {
  const targetFile = join(targetDir, fileName);

  if (
    !existsSync(targetFile) ||
    forceOverwrite === ForceOverwrite.yes ||
    (forceOverwrite === ForceOverwrite.prompt && promptOverwrite(targetFile))
  ) {
    writeFileSync(targetFile, content, 'utf8');
  }
}

export function updateExistingFile(targetDir: string, fileName: string, content: string) {
  const targetFile = join(targetDir, fileName);

  if (existsSync(targetFile)) {
    writeFileSync(targetFile, content, 'utf8');
  }
}

export function mergeWithJson<T>(targetDir: string, fileName: string, newContent: T) {
  const targetFile = join(targetDir, fileName);
  const content = readFileSync(targetFile, 'utf8');
  const originalContent = JSON.parse(content);
  return deepMerge(originalContent, newContent);
}

export function readJson<T = any>(targetDir: string, fileName: string) {
  const targetFile = join(targetDir, fileName);
  const content = readFileSync(targetFile, 'utf8');
  return JSON.parse(content || '{}') as T;
}

export function updateExistingJson<T>(targetDir: string, fileName: string, newContent: T) {
  const content = mergeWithJson(targetDir, fileName, newContent);
  updateExistingFile(targetDir, fileName, JSON.stringify(content, undefined, 2));
}

export function copyFile(source: string, target: string, forceOverwrite = ForceOverwrite.no) {
  try {
    const flag = forceOverwrite === ForceOverwrite.yes ? 0 : constants.COPYFILE_EXCL;
    copyFileSync(source, target, flag);
  } catch (e) {
    if (forceOverwrite === ForceOverwrite.prompt) {
      if (promptOverwrite(target)) {
        copyFile(source, target, ForceOverwrite.yes);
      }
    } else {
      console.warn(e.message || `Did not overwrite: File ${target} already exists.`);
    }
  }
}
