import * as React from 'react';
import { useGlobalState } from '../hooks';
import { defaultRender, none } from '../utils';

export interface PortalRendererProps {
  id: string;
}

export const PortalRenderer: React.FC<PortalRendererProps> = ({ id }) => {
  const children = useGlobalState((m) => m.portals[id]) || none;
  return defaultRender(children);
};
