import * as React from 'react';

export interface TagLineProps {
  version?: string;
}

export const TagLine: React.FC<TagLineProps> = ({ version }) => (
  <div className="tagline">
    <p>easily build a next generation portal application</p>
    <div className="meta">
      {version && (
        <>
          <i className="fas fa-code-branch" /> v{version}{' '}
        </>
      )}
    </div>
  </div>
);
