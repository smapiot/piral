import * as React from 'react';
import { TiNode, TiKind } from './types';
import { Callout } from '../Callout';
import { gid } from './utils';

export interface FunctionRendererProps {
  node: TiNode;
}

export const FunctionRenderer: React.SFC<FunctionRendererProps> = ({ node }) => (
  <Callout type="success" title={node.name} icon="puzzle-piece" id={gid(node)}>
    <p>
      <b>{node.kindString}</b>
    </p>
    {node.signatures.map(
      child =>
        child.kind === TiKind.CallSignature && (
          <div key={child.id}>
            <p>{child.comment && child.comment.shortText}</p>
            <p>
              <code>
                {child.name}({(child.parameters || []).map(p => `${p.name}: ${p.type.name || 'any'}`).join(', ')})
              </code>
            </p>
          </div>
        ),
    )}
  </Callout>
);
