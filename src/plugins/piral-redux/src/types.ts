import 'piral-core';
import { Store, Action, Reducer, Dispatch, AnyAction } from 'redux';
import { ComponentType, FC } from 'react';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletReduxApi {}
}

export interface ReduxStoreConnector {
  <TProps extends ReduxConnectorComponentProps>(component: ComponentType<TProps>): FC<
    Omit<TProps, keyof ReduxConnectorComponentProps>
  >;
}

export interface ReduxConnectorComponentProps<T = any, A extends Action = AnyAction> {
  state: T;
  dispatch?: Dispatch<A>;
}

export interface PiletReduxApi {
  createReduxStore(reducer: Reducer<any>): ReduxStoreConnector;
}

export interface PiralReduxCustomState {}

export interface PiralReduxCustomActions {}

export interface PiralReduxState extends PiralReduxCustomState {
  stores: {
    [pilet: string]: any;
  };
}

export interface PiralReduxActions extends PiralReduxCustomActions {
  create: {
    type: 'create-store';
    name: string;
    value: any;
  };
  destroy: {
    type: 'destroy-store';
    name: string;
  };
  change: {
    type: 'change-store';
    name: string;
    action: any;
  };
}

export type ReducerUnion<T> = {
  [P in keyof T]: T[P] extends Action<any> ? T[P] : never;
}[keyof T];

export type PiralReduxStore = Store<PiralReduxState, ReducerUnion<PiralReduxActions>>;
