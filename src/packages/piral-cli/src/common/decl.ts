import { resolve, dirname, basename, isAbsolute, relative, join, sep } from 'path';
import { existsSync, statSync } from 'fs';
import { readText } from './io';
import { findPackageRoot } from './package';

const importDeclRx = /import\s+((.*?)\s+from\s*)?['"`](.*?)['"`]\s*;?/g;
const exportDeclRx = /export\s+((.*?)\s+from\s*){1}['"`](.*?)['"`]\s*;?/g;
const allowedPackages = ['piral', 'react-arbiter', 'react-atom', '@dbeining/react-atom'];

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

interface TraverseRoot {
  baseDir: string;
  fileName: string;
  moduleName: string;
  content: string;
}

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

export * from 'piral-core/api';`;
}

function isContainedPackage(name: string) {
  return name.startsWith('piral-') || allowedPackages.includes(name);
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

function splitPackageName(moduleName: string) {
  if (moduleName.startsWith('@')) {
    const [scope, name, ...rest] = moduleName.split('/');
    return [`${scope}/${name}`, rest.join('/')];
  } else {
    const [name, ...rest] = moduleName.split('/');
    return [name, rest.join('/')];
  }
}

function packagePath(baseDir: string, moduleName: string) {
  const [name, relPath] = splitPackageName(moduleName);

  if (isContainedPackage(name)) {
    const targetJsonPath = findPackageRoot(name, baseDir);
    const targetJsonData = require(targetJsonPath);
    const root = dirname(targetJsonPath);
    const relTypings = relPath || targetJsonData.typings || targetJsonData.main.replace('.js', '.d.ts');
    return declarationPath(resolve(root, relTypings));
  }

  return undefined;
}

function normalizePath(baseDir: string, name: string) {
  if (isAbsolute(name)) {
    return declarationPath(name);
  } else if (name.startsWith('.')) {
    return declarationPath(resolve(baseDir, name));
  } else {
    return packagePath(baseDir, name);
  }
}

function modularize(path: string) {
  if (path.endsWith('.d.ts')) {
    path = path.substr(0, path.length - 5);
  }

  if (path.endsWith(`${sep}index`)) {
    path = path.substr(0, path.length - 6);
  }

  const fullPath = path;

  while (!existsSync(join(path, 'package.json'))) {
    path = join(path, '..');
  }

  return relative(join(path, '..'), fullPath);
}

function getReferences(rx: RegExp, baseDir: string, content: string) {
  const references: Array<ReferenceDeclaration> = [];
  let match: boolean | RegExpExecArray = true;

  while (match) {
    match = rx.exec(content);

    if (match) {
      const relName = match[3];
      const path = normalizePath(baseDir, relName);

      if (path !== undefined) {
        const name = modularize(path);
        const original = match[0];
        const modified = name === relName ? original : original.replace(relName, name);

        references.push({
          name,
          path,
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
    .replace(/declare (module|type|const|function|class)/g, '$1')
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

async function traverseFiles(files: Array<DeclarationFile>, { baseDir, content, fileName, moduleName }: TraverseRoot) {
  const exportRefs = getReferences(exportDeclRx, baseDir, content);
  const importRefs = getReferences(importDeclRx, baseDir, content);
  const references = [...importRefs, ...exportRefs];

  files.push({
    content: `declare module '${moduleName}' {
  ${format(content, references)}
}`,
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
    .join('\n\n');
}
