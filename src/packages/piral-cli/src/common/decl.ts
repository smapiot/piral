import { resolve, dirname, basename, isAbsolute, relative, join } from 'path';
import { existsSync, statSync } from 'fs';
import { readText } from './io';
import { findPackageRoot } from './package';

export function combineApiDeclarations(root: string, dependencyNames: Array<string>) {
  const names = [root, ...dependencyNames];
  const paths: Array<string> = [];

  for (const name of names) {
    try {
      const moduleName = `${name}/api`;
      const target = `${moduleName}.d.ts`;
      require.resolve(target);
      paths.push(moduleName);
    } catch {
      //Skip module that cannot be resolved
    }
  }

  const imports = paths.map(path => `import '${path}';`).join('\n');
  return `${imports}

export { PiletApi } from 'piral-core';`;
}

interface ReferenceDeclaration {
  name: string;
  path: string;
  fields: string;
  original: string;
  modified: string;
}

interface DeclarationFile {
  imports: Array<ReferenceDeclaration>;
  exports: Array<ReferenceDeclaration>;
  content: string;
  path: string;
}

const importDeclRx = /import\s+((.*?)\s+from\s*)?['"`](.*?)['"`]\s*;?/g;
const exportDeclRx = /export\s+((.*?)\s+from\s*){1}['"`](.*?)['"`]\s*;?/g;

function isContainedPackage(name: string) {
  return name.startsWith('piral-') || ['piral', 'react-arbiter'].includes(name);
}

function declarationPath(path: string) {
  const extPath = path + '.d.ts';
  const indexPath = resolve(path, 'index.d.ts');

  if (existsSync(path) && statSync(path).isFile()) {
    return path;
  } else if (existsSync(extPath)) {
    return extPath;
  } else if (existsSync(indexPath)) {
    return indexPath;
  }

  return undefined;
}

function modularize(path: string) {
  if (path.endsWith('.d.ts')) {
    path = path.substr(0, path.length - 5);
  }

  if (path.endsWith('/index')) {
    path = path.substr(0, path.length - 6);
  }

  return path;
}

function packagePath(baseDir: string, moduleName: string, absolute = false) {
  const [pck, ...rest] = moduleName.split('/');

  if (isContainedPackage(pck)) {
    const relPath = rest.join('/');
    const targetJsonPath = findPackageRoot(pck, baseDir);
    const targetJsonData = require(targetJsonPath);
    const pckDirName = dirname(targetJsonPath);
    const relTypings = relPath || absolute || targetJsonData.typings || targetJsonData.main.replace('.js', '.d.ts');

    if (relTypings === true) {
      return pckDirName;
    }

    const absPath = resolve(pckDirName, relTypings);
    const resPath = declarationPath(absPath);

    if (absolute && resPath) {
      return dirname(resPath);
    }

    return resPath;
  }

  return undefined;
}

interface ReferenceData {
  path: string;
  name: string;
}

function normalizePath(baseDir: string, parentModule: string, name: string): ReferenceData {
  if (isAbsolute(name)) {
    const path = declarationPath(name);

    return (
      path && {
        name: modularize(name),
        path,
      }
    );
  } else if (name.startsWith('.')) {
    const root = packagePath(baseDir, parentModule, true);
    const path = root && declarationPath(resolve(baseDir, name));
    const child = path && join(parentModule, relative(root, path));

    return (
      child && {
        name: modularize(child),
        path,
      }
    );
  } else if (!name.startsWith('@')) {
    const path = packagePath(baseDir, name);

    return (
      path && {
        name,
        path,
      }
    );
  }

  return undefined;
}

function getReferences(rx: RegExp, parentModule: string, baseDir: string, content: string) {
  const references: Array<ReferenceDeclaration> = [];
  let match: boolean | RegExpExecArray = true;

  while (match) {
    match = rx.exec(content);

    if (match) {
      const relName = match[3];
      const data = normalizePath(baseDir, parentModule, relName);

      if (data !== undefined) {
        const original = match[0];
        const modified = data.name === relName ? original : original.replace(relName, data.name);

        references.push({
          ...data,
          fields: match[2],
          original,
          modified,
        });
      }
    }
  }

  return references;
}

function format(content: string, references: Array<ReferenceDeclaration>) {
  for (const reference of references) {
    content = content.replace(reference.original, reference.modified);
  }

  return content
    .replace(/declare module/g, 'module')
    .replace(/declare type/g, 'type')
    .split('\n')
    .join('\n  ');
}

async function readNextFile(ref: ReferenceDeclaration, files: Array<DeclarationFile>) {
  if (!files.some(file => file.path === ref.path)) {
    const referenceBaseDir = dirname(ref.path);
    const referenceFileName = basename(ref.path);
    const content = await readText(referenceBaseDir, referenceFileName);
    return {
      baseDir: referenceBaseDir,
      fileName: referenceFileName,
      moduleName: ref.name,
      content,
    };
  }
}

function unique<T extends { path: string }>(ref: T, index: number, self: Array<T>) {
  return self.findIndex(m => m.path === ref.path) === index;
}

interface TraverseRoot {
  baseDir: string;
  fileName: string;
  moduleName: string;
  content: string;
}

async function traverseFiles(files: Array<DeclarationFile>, { baseDir, content, fileName, moduleName }: TraverseRoot) {
  const exportRefs = getReferences(exportDeclRx, moduleName, baseDir, content);
  const importRefs = getReferences(importDeclRx, moduleName, baseDir, content);
  const references = [...importRefs, ...exportRefs];

  files.push({
    content: `
// from: ${baseDir}/${fileName}
declare module '${moduleName}' {
  ${format(content, references)}
}
`,
    path: resolve(baseDir, fileName),
    exports: exportRefs,
    imports: importRefs,
  });

  const nextRefs = references.filter(unique).map(ref => readNextFile(ref, files));

  const resolvedRefs = await Promise.all(nextRefs);
  const childFiles = resolvedRefs.filter(ref => !!ref);
  await Promise.all(childFiles.map(ref => traverseFiles(files, ref)));
}

export async function declarationFlattening(baseDir: string, appName: string, content: string) {
  const allFiles: Array<DeclarationFile> = [];

  await traverseFiles(allFiles, {
    baseDir,
    fileName: 'index.d.ts',
    moduleName: appName,
    content,
  });

  return allFiles
    .filter(unique)
    .map(file => file.content)
    .join('');
}
