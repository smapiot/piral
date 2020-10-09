import * as React from 'react';
import { withSep, gref, keyOf } from './utils';
import { TiType, TiNode, TiKind } from './types';

export interface TypeRendererProps {
  node: TiType;
  render(child: TiNode): JSX.Element;
}

export interface TypeArgumentRendererProps {
  args?: Array<TiType>;
  render(child: TiNode): JSX.Element;
}

export interface TypeParameterRendererProps {
  args?: Array<TiNode>;
  render(child: TiNode): JSX.Element;
}

// tslint:disable-next-line
const defaultResult = null;

function convertParamToArg(param: TiNode): TiType {
  switch (param.kind) {
    case TiKind.TypeParameter:
      return {
        type: 'typeParameter',
        name: param.name,
      };
    default:
      return {
        type: 'unknown',
        name: param.name,
      };
  }
}

export const TypeArgumentRenderer: React.FC<TypeArgumentRendererProps> = ({ args, render }) =>
  (args && (
    <span>
      &lt;
      {withSep(
        args.map((ta) => <TypeRenderer key={keyOf(ta)} render={render} node={ta} />),
        ', ',
      )}
      &gt;
    </span>
  )) ||
  defaultResult;

export const TypeParameterRenderer: React.FC<TypeParameterRendererProps> = ({ args, render }) => (
  <TypeArgumentRenderer render={render} args={args && args.map(convertParamToArg)} />
);

export const TypeRenderer: React.FC<TypeRendererProps> = ({ node, render }) => {
  switch (node && node.type) {
    case 'intersection':
      return (
        <>
          {withSep(
            (node.types || []).map((t) => <TypeRenderer render={render} node={t} key={keyOf(t)} />),
            ' & ',
          )}
        </>
      );
    case 'union':
      return (
        <>
          {withSep(
            (node.types || []).map((t) => <TypeRenderer render={render} node={t} key={keyOf(t)} />),
            ' | ',
          )}
        </>
      );
    case 'stringLiteral':
      return <span>"{node.value}"</span>;
    case 'reference':
      return (
        <>
          <a href={gref(node)} className="ref">
            {node.name}
          </a>
          {<TypeArgumentRenderer render={render} args={node.typeArguments} />}
        </>
      );
    case 'reflection':
      return node.declaration ? render(node.declaration) : <span>any</span>;
    case 'unknown':
    case 'typeParameter':
    case 'intrinsic':
      return <span>{node.name}</span>;
    case 'tuple':
      return (
        <span>
          [
          {withSep(
            (node.elements || []).map((t) => <TypeRenderer render={render} node={t} key={keyOf(t)} />),
            ', ',
          )}
          ]
        </span>
      );
    default:
      return (
        <span>
          <i>unknown</i>
        </span>
      );
  }
};
