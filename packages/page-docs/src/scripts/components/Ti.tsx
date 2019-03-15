import * as React from 'react';
import {
  TiNode,
  TiKind,
  InterfaceRenderer,
  ModuleRenderer,
  EnumerationRenderer,
  TypeAliasRenderer,
  ObjectLiteralRenderer,
  VariableRenderer,
  FunctionRenderer,
} from './typeRenderers';

export interface TiProps {
  children: TiNode;
}

function render(node: TiNode) {
  switch (node.kind) {
    case TiKind.Root:
    case TiKind.ExternalModule:
      return <ModuleRenderer node={node} render={render} />;
    case TiKind.Interface:
      return <InterfaceRenderer node={node} />;
    case TiKind.Function:
      return <FunctionRenderer node={node} />;
    case TiKind.ObjectLiteral:
      return <ObjectLiteralRenderer node={node} />;
    case TiKind.Variable:
      return <VariableRenderer node={node} />;
    case TiKind.TypeAlias:
      return <TypeAliasRenderer node={node} />;
    case TiKind.Enumeration:
      return <EnumerationRenderer node={node} />;
    default:
      return <span>{node.name}</span>;
  }
}

export const Ti: React.SFC<TiProps> = ({ children }) => {
  return render(children);
};
