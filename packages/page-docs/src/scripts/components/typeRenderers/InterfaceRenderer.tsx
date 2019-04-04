import * as React from 'react';
import { TiNode } from './types';
import { Callout } from '../Callout';
import { gid } from './utils';
import { TypeLiteralRenderer } from './TypeLiteralRenderer';

export interface InterfaceRendererProps {
  node: TiNode;
  render(child: TiNode): JSX.Element;
}

export const InterfaceRenderer: React.SFC<InterfaceRendererProps> = ({ node, render }) => (
  <Callout type="info" title={node.name} icon="puzzle-piece" id={gid(node)}>
    <p>
      <b>{node.kindString}</b>
    </p>
    <p>{node.comment && node.comment.shortText}</p>
    <TypeLiteralRenderer node={node} render={render} />
  </Callout>
);
