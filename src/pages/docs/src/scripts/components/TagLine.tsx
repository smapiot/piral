import * as React from 'react';

export interface TagLineProps {
  version?: string;
}

export const TagLine: React.SFC<TagLineProps> = ({ version }) => (
  <div className="tagline">
    <p>Easily build a next generation portal application</p>
    <div className="meta">
      {version && (
        <>
          <i className="fas fa-code-branch" /> v{version}{' '}
        </>
      )}
    </div>
  </div>
);
