import { resolve, dirname, basename, isAbsolute } from 'path';
import { existsSync } from 'fs';
import { readText } from './io';

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
}

interface DeclarationFile {
  imports: Array<ReferenceDeclaration>;
  exports: Array<ReferenceDeclaration>;
  content: string;
  path: string;
}

const importDeclRx = /import\s+((.*?)\s+from\s*)?['"`](.*?)['"`]\s*;?/g;
const exportDeclRx = /export\s+((.*?)\s+from\s*){1}['"`](.*?)['"`]\s*;?/g;

function declPath(path: string) {
  const extPath = path + '.d.ts';
  const indexPath = resolve(path, 'index.d.ts');

  if (existsSync(path)) {
    return path;
  } else if (existsSync(extPath)) {
    return extPath;
  } else if (existsSync(indexPath)) {
    return indexPath;
  }

  return undefined;
}

function normalize(baseDir: string, path: string) {
  if (isAbsolute(path)) {
    return declPath(path);
  } else if (path.startsWith('.')) {
    return declPath(resolve(baseDir, path));
  } else if (path.startsWith('piral-') || path.startsWith('piral/') || path === 'piral') {
    const target = path.endsWith('/api') ? path + '.d.ts' : path + '/api.d.ts';
    return require.resolve(target, {
      paths: [baseDir],
    });
  }

  return undefined;
}

function getReferences(rx: RegExp, baseDir: string, content: string) {
  const references: Array<ReferenceDeclaration> = [];
  let match: boolean | RegExpExecArray = true;

  while (match) {
    match = rx.exec(content);

    if (match) {
      const fields = match[2];
      const name = match[3];
      const path = normalize(baseDir, name);

      if (path !== undefined) {
        references.push({
          name,
          path,
          fields,
        });
      }
    }
  }

  return references;
}

interface TraverseRoot {
  baseDir: string;
  fileName: string;
  moduleName: string;
  content: string;
}

async function traverseFiles(files: Array<DeclarationFile>, { baseDir, content, fileName, moduleName }: TraverseRoot) {
  const exportRefs = getReferences(exportDeclRx, baseDir, content);
  const importRefs = getReferences(importDeclRx, baseDir, content);

  files.push({
    content: `
// from: ${baseDir}/${fileName}
declare module '${moduleName}' {
  ${content.split('\n').join('\n  ')}}
`,
    path: resolve(baseDir, fileName),
    exports: exportRefs,
    imports: importRefs,
  });

  const references = [...importRefs, ...exportRefs]
    .filter((ref, index, self) => self.findIndex(m => m.path === ref.path) === index)
    .map(async ref => {
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
    });

  const resolvedReferences = await Promise.all(references);
  const childFiles = resolvedReferences.filter(ref => !!ref);
  await Promise.all(childFiles.map(ref => traverseFiles(files, ref)));
}

export async function declarationFlatting(baseDir: string, appName: string, content: string) {
  const allFiles: Array<DeclarationFile> = [];
  await traverseFiles(allFiles, {
    baseDir,
    fileName: 'index.d.ts',
    moduleName: appName,
    content,
  });
  return allFiles.map(file => file.content).join('');
}
