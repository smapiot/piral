import * as React from 'react';
import { Details } from './Details';
import { TiNode, TiKind } from './types';

export interface EnumerationRendererProps {
  node: TiNode;
  render(child: TiNode): JSX.Element;
}

export const EnumerationRenderer: React.FC<EnumerationRendererProps> = ({ node }) => (
  <Details color="orange" description={node.comment} kind={node.kindString} title={node.name}>
    <ul className="interface-map">
      {node.children.map(
        (child) =>
          child.kind === TiKind.EnumerationMember && (
            <li key={child.id}>
              {child.comment && child.comment.shortText}
              <span className="block">
                {child.defaultValue ? (
                  <code>
                    {child.name} = {child.defaultValue}
                  </code>
                ) : (
                  <code>{child.name}</code>
                )}
              </span>
            </li>
          ),
      )}
    </ul>
  </Details>
);
