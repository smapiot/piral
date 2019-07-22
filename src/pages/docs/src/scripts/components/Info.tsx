import * as React from 'react';
import { IconName } from './utils';
import { Icon } from './Icon';

export interface InfoProps {
  title?: string;
  updated?: string;
  icon?: IconName;
  version?: string;
}

export const Info: React.FC<InfoProps> = ({ version, updated, title, icon = 'paper-plane' }) => (
  <div id="doc-header" className="doc-header text-center">
    {title && (
      <h1 className="doc-title">
        <Icon content={icon} /> {title}
      </h1>
    )}
    <div className="meta">
      {version && (
        <>
          <i className="fas fa-code-branch" /> v{version}{' '}
        </>
      )}
      {updated && (
        <>
          <i className="far fa-clock" /> Last updated: {updated}
        </>
      )}
    </div>
  </div>
);
