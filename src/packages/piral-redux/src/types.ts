import 'piral-core';
import { Store, Action, Reducer } from 'redux';
import { ComponentType } from 'react';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletReduxApi {}
}

export interface ReduxStoreConnector {
  <TProps extends { data: any }>(component: ComponentType<TProps>): ComponentType<Omit<TProps, 'data'>>;
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
  };
  destroy: {
    type: 'destroy-store';
    name: string;
  };
}

export type ReducerUnion<T> = {
  [P in keyof T]: T[P] extends Action<any> ? T[P] : never;
}[keyof T];

export type PiralReduxStore = Store<PiralReduxState, ReducerUnion<PiralReduxActions>>;
