import * as React from 'react';
import { IconName } from './utils';
import { Icon } from './Icon';

export interface InfoProps {
  title?: string;
  updated?: string;
  icon?: IconName | React.ReactElement;
}

export const Info: React.SFC<InfoProps> = ({ updated, title, icon = 'paper-plane' }) => (
  <div id="doc-header" className="doc-header text-center">
    {title && (
      <h1 className="doc-title">
        <Icon content={icon} /> {title}
      </h1>
    )}
    <div className="meta">
      {updated && (
        <>
          <i className="far fa-clock" /> Last updated: {updated}
        </>
      )}
    </div>
  </div>
);
