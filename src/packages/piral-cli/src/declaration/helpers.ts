import {
  Node,
  Declaration,
  ModifierFlags,
  getCombinedModifierFlags,
  SyntaxKind
} from "typescript";

export function isNodeExported(node: Node, alsoTopLevel = false): boolean {
  return (
    (getCombinedModifierFlags(node as Declaration) & ModifierFlags.Export) !==
      0 ||
    (alsoTopLevel &&
      !!node.parent && node.parent.kind === SyntaxKind.SourceFile)
  );
}
