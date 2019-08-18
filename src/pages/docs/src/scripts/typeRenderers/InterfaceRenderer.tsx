import * as React from 'react';
import { TypeLiteralRenderer } from './TypeLiteralRenderer';
import { Details } from './Details';
import { gid } from './utils';
import { TiNode } from './types';

export interface InterfaceRendererProps {
  node: TiNode;
  render(child: TiNode): JSX.Element;
}

export const InterfaceRenderer: React.FC<InterfaceRendererProps> = ({ node, render }) => (
  <Details color="blue" id={gid(node)} kind={node.kindString} description={node.comment} title={node.name}>
    <TypeLiteralRenderer node={node} render={render} />
  </Details>
);
