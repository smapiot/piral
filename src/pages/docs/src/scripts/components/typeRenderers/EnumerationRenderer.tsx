import * as React from 'react';
import { TiNode, TiKind } from './types';
import { Callout } from '../Callout';

export interface EnumerationRendererProps {
  node: TiNode;
  render(child: TiNode): JSX.Element;
}

export const EnumerationRenderer: React.SFC<EnumerationRendererProps> = ({ node }) => (
  <Callout type="success" title={node.name} icon="puzzle-piece">
    <p>
      <b>{node.kindString}</b>
    </p>
    <p>{node.comment && node.comment.shortText}</p>
    <ul className="interface-map">
      {node.children.map(
        child =>
          child.kind === TiKind.EnumerationMember && (
            <li key={child.id}>
              {child.comment && child.comment.shortText}
              <span className="block">
                <code>
                  {child.name} = {child.defaultValue}
                </code>
              </span>
            </li>
          ),
      )}
    </ul>
  </Callout>
);
