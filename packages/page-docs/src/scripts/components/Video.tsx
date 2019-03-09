import * as React from 'react';
import { cn } from './utils';

export interface VideoProps {
  format?: '16by9' | '4by3';
  url: string;
}

export const Video: React.SFC<VideoProps> = ({ format = '16by9', url }) => (
  <div className={cn('embed-responsive', `embed-responsive-${format}`)}>
    <iframe className="embed-responsive-item" src={url} frameBorder="0" allowFullScreen />
  </div>
);
