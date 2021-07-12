import { resolve, join } from 'path';
import { renderFile } from 'ejs';

export interface TemplateFile {
  path: string;
  content: Buffer;
}

function fillTemplate(name: string, data: any = {}) {
  const path = resolve(__dirname, '..', 'templates', `${name}.ejs`);
  return new Promise<string>((resolve, reject) => {
    renderFile(path, data, (err, str) => {
      if (err) {
        reject(err);
      } else {
        resolve(str);
      }
    });
  });
}

export async function getFileFromTemplate(
  targetDir: string,
  prefix: string,
  fileName: string,
  data?: any,
): Promise<TemplateFile> {
  const content = await fillTemplate(`${prefix}-${fileName}`, data);
  return {
    content: Buffer.from(content, 'utf8'),
    path: join(targetDir, fileName),
  };
}

export function getLanguageExtension(language: string, isJsx = true) {
  switch (language) {
    case 'js':
      return isJsx ? '.jsx' : '.js';
    case 'ts':
    default:
      return isJsx ? '.tsx' : '.ts';
  }
}
