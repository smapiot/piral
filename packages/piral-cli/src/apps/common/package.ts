import { createReadStream } from 'streamifier';
import { untarPackage } from './io';
import { PackageFiles, PackageData } from './types';

const packageRoot = 'package/';

function getPackageJson(files: PackageFiles): PackageData {
  const fileName = `${packageRoot}package.json`;
  const fileContent = files[fileName];
  return JSON.parse(fileContent);
}

async function getDefinition(pckg: Buffer) {
  const stream = createReadStream(pckg);
  const files = await untarPackage(stream);
  const data = getPackageJson(files);
  //TODO
  return files;
}

function downloadPackage(name: string, registry: string): Promise<Buffer> {
  return Promise.resolve(undefined);
}

export async function getPackage(name: string, registry: string) {
  var pckg = await downloadPackage(name, registry);
  var files = await getDefinition(pckg);
  return Object.keys(files).map(name => ({
    content: files[name],
    name,
  }))
}
