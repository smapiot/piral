import * as ts from 'typescript';
import { resolve } from 'path';
import { includeType } from './visit';
import { TypeRefs } from './types';
import { stringify } from './stringify';

export function generateDeclaration(root: string, entryFiles: Array<string>, allowedImports: Array<string> = []) {
  const program = ts.createProgram(entryFiles, {});
  const checker = program.getTypeChecker();
  const refs: TypeRefs = {};
  //TODO map dependency name to module / type root
  const imports = allowedImports.map(m => m);

  const visit = (node: ts.Node) => {
    if (ts.isInterfaceDeclaration(node) && node.name.text === 'PiletApi') {
      const type = checker.getTypeAtLocation(node);
      includeType(checker, type, refs, imports);
    }
  };

  const sf = program.getSourceFile(resolve(root, 'node_modules/piral-core/lib/types/api.d.ts'));
  ts.forEachChild(sf, visit);
  //TODO also include typings from package.json
  return stringify(refs);
}
