import * as React from 'react';
import { SignatureRenderer } from './SignatureRenderer';
import { gid } from './utils';
import { TiNode, TiKind } from './types';
import { Details } from './Details';

export interface FunctionRendererProps {
  node: TiNode;
  render(child: TiNode): JSX.Element;
}

export const FunctionRenderer: React.SFC<FunctionRendererProps> = ({ node, render }) => (
  <Details
    color="green"
    id={gid(node)}
    title={
      <>
        <b>{node.kindString}</b>
        <h3>{node.name}</h3>
      </>
    }
    details={
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
    }
  />
);
