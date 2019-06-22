import * as React from 'react';
import { TiNode, TiKind } from './types';
import { Details } from './Details';

export interface ObjectLiteralRendererProps {
  node: TiNode;
  render(child: TiNode): JSX.Element;
}

export const ObjectLiteralRenderer: React.SFC<ObjectLiteralRendererProps> = ({ node }) => (
  <Details
    color="red"
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
            child.kind === TiKind.Variable && (
              <li key={child.id}>
                <code>
                  {child.name}: {child.defaultValue}
                </code>
              </li>
            ),
        )}
      </ul>
    }
  />
);
