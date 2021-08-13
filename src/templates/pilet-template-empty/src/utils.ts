import { resolve, join, posix } from 'path';
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

export function getPackageJsonWithSource(targetDir: string, fileName: string) {
  return Promise.resolve({
    content: Buffer.from(`{"source":${JSON.stringify(posix.join(targetDir, fileName))}}`, 'utf8'),
    path: 'package.json',
  });
}

export async function getFileFromTemplate(targetDir: string, fileName: string, data?: any): Promise<TemplateFile> {
  const content = await fillTemplate(`pilet-${fileName}`, data);
  return {
    content: Buffer.from(content, 'utf8'),
    path: join(targetDir, fileName),
  };
}
