import * as React from 'react';
import { TiNode, TiKind } from './types';
import { Callout } from '../Callout';

export interface EnumerationRendererProps {
  node: TiNode;
}

export const EnumerationRenderer: React.SFC<EnumerationRendererProps> = ({ node }) => (
  <Callout type="success" title={node.name} icon="puzzle-piece">
    <p>
      <b>{node.kindString}</b>
    </p>
    {node.children.map(
      child =>
        child.kind === TiKind.EnumerationMember && (
          <p key={child.id}>
            <code>
              {child.name} = {child.defaultValue}
            </code>{' '}
            ({child.comment && child.comment.shortText})
          </p>
        ),
    )}
  </Callout>
);
