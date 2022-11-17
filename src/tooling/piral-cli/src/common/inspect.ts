import { dirname, basename } from 'path';
import { unpackGzTar } from './archive';
import { jju } from '../external';
import { PiletPackageData, PackageData, PackageFiles } from '../types';

const packageRoot = 'package/';

function getPackageJson(files: PackageFiles): PackageData {
  const fileName = `${packageRoot}package.json`;
  const fileContent = files[fileName];
  const content = fileContent.toString('utf8');
  return jju.parse(content);
}

export function getPossiblePiletMainPaths(data: PiletPackageData) {
  const { main = 'index.js' } = data;
  return [main, `dist/${main}`, `${main}/index.js`, `dist/${main}/index.js`, 'index.js', 'dist/index.js'];
}

export function getPiletMainPath(data: PiletPackageData, files: PackageFiles) {
  const paths = getPossiblePiletMainPaths(data);
  return paths.map((filePath) => `${packageRoot}${filePath}`).find((filePath) => !!files[filePath]);
}

export interface InspectedPiletPackageData extends PiletPackageData {
  root: string;
}

export function inspectPackage(stream: NodeJS.ReadableStream): Promise<PackageData> {
  return unpackGzTar(stream).then((files) => getPackageJson(files));
}

export function inspectPilet(stream: NodeJS.ReadableStream): Promise<InspectedPiletPackageData> {
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
