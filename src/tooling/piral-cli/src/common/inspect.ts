import { dirname, basename } from 'path';
import { unpackGzTar } from './archive';
import { jju } from '../external';
import { PackageData, PackageFiles } from '../types';

const packageRoot = 'package/';

function getPackageJson(files: PackageFiles): PackageData {
  const fileName = `${packageRoot}package.json`;
  const fileContent = files[fileName];
  const content = fileContent.toString('utf8');
  return jju.parse(content);
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
  return paths.map((filePath) => `${packageRoot}${filePath}`).filter((filePath) => !!files[filePath])[0];
}

export interface PiletPackageData extends PackageData {
  root: string;
}

export function inspectPackage(stream: NodeJS.ReadableStream): Promise<PackageData> {
  return unpackGzTar(stream).then((files) => getPackageJson(files));
}

export function inspectPilet(stream: NodeJS.ReadableStream): Promise<PiletPackageData> {
  return unpackGzTar(stream).then((files) => {
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
