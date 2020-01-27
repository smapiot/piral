import * as ts from 'typescript';
import { resolve } from 'path';
import { includeType } from './visit';
import { TypeRefs } from './types';
import { stringify } from './stringify';
import { getRefName } from './helpers';

export function generateDeclaration(
  name: string,
  root: string,
  entryFiles: Array<string>,
  allowedImports: Array<string> = [],
) {
  const program = ts.createProgram(entryFiles, {});
  const checker = program.getTypeChecker();
  const refs: TypeRefs = {};

  const visit = (node: ts.Node) => {
    if (ts.isInterfaceDeclaration(node) && node.name.text === 'PiletApi') {
      const type = checker.getTypeAtLocation(node);
      includeType(checker, type, refs, allowedImports);
    }
  };

  const sf = program.getSourceFile(resolve(root, 'node_modules/piral-core/lib/types/api.d.ts'));
  ts.forEachChild(sf, visit);
  //TODO also include typings from package.json
  const content = stringify(refs);
  const imports = allowedImports.map(lib => `import * as ${getRefName(lib)} from '${lib}';`).join('\n');
  return `${imports}\n\ndeclare module "${name}" {\n${content.split('\n').join('\n  ')}\n}`;
}
