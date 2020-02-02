import { resolve } from 'path';
import {
  Node,
  Declaration,
  ModifierFlags,
  getCombinedModifierFlags,
  SyntaxKind,
  BigIntLiteralType,
  ObjectType,
  IndexedAccessType,
  Identifier,
  IndexInfo,
  Type,
  TypeFlags,
  ObjectFlags,
  TypeReference,
  Symbol,
} from 'typescript';

const globalIndicator = '__global';
const modulesRoot = '/node_modules/';
const typesRoot = '/node_modules/@types/';
const tslibRoot = '/node_modules/typescript/lib';
const piralCoreRoot = 'piral-core/lib/types/api';

// note that a valid identifier is more complicated than this,
// but let's keep it simple, which should be sufficient for most cases
const isIdentifier = /^[a-zA-Z\_\$][a-zA-Z0-9\_\$]*$/;

export function makeIdentifier(identifier: string) {
  return isIdentifier.test(identifier) ? identifier : JSON.stringify(identifier);
}

export function isGlobal(symbol: Symbol) {
  const parent = symbol?.parent;

  if (parent) {
    if (parent.name === globalIndicator) {
      return true;
    }

    return isGlobal(parent);
  }

  return false;
}

export function getGlobalName(symbol: Symbol) {
  const { parent, name } = symbol;

  if (parent.name !== globalIndicator) {
    return `${getGlobalName(parent)}.${name}`;
  }

  return name;
}

export function isNodeExported(node: Node, alsoTopLevel = false): boolean {
  return (
    (getCombinedModifierFlags(node as Declaration) & ModifierFlags.Export) !== 0 ||
    (alsoTopLevel && !!node.parent && node.parent.kind === SyntaxKind.SourceFile)
  );
}

export function findDeclaredTypings(root: string) {
  try {
    const { typings } = require(resolve(root, 'package.json'));
    return typings && resolve(root, typings);
  } catch {
    return undefined;
  }
}

export function findPiralCoreApi(root: string) {
  try {
    return require
      .resolve(piralCoreRoot, {
        paths: [root],
      })
      ?.replace(/\.js$/, '.d.ts');
  } catch {
    return undefined;
  }
}

export function getLibName(fileName: string) {
  if (fileName) {
    if (fileName.indexOf(typesRoot) !== -1) {
      const start = fileName.lastIndexOf(typesRoot) + typesRoot.length;
      const name = fileName
        .substr(start)
        .split('/')
        .shift();

      if (name.indexOf('__') !== -1) {
        const [scope, lib] = name.split('__');
        return `@${scope}/${lib}`;
      }

      return name;
    } else if (fileName.indexOf(modulesRoot) !== -1) {
      const start = fileName.lastIndexOf(modulesRoot) + modulesRoot.length;
      const [scope, lib] = fileName.substr(start).split('/');

      if (scope.indexOf('@') === 0) {
        return `${scope}/${lib}`;
      }

      return scope;
    }
  }

  return undefined;
}

export function getRefName(libName: string) {
  if (libName[0] === '@') {
    libName = libName.substr(1);
  }

  const parts = libName.split(/[\/\-]/g);
  return parts.map(p => p[0].toUpperCase() + p.substr(1)).join('');
}

export function getLib(fileName: string, imports: Array<string>) {
  const libName = getLibName(fileName);

  if (libName && imports.includes(libName)) {
    return libName;
  }

  return undefined;
}

export function getKeyName(info: IndexInfo) {
  return (<Identifier>info?.declaration?.parameters?.[0].name)?.text ?? 'index';
}

export function isBigIntLiteral(type: Type): type is BigIntLiteralType {
  return !!(type.flags & TypeFlags.BigIntLiteral);
}

export function isObjectType(type: Type): type is ObjectType {
  return !!(type.flags & TypeFlags.Object);
}

export function isAnonymousObject(type: Type) {
  return isObjectType(type) && !!(type.objectFlags & ObjectFlags.Anonymous);
}

export function isReferenceType(type: ObjectType): type is TypeReference {
  return !!(type.objectFlags & ObjectFlags.Reference);
}

export function isTypeParameter(type: Type) {
  return !!(type.flags & TypeFlags.TypeParameter);
}

export function isIndexType(type: Type): type is IndexedAccessType {
  return !!(type.flags & TypeFlags.IndexedAccess);
}

export function isBaseLib(path: string) {
  if (path) {
    const parts = path.split('/');
    parts.pop();
    const newPath = parts.join('/');
    return newPath.endsWith(tslibRoot);
  }

  return false;
}
