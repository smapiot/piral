import * as React from 'react';
import { Callout } from './Callout';

const enum TiKind {
  Root = 0,
  ExternalModule = 1,
  Enumeration = 4,
  EnumerationMember = 16,
  Variable = 32,
  Function = 64,
  Interface = 256,
  Property = 1024,
  Method = 2048,
  CallSignature = 4096,
  IndexSignature = 8192,
  Parameter = 32768,
  TypeLiteral = 65536,
  ObjectLiteral = 2097152,
  TypeAlias = 4194304,
}

type TiId = number;

export interface TiType {
  type: string;
  id?: TiId;
  name?: string;
  types?: Array<TiType>;
  typeArguments?: Array<TiType>;
  declaration?: TiNode;
}

export interface TiNode {
  id: TiId;
  name: string;
  kind: TiKind;
  kindString?: string;
  sources?: Array<{
    fileName: string;
    line: number;
    character: number;
  }>;
  children: Array<TiNode>;
  flags: {
    isExported?: boolean;
    isOptional?: boolean;
    isConst?: boolean;
  };
  signatures?: Array<TiNode>;
  typeParameter?: Array<TiNode>;
  type?: TiType;
  parameters?: Array<TiNode>;
  comment?: {
    shortText: string;
    tags?: Array<{
      tag: string;
      text: string;
    }>;
  };
  groups?: Array<{
    title: string;
    kind: TiKind;
    children: Array<TiId>;
  }>;
}

export interface TiProps {
  children: TiNode;
}

function render(node: TiNode) {
  switch (node.kind) {
    case TiKind.Root:
    case TiKind.ExternalModule:
      return (
        <>
          {(node.children || []).map(child => (
            <div key={child.id}>{render(child)}</div>
          ))}
        </>
      );
    case TiKind.Interface:
      return (
        <Callout type="info" title={node.kindString} icon="puzzle-piece">
          {node.name}
        </Callout>
      );
    case TiKind.Function:
      return (
        <Callout type="success" title={node.kindString} icon="puzzle-piece">
          {node.name}
        </Callout>
      );
    case TiKind.ObjectLiteral:
      return (
        <Callout type="danger" title={node.kindString} icon="puzzle-piece">
          {node.name}
        </Callout>
      );
    case TiKind.Variable:
      return (
        <Callout type="warning" title={node.kindString} icon="puzzle-piece">
          {node.name}
        </Callout>
      );
    case TiKind.TypeAlias:
      return (
        <Callout type="info" title={node.kindString} icon="puzzle-piece">
          {node.name}
        </Callout>
      );
    case TiKind.Enumeration:
      return (
        <Callout type="success" title={node.kindString} icon="puzzle-piece">
          {node.name}
        </Callout>
      );
    default:
      return <span>{node.name}</span>;
  }
}

export const Ti: React.SFC<TiProps> = ({ children }) => {
  return render(children);
};
