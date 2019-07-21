import { ComponentType } from 'react';
import { StateConnectorProps } from './connector';
import { RemainingArgs } from './common';

export interface StateDispatcher<TState> {
  (state: TState): Partial<TState>;
}

export interface StateContainerReducer<TState> {
  (dispatch: StateDispatcher<TState>): void;
}

export type StateContainerReducers<TState> = {
  [name: string]: (dispatch: StateContainerReducer<TState>, ...args: any) => void;
};

export interface StateContainerOptions<TState, TActions extends StateContainerReducers<TState>> {
  /**
   * The initial state value.
   */
  state: TState;
  /**
   * The available actions.
   */
  actions: TActions;
}

export type StateContainerActions<TActions> = { [P in keyof TActions]: (...args: RemainingArgs<TActions[P]>) => void };

export interface StateContainer<TState, TActions> {
  /**
   * State container connector function for wrapping a component.
   * @param component The component to connect by providing a state and an action prop.
   */
  <TProps>(component: ComponentType<TProps & StateConnectorProps<TState, TActions>>): ComponentType<TProps>;
}
