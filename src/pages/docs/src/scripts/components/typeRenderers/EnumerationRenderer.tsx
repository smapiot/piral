import * as React from 'react';
import { TiNode, TiKind } from './types';
import { Details } from './Details';

export interface EnumerationRendererProps {
  node: TiNode;
  render(child: TiNode): JSX.Element;
}

export const EnumerationRenderer: React.SFC<EnumerationRendererProps> = ({ node }) => (
  <Details
    color="orange"
    title={
      <>
        <b>{node.kindString}</b>
        <h3>{node.name}</h3>
        <p>{node.comment && node.comment.shortText}</p>
      </>
    }
    details={
      <ul className="interface-map">
        {node.children.map(
          child =>
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
    }
  />
);
