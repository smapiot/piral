import { renderFile } from 'ejs';
import { writeFile } from 'fs';
import { resolve } from 'path';
import { log } from './log';
import { ForceOverwrite } from './enums';
import { createFileIfNotExists } from './io';

export async function applyTemplate(file: string, data: Record<string, string>) {
  const content = await new Promise<string>((resolve, reject) => {
    log('generalDebug_0003', `Filling template in "${file}".`);
    renderFile(file, data, (err, str) => {
      if (err) {
        reject(err);
      } else {
        resolve(str);
      }
    });
  });
  await new Promise<void>((resolve, reject) => {
    writeFile(file, content, 'utf8', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export function fillTemplate(name: string, data: any = {}) {
  const path = resolve(__dirname, '..', '..', 'templates', `${name}.ejs`);
  return new Promise<string>((resolve, reject) => {
    log('generalDebug_0003', `Rendering template "${name}" in "${path}".`);
    renderFile(path, data, (err, str) => {
      if (err) {
        reject(err);
      } else {
        resolve(str);
      }
    });
  });
}

export async function createFileFromTemplateIfNotExists(
  prefix: string,
  targetDir: string,
  fileName: string,
  forceOverwrite?: ForceOverwrite,
  data?: any,
) {
  const content = await fillTemplate(`${prefix}-${fileName}`, data);
  await createFileIfNotExists(targetDir, fileName, content, forceOverwrite);
}
