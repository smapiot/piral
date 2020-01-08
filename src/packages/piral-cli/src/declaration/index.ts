import * as ts from 'typescript';
import { resolve } from 'path';
import { includeType } from './visit';
import { TypeRefs } from './types';
import { stringify } from './stringify';

export function generateDeclaration(root: string, entryFile: string) {
  const program = ts.createProgram([resolve(root, entryFile)], {});
  const checker = program.getTypeChecker();
  const refs: TypeRefs = {};

  const visit = (node: ts.Node) => {
    if (ts.isInterfaceDeclaration(node) && node.name.text === 'PiletApi') {
      const type = checker.getTypeAtLocation(node);
      includeType(checker, type, refs);
    }
  };

  const sf = program.getSourceFile(resolve(root, 'node_modules/piral-core/lib/types/api.d.ts'));
  ts.forEachChild(sf, visit);
  return stringify(refs);
}
