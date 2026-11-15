import { existsSync, readFileSync, realpathSync, statSync } from 'fs';
import { dirname, join, relative, resolve, sep } from 'path';
import type { SharedDependency } from 'piral-cli';
import type {
  ExportAllDeclaration,
  ExportNamedDeclaration,
  Identifier,
  ImportDeclaration,
  Literal,
  Program,
} from 'acorn';

interface SharedChunkEntry {
  name: string;
  file: string;
}

interface SharedChunkGroup {
  root: string;
  packageName: string;
  entries: Array<SharedChunkEntry>;
}

interface BindingReference {
  file: string;
  name: string;
}

type ModuleDependencyNode = ImportDeclaration | ExportNamedDeclaration | ExportAllDeclaration;

interface ModuleDependency {
  node: ModuleDependencyNode;
  target: string;
  names: Array<string>;
}

interface ModuleInfo {
  file: string;
  ok: boolean;
  deps: Array<ModuleDependency>;
  exports: Record<string, BindingReference>;
  stars: Array<string>;
}

interface SharedChunkRewrite {
  dep: ModuleDependency;
  owner: string;
  mapped: Array<string | undefined>;
}

interface SharedChunkRewrites {
  rewrites: Array<SharedChunkRewrite>;
  problems: Array<string>;
}

interface SharedChunkAnalysis {
  group: SharedChunkGroup;
  enabled: boolean;
  reason?: string;
  owners: Map<string, string>;
  getRewrites(file: string): SharedChunkRewrites;
}

const acorn: typeof import('acorn') = require(
  require.resolve('acorn', { paths: [dirname(require.resolve('webpack/package.json'))] }),
);
const analysisCache = new Map<string, SharedChunkAnalysis>();

function getPackageName(id: string): string {
  const parts = id.split('/');
  return id.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
}

function findPackageRoot(file: string, packageName: string): string | undefined {
  let dir = dirname(file);
  while (dir !== dirname(dir)) {
    const pj = join(dir, 'package.json');
    if (existsSync(pj)) {
      try {
        const { name } = JSON.parse(readFileSync(pj, 'utf8')) as { name?: string };

        if (name === packageName) {
          return dir;
        }
      } catch {
        // ignore invalid package.json files
      }
    }
    dir = dirname(dir);
  }
  return undefined;
}
function safeRealpath(file: string): string {
  try {
    return realpathSync(file);
  } catch {
    return file;
  }
}

/**
 * Groups the local (i.e., bundled by this pilet) importmap entries by their package; only
 * packages exposing more than one shared entry point (or used via a subpath) are relevant.
 */
export function getSharedChunkGroups(importmap: Array<SharedDependency>): Array<SharedChunkGroup> {
  const groups = new Map<string, SharedChunkGroup>();

  for (const dep of importmap) {
    if (dep.type !== 'local' || typeof dep.entry !== 'string' || !/\.m?js$/i.test(dep.entry)) {
      continue;
    }

    const packageName = getPackageName(dep.name);
    const file = safeRealpath(dep.entry);
    const root = findPackageRoot(file, packageName);

    if (root) {
      const group = groups.get(root) || { root, packageName, entries: [] };
      group.entries.push({ name: dep.name, file });
      groups.set(root, group);
    }
  }

  return [...groups.values()];
}

function getName(node: Identifier | Literal): string {
  return node.type === 'Identifier' ? node.name : String(node.value);
}

function isRelative(request: string): boolean {
  return request.startsWith('./') || request.startsWith('../');
}

function getModuleSource(node: Program['body'][number]): string | undefined {
  if (node.type === 'ImportDeclaration' || node.type === 'ExportAllDeclaration') {
    return typeof node.source.value === 'string' ? node.source.value : undefined;
  }

  if (node.type === 'ExportNamedDeclaration' && typeof node.source?.value === 'string') {
    return node.source.value;
  }

  return undefined;
}

function createAnalysis(group: SharedChunkGroup): SharedChunkAnalysis {
  const { root, entries } = group;
  const modules = new Map<string, ModuleInfo>();
  const inPackage = (file: string): boolean => file.startsWith(root + sep);
  const resolveRelative = (from: string, request: string): string => {
    const base = resolve(dirname(from), request);
    const candidates = [
      base,
      ...['.mjs', '.js', '.cjs'].map((ext) => base + ext),
      ...['index.mjs', 'index.js'].map((idx) => join(base, idx)),
    ];
    const found = candidates.find((c) => existsSync(c) && statSync(c).isFile());
    return found ? safeRealpath(found) : base;
  };
  const parseModule = (file: string): ModuleInfo => {
    const cached = modules.get(file);

    if (cached) {
      return cached;
    }

    const info: ModuleInfo = { file, ok: false, deps: [], exports: {}, stars: [] };
    modules.set(file, info);

    try {
      const ast: Program = acorn.parse(readFileSync(file, 'utf8'), {
        ecmaVersion: 'latest',
        sourceType: 'module',
      });

      const locals: Record<string, BindingReference> = {};
      const pending: Array<[string, string]> = [];

      for (const node of ast.body) {
        const source = getModuleSource(node);
        const target = source && isRelative(source) ? resolveRelative(file, source) : undefined;

        if (node.type === 'ImportDeclaration') {
          const names = node.specifiers.map((s) =>
            s.type === 'ImportSpecifier' ? getName(s.imported) : s.type === 'ImportDefaultSpecifier' ? 'default' : '*',
          );
          node.specifiers.forEach((s, i) => (locals[s.local.name] = { file: target || source, name: names[i] }));
          target && info.deps.push({ node, target, names });
        } else if (node.type === 'ExportNamedDeclaration') {
          if (source) {
            const names = node.specifiers.map((s) => getName(s.local));
            node.specifiers.forEach(
              (s, i) => (info.exports[getName(s.exported)] = { file: target || source, name: names[i] }),
            );
            target && info.deps.push({ node, target, names });
          } else if (node.declaration) {
            const decl = node.declaration;
            const ids =
              decl.type === 'VariableDeclaration'
                ? decl.declarations.map((d) => (d.id.type === 'Identifier' ? d.id.name : 'undefined'))
                : [decl.id?.name ?? 'undefined'];
            ids.forEach((id) => (info.exports[id] = { file, name: id }));
          } else {
            node.specifiers.forEach((s) => pending.push([getName(s.exported), getName(s.local)]));
          }
        } else if (node.type === 'ExportDefaultDeclaration') {
          info.exports.default = { file, name: 'default' };
        } else if (node.type === 'ExportAllDeclaration') {
          if (node.exported) {
            info.exports[getName(node.exported)] = { file: target || source, name: '*' };
          } else if (target) {
            info.stars.push(target);
          }

          target && info.deps.push({ node, target, names: ['*'] });
        }
      }

      pending.forEach(([exported, local]) => (info.exports[exported] = locals[local] || { file, name: local }));
      info.ok = true;
    } catch {
      // not an ES module we can analyze - leave it alone
    }

    info.deps.filter((d) => inPackage(d.target)).forEach((d) => parseModule(d.target));
    info.stars.filter(inPackage).forEach(parseModule);
    return info;
  };
  const getExportNames = (file: string, seen = new Set<string>()): Array<string> => {
    const info = parseModule(file);

    if (seen.has(file)) {
      return [];
    }

    seen.add(file);
    const names = new Set(Object.keys(info.exports));
    info.stars.forEach((s) => getExportNames(s, seen).forEach((n) => n !== 'default' && names.add(n)));
    return [...names];
  };

  // resolves the module and binding name that originally declares the given export
  const getOrigin = (file: string, name: string): string => {
    for (let i = 0; i < 100; i++) {
      if (!inPackage(file)) {
        return `${file}#${name}`;
      }

      const info = parseModule(file);
      let next = info.exports[name];

      if (!next && name !== 'default') {
        const star = info.stars.find((s) => getExportNames(s).includes(name));
        next = star && { file: star, name };
      }

      if (!next || (next.file === file && next.name === name) || next.name === '*') {
        return `${file}#${name}`;
      }

      ({ file, name } = next);
    }

    return `${file}#${name}`;
  };
  const getClosure = (file: string, acc = new Set<string>()): Set<string> => {
    if (!acc.has(file) && inPackage(file)) {
      acc.add(file);
      parseModule(file).deps.forEach((d) => getClosure(d.target, acc));
    }

    return acc;
  };

  // the public names under which each original binding is reachable per shared entry
  const exportIndex = new Map<string, Map<string, Array<string>>>();
  const closures = new Map<string, Set<string>>();

  for (const entry of entries) {
    closures.set(entry.name, getClosure(entry.file));
    for (const name of getExportNames(entry.file)) {
      const origin = getOrigin(entry.file, name);
      const byEntry = exportIndex.get(origin) || new Map<string, Array<string>>();
      byEntry.has(entry.name) || byEntry.set(entry.name, []);
      byEntry.get(entry.name).push(name);
      exportIndex.set(origin, byEntry);
    }
  }

  const owners = new Map<string, string>();

  for (const entry of entries) {
    owners.has(entry.file) || owners.set(entry.file, entry.name);
  }

  const allModules = new Set([...closures.values()].flatMap((c) => [...c]));

  for (const file of allModules) {
    if (owners.has(file)) {
      continue;
    }

    const prefix = `${file}#`;
    const score = (entryName: string): number => {
      let count = 0;
      exportIndex.forEach((byEntry, origin) => origin.startsWith(prefix) && byEntry.has(entryName) && count++);
      return count;
    };
    // prefer the entry that publicly exposes most of the module's bindings, then the smallest one
    const candidates = entries
      .filter((e) => closures.get(e.name).has(file))
      .map((e) => ({ name: e.name, score: score(e.name), size: closures.get(e.name).size }))
      .sort((a, b) => b.score - a.score || a.size - b.size || a.name.localeCompare(b.name));
    owners.set(file, candidates[0].name);
  }

  const getPublicName = (target: string, name: string, owner: string): string | undefined => {
    const byEntry = exportIndex.get(getOrigin(target, name));
    const names = byEntry && byEntry.get(owner);
    return names && (names.includes(name) ? name : names[0]);
  };

  // computes the rewrites for the module; a rewrite is only possible if all names are publicly available
  const getRewrites = (file: string): SharedChunkRewrites => {
    const info = parseModule(file);
    const self = owners.get(file);
    const rewrites: Array<SharedChunkRewrite> = [];
    const problems: Array<string> = [];

    if (!info.ok) {
      return { rewrites, problems };
    }

    for (const dep of info.deps) {
      const owner = owners.get(dep.target);

      if (!owner || owner === self) {
        continue;
      }

      const mapped: Array<string | undefined> = dep.names.map((n) =>
        n === '*' ? undefined : getPublicName(dep.target, n, owner),
      );
      const missing = dep.names.filter((_, i) => !mapped[i]);

      if (missing.length) {
        problems.push(
          `"${relative(root, file)}" requires ${missing.join(', ')} from "${relative(root, dep.target)}", which is not exposed by "${owner}"`,
        );
      } else {
        rewrites.push({ dep, owner, mapped });
      }
    }

    return { rewrites, problems };
  };

  // the rewrites must not introduce cycles between the shared entries (SystemJS modules)
  const edges = new Map<string, Set<string>>();

  for (const file of allModules) {
    const from = owners.get(file);

    for (const { owner } of getRewrites(file).rewrites) {
      edges.has(from) || edges.set(from, new Set());
      edges.get(from).add(owner);
    }
  }

  const hasCycle = (() => {
    const state = new Map<string, number>();
    const visit = (n: string): boolean => {
      if (state.get(n) === 1) {
        return true;
      }

      if (state.get(n) === 2) {
        return false;
      }

      state.set(n, 1);
      const cyclic = [...(edges.get(n) || [])].some(visit);
      state.set(n, 2);
      return cyclic;
    };
    return [...edges.keys()].some(visit);
  })();

  return {
    group,
    enabled: !hasCycle,
    reason: hasCycle
      ? `Sharing the private modules of "${group.packageName}" would introduce cyclic shared dependencies.`
      : undefined,
    owners,
    getRewrites,
  };
}

export function getSharedChunkAnalysis(group: SharedChunkGroup): SharedChunkAnalysis {
  const key = `${group.root}|${group.entries.map((e) => `${e.name}=${e.file}`).join(',')}`;

  if (!analysisCache.has(key)) {
    analysisCache.set(key, createAnalysis(group));
  }

  return analysisCache.get(key)!;
}
