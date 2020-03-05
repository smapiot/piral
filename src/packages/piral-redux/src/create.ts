import { createElement } from 'react';
import { Extend } from 'piral-core';
import { Provider, connect } from 'react-redux';
import { createStore, StoreEnhancer, Reducer } from 'redux';
import {
  PiletReduxApi,
  PiralReduxCustomState,
  PiralReduxCustomActions,
  ReducerUnion,
  PiralReduxActions,
  PiralReduxState,
} from './types';

/**
 * Available configuration options for the Redux plugin.
 */
export interface ReduxConfig {
  /**
   * The custom reducers, if any.
   */
  reducer?: Reducer<PiralReduxCustomState, ReducerUnion<PiralReduxCustomActions>>;
  /**
   * The custom enhancers, if any.
   */
  enhancer?: StoreEnhancer;
}

/**
 * Creates new Pilet API extensions for creating a Redux state container.
 */
export function createReduxApi(config: ReduxConfig = {}): Extend<PiletReduxApi> {
  const { reducer, enhancer } = config;
  const otherReducers = {};
  const store = createStore(createReducer() as Reducer<any>, enhancer);
  const provider = createElement(Provider, { store });

  function createReducer() {
    return (state: PiralReduxState, action: ReducerUnion<PiralReduxActions>): PiralReduxState => {
      switch (action.type) {
        case 'create-store': {
          const stores = state.stores;
          return {
            ...state,
            stores: {
              ...stores,
              [action.name]: {},
            },
          };
        }
        case 'destroy-store': {
          const { [action.name]: _, ...stores } = state.stores;
          return {
            ...state,
            stores: {
              ...stores,
            },
          };
        }
        default: {
          const stores = {};
          const rest = reducer(state, action);

          Object.keys(otherReducers).forEach(key => {
            const oldState = state.stores[key];
            const newState = otherReducers[key](oldState, action);

            if (newState !== oldState) {
              stores[key] = newState;
            }
          });

          if (rest !== state || Object.keys(stores).length > 0) {
            return {
              ...rest,
              stores: {
                ...state.stores,
                ...stores,
              },
            };
          }

          return state;
        }
      }
    };
  }

  return context => {
    context.includeProvider(provider);

    return (_, meta) => ({
      createReduxStore(reducer) {
        const name = meta.name;
        otherReducers[name] = reducer;
        return component =>
          connect<{}, {}, { data: any }, PiralReduxState>(state => ({
            data: state.stores[name],
          }))(component) as any;
      },
    });
  };
}
