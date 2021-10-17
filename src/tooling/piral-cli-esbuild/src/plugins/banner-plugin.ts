import type { NodePath, PluginObj } from '@babel/core';

export default function babelPlugin(): PluginObj {
  return {
    visitor: {
      Program(path: NodePath) {
        const deps = process.env.IMPORT_DEPS || '{}';
        const requireRef = `esbuildpr_${process.env.BUILD_PCKG_NAME.replace(/\W/gi, '')}`;
        path.addComment('leading', `@pilet v:2(${requireRef},${deps})`, true);
      },
    },
  };
}
