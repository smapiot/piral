import * as React from 'react';
import { TiNode, TiKind } from './types';
import { Callout } from '../Callout';
import { gid } from './utils';
import { SignatureRenderer } from './SignatureRenderer';

export interface FunctionRendererProps {
  node: TiNode;
  render(child: TiNode): JSX.Element;
}

export const FunctionRenderer: React.SFC<FunctionRendererProps> = ({ node, render }) => (
  <Callout type="success" title={node.name} icon="puzzle-piece" id={gid(node)}>
    <p>
      <b>{node.kindString}</b>
    </p>
    <ul className="interface-map">
      {node.signatures.map(
        child =>
          child.kind === TiKind.CallSignature && (
            <li key={child.id}>
              {child.comment && child.comment.shortText}
              <span className="block">
                <code>
                  {child.name}
                  <SignatureRenderer node={child} render={render} />
                </code>
              </span>
            </li>
          ),
      )}
    </ul>
  </Callout>
);
