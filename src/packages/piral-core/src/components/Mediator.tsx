import * as React from 'react';
import { RecallProps } from 'react-arbiter';
import { useAction } from '../hooks';
import { defaultRender } from '../utils';

export interface MediatorProps extends RecallProps {}

export const Mediator: React.FC<MediatorProps> = ({ loaded, modules, error, children }) => {
  const initialize = useAction('initialize');
  React.useEffect(() => initialize(!loaded, error, modules), [loaded, modules, error]);
  return defaultRender(children);
};
