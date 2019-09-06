import { dirname, basename } from 'path';
import { untar, PackageFiles } from './untar';

const packageRoot = 'package/';

export interface PackageData {
  name: string;
  version: string;
  description: string;
  main: string;
  author:
    | string
    | {
        name?: string;
        url?: string;
        email?: string;
      };
  custom?: any;
}

function getPackageJson(files: PackageFiles): PackageData {
  const fileName = `${packageRoot}package.json`;
  const fileContent = files[fileName];
  const content = fileContent.toString('utf8');
  return JSON.parse(content);
}

function getPiletMainPath(data: PackageData, files: PackageFiles) {
  const paths = [
    data.main,
    `dist/${data.main}`,
    `${data.main}/index.js`,
    `dist/${data.main}/index.js`,
    'index.js',
    'dist/index.js',
  ];
  return paths.map(filePath => `${packageRoot}${filePath}`).filter(filePath => !!files[filePath])[0];
}

export interface PiletPackageData extends PackageData {
  root: string;
}

export function inspectPackage(stream: NodeJS.ReadableStream): Promise<PackageData> {
  return untar(stream).then(files => getPackageJson(files));
}

export function inspectPilet(stream: NodeJS.ReadableStream): Promise<PiletPackageData> {
  return untar(stream).then(files => {
    const data = getPackageJson(files);
    const path = getPiletMainPath(data, files);
    const root = dirname(path);
    const main = basename(path);
    return {
      ...data,
      root,
      main,
    };
  });
}
