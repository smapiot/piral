import * as React from 'react';
import {
  TiNode,
  TiKind,
  InterfaceRenderer,
  ModuleRenderer,
  EnumerationRenderer,
  TypeAliasRenderer,
  TypeLiteralRenderer,
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
    case TiKind.Class:
    case TiKind.Interface:
      return node.comment && <InterfaceRenderer node={node} render={render} /> || null;
    case TiKind.Function:
      return node.signatures && node.signatures[0].comment && <FunctionRenderer node={node} render={render} /> || null;
    case TiKind.ObjectLiteral:
      return node.comment && <ObjectLiteralRenderer node={node} render={render} /> || null;
    case TiKind.Variable:
      return node.comment && <VariableRenderer node={node} render={render} /> || null;
    case TiKind.TypeLiteral:
      return node.comment && <TypeLiteralRenderer node={node} render={render} /> || null;
    case TiKind.TypeAlias:
      return node.comment && <TypeAliasRenderer node={node} render={render} /> || null;
    case TiKind.Enumeration:
      return node.comment && <EnumerationRenderer node={node} render={render} /> || null;
    default:
      return node.comment && <span>{node.name}</span> || null;
  }
}

export const Ti: React.SFC<TiProps> = ({ children }) => render(children);
