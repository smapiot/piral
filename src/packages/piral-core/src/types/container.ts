import { ComponentType } from 'react';
import { StateConnectorProps } from './connector';

export interface ContainerOptions<TState, TAction> {
  /**
   * The initial state value.
   */
  state: TState;
  /**
   * The available actions.
   */
  actions: TAction;
}

export type ContainerActions<TAction> = {
  [P in keyof TAction]: TAction[P] extends (dispatch: any, api: any, ...args: infer T) => infer R
    ? (...args: T) => R
    : never
};

export interface ContainerConnector<TState, TAction> {
  /**
   * Connector function for wrapping a component.
   * @param component The component to connect by providing a state and an action prop.
   */
  <TProps>(component: ComponentType<TProps & StateConnectorProps<TState, ContainerActions<TAction>>>): ComponentType<
    TProps
  >;
  /**
   * Connector function for wrapping a component.
   * The selector will allow renaming the injected prop or sub-selecting values,
   * which are then shallow compared.
   * Rendering takes only place if the selected values changed.
   * @param component The component to connect with a custom prop selection.
   * @param select The selector for the injected props.
   */
  <TProps, TMixin>(
    component: ComponentType<TProps & TMixin>,
    select: (props: StateConnectorProps<TState, ContainerActions<TAction>>) => TMixin,
  ): ComponentType<TProps>;
}
