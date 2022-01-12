import type { SharedDependency } from 'piral-cli';
import type { PluginObj } from '@babel/core';

export interface PluginOptions {
  importmap: Array<SharedDependency>;
}

export default function babelPlugin({ types }): PluginObj {
  return {
    visitor: {
      ImportDeclaration(path, state) {
        const { importmap } = state.opts as PluginOptions;

        path.traverse({
          Literal(path) {
            if (path.node.type === 'StringLiteral') {
              const name = path.node.value;
              const entry = importmap.find((m) => m.name === name);

              if (entry) {
                path.replaceWith(types.stringLiteral(entry.id));
              }
            }
          },
        });
      },
    },
  };
}
