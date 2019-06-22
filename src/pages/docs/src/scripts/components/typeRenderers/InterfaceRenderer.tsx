import * as React from 'react';
import { TypeLiteralRenderer } from './TypeLiteralRenderer';
import { gid } from './utils';
import { TiNode } from './types';
import { Details } from './Details';

export interface InterfaceRendererProps {
  node: TiNode;
  render(child: TiNode): JSX.Element;
}

export const InterfaceRenderer: React.SFC<InterfaceRendererProps> = ({ node, render }) => (
  <Details
    color="blue"
    id={gid(node)}
    title={
      <>
        <b>{node.kindString}</b>
        <h3>{node.name}</h3>
        <p>{node.comment && node.comment.shortText}</p>
      </>
    }
    details={<TypeLiteralRenderer node={node} render={render} />}
  />
);
