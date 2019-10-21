import * as React from 'react';
import { useGlobalState } from 'piral-core';
import { StateConnectorProps } from './types';

export function withPiletState<TState, TAction, TProps>(
  Component: React.ComponentType<TProps & StateConnectorProps<TState, TAction>>,
  id: string,
  actions: TAction,
) {
  const StateView: React.FC<TProps> = props => {
    const state = useGlobalState(s => s.containers[id]);
    return <Component state={state} actions={actions} {...props} />;
  };
  StateView.displayName = `StateView_${id}`;

  return StateView;
}
