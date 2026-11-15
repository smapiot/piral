import { readFileSync } from 'fs';
import type { Identifier, Literal } from 'acorn';

import { getSharedChunkAnalysis, type getSharedChunkGroups } from './SharedChunks';

type SharedChunkGroup = ReturnType<typeof getSharedChunkGroups>[number];
type SharedChunkRewrite = ReturnType<ReturnType<typeof getSharedChunkAnalysis>['getRewrites']>['rewrites'][number];

interface SharedChunksLoaderContext {
  getOptions(): { groups?: Array<SharedChunkGroup> } | undefined;
  resourcePath: string;
  emitWarning(warning: Error): void;
  callback(error: Error | null, content: string, sourceMap?: unknown): void;
}

const warned = new Set<string>();

function binding(publicName: string | undefined, localName: string | undefined): string | undefined {
  return publicName === localName ? publicName : `${publicName} as ${localName}`;
}

function getLocalName(specifier: Identifier | Literal): string | undefined {
  return specifier.type === 'Identifier' ? specifier.name : JSON.stringify(specifier.value);
}

function render({ dep, owner, mapped }: SharedChunkRewrite): string {
  const { node } = dep;
  const request = JSON.stringify(owner);

  if (node.type === 'ImportDeclaration') {
    if (node.specifiers.length === 0) {
      return `import ${request};`;
    }

    const specs = node.specifiers.map((s, i) => binding(mapped[i], s.local.name));
    return `import { ${specs.join(', ')} } from ${request};`;
  }

  if (node.type === 'ExportAllDeclaration') {
    return `export * from ${request};`;
  }

  const specs = node.specifiers.map((s, i) => binding(mapped[i], getLocalName(s.exported)));
  return `export { ${specs.join(', ')} } from ${request};`;
}

/**
 * Rewrites relative imports of private modules (chunks) that are owned by another
 * shared entry point of the same package to go through that entry point instead.
 */
export default function SharedChunksLoader(this: SharedChunksLoaderContext, source: string, map?: unknown): void {
  const { groups = [] } = this.getOptions() || {};
  const file = this.resourcePath;
  const group = groups.find((g) => file.startsWith(g.root));

  if (group) {
    const analysis = getSharedChunkAnalysis(group);

    if (analysis.enabled) {
      const { rewrites, problems } = analysis.getRewrites(file);
      problems.forEach((p) => this.emitWarning(new Error(`Cannot share private module: ${p}. It will be duplicated.`)));

      if (rewrites.length > 0) {
        // the analysis parsed the same file from disk; make sure we see the same content
        const original = readFileSync(file, 'utf8');

        if (original === source) {
          let result = source;

          for (const rewrite of [...rewrites].sort((a, b) => b.dep.node.start - a.dep.node.start)) {
            const { start, end } = rewrite.dep.node;
            result = result.slice(0, start) + render(rewrite) + result.slice(end);
          }

          return this.callback(null, result, map);
        }
      }
    } else if (!warned.has(analysis.reason)) {
      warned.add(analysis.reason);
      this.emitWarning(new Error(analysis.reason));
    }
  }

  this.callback(null, source, map);
}
