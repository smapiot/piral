import * as React from 'react';
import { SignatureRenderer } from './SignatureRenderer';
import { Details } from './Details';
import { gid } from './utils';
import { TiNode, TiKind } from './types';

export interface FunctionRendererProps {
  node: TiNode;
  render(child: TiNode): JSX.Element;
}

export const FunctionRenderer: React.FC<FunctionRendererProps> = ({ node, render }) => (
  <Details
    color="green"
    id={gid(node)}
    kind={node.kindString}
    title={node.name}
    description={node.signatures[0].comment}>
    <ul className="interface-map">
      {node.signatures.map(
        (child) =>
          child.kind === TiKind.CallSignature && (
            <li key={child.id}>
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
  </Details>
);
