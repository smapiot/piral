import { resolve, relative } from 'path';
import { getFileFromTemplate, getLanguageExtension, TemplateFile } from './utils';

export interface TemplateArgs {
  language?: string;
  packageName?: string;
  mocks?: string;
  src?: string;
}

export default async function (root: string, args: TemplateArgs) {
  const { language = 'ts', packageName = 'piral', mocks = 'mocks', src = 'src' } = args;
  const srcDir = relative(root, resolve(root, src));
  const mocksDir = relative(root, resolve(root, src, mocks));
  const files: Array<Promise<TemplateFile>> = [];
  const data = {
    extension: getLanguageExtension(language, packageName !== 'piral-base'),
    src: srcDir,
  };

  switch (packageName) {
    case 'piral-core': {
      files.push(
        getFileFromTemplate(srcDir, 'piral-core', 'index.html', data),
        getFileFromTemplate(mocksDir, 'piral', 'backend.js', data),
      );

      switch (language) {
        case 'js':
          files.push(getFileFromTemplate(srcDir, 'piral-core', 'index.jsx', data));
          break;
        case 'ts':
        default:
          files.push(
            getFileFromTemplate('.', 'piral', 'tsconfig.json', data),
            getFileFromTemplate(srcDir, 'piral-core', 'index.tsx', data),
          );
          break;
      }
      break;
    }

    case 'piral-base':
      files.push(
        getFileFromTemplate(srcDir, 'piral-base', 'index.html', data),
        getFileFromTemplate(mocksDir, 'piral', 'backend.js', data),
      );

      switch (language) {
        case 'js':
          files.push(getFileFromTemplate(srcDir, 'piral-base', 'index.js', data));
          break;
        case 'ts':
        default:
          files.push(
            getFileFromTemplate('.', 'piral', 'tsconfig.json', data),
            getFileFromTemplate(srcDir, 'piral-base', 'index.ts', data),
          );
          break;
      }
      break;

    case 'piral':
    default: {
      files.push(
        getFileFromTemplate(srcDir, 'piral', 'index.html', data),
        getFileFromTemplate(mocksDir, 'piral', 'backend.js', data),
      );

      switch (language) {
        case 'js':
          files.push(getFileFromTemplate(srcDir, 'piral', 'index.jsx', data));
          break;
        case 'ts':
        default:
          files.push(
            getFileFromTemplate('.', 'piral', 'tsconfig.json', data),
            getFileFromTemplate(srcDir, 'piral', 'index.tsx', data),
          );
          break;
      }
      break;
    }
  }

  return await Promise.all(files);
}
