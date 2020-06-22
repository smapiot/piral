import { ComponentType, FC } from 'react';
import { RemainingArgs, StateDispatcher } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletContainersApi {}

  interface PiralCustomState {
    /**
     * The relevant state for the registered containers.
     */
    containers: Record<string, any>;
  }

  interface PiralCustomActions {
    /**
     * Creates a new local state.
     * @param id The id of the state.
     * @param state The initial state to use.
     */
    createState<TState>(id: string, state: TState): void;
    /**
     * Destroys an existing local state.
     * @param id The id of the state.
     */
    destroyState(id: string): void;
    /**
     * Replaces the local state with the provided state.
     * @param id The id of the local state.
     * @param state The new state to use.
     */
    replaceState<TState>(id: string, reducer: StateDispatcher<TState>): void;
  }
}

export interface PiletContainersApi {
  /**
   * Creates a state container for persisting some global state.
   * @param options The options for creating the state container.
   */
  createState<TState, TActions extends StateContainerReducers<TState>>(
    options: StateContainerOptions<TState, TActions>,
  ): StateContainer<TState, StateContainerActions<TActions>>;
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

export interface StateConnectorProps<TState, TAction> {
  /**
   * The currently available state.
   */
  state: TState;
  /**
   * The actions for changing the state.
   */
  actions: TAction;
}

export type StateContainerActions<TActions> = { [P in keyof TActions]: (...args: RemainingArgs<TActions[P]>) => void };

export interface StateContainer<TState, TActions> {
  /**
   * State container connector function for wrapping a component.
   * @param component The component to connect by providing a state and an action prop.
   */
  <TProps>(component: ComponentType<TProps & StateConnectorProps<TState, TActions>>): FC<TProps>;
}
