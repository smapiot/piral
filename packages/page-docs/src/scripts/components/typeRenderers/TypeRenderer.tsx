import * as React from 'react';
import { TiType, TiNode, TiKind } from './types';
import { withSep, gref, keyOf } from './utils';

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

export const TypeArgumentRenderer: React.SFC<TypeArgumentRendererProps> = ({ args, render }) =>
  (args && (
    <span>&lt;{withSep(args.map(ta => <TypeRenderer key={keyOf(ta)} render={render} node={ta} />), ', ')}&gt;</span>
  )) ||
  defaultResult;

export const TypeParameterRenderer: React.SFC<TypeParameterRendererProps> = ({ args, render }) => (
  <TypeArgumentRenderer render={render} args={args && args.map(convertParamToArg)} />
);

export const TypeRenderer: React.SFC<TypeRendererProps> = ({ node, render }) => {
  switch (node.type) {
    case 'union':
      return <>{withSep(node.types.map(t => <TypeRenderer render={render} node={t} key={keyOf(t)} />), ' | ')}</>;
    case 'stringLiteral':
      return <span>"{node.value}"</span>;
    case 'reference':
      return (
        <>
          <a href={gref(node.id)} className="ref">
            {node.name}
          </a>
          {<TypeArgumentRenderer render={render} args={node.typeArguments} />}
        </>
      );
    case 'reflection':
      return render(node.declaration);
    case 'unknown':
    case 'typeParameter':
    case 'intrinsic':
      return <span>{node.name}</span>;
    default:
      return (
        <span>
          <i>unknown</i>
        </span>
      );
  }
};
