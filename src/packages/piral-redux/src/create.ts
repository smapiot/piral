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
  ReduxConnectorComponentProps,
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

function defaultReducer<T>(state: T): T {
  return state;
}

/**
 * Creates new Pilet API extensions for creating a Redux state container.
 */
export function createReduxApi(config: ReduxConfig = {}): Extend<PiletReduxApi> {
  const { reducer = defaultReducer, enhancer } = config;
  const otherReducers = {};
  const store = createStore(createReducer() as Reducer<any>, enhancer);
  const provider = createElement(Provider, { store });
  const initialState: PiralReduxState = {
    stores: {},
  };

  function createReducer() {
    return (state: PiralReduxState = initialState, action: ReducerUnion<PiralReduxActions>): PiralReduxState => {
      switch (action.type) {
        case 'create-store': {
          const stores = state.stores;
          return {
            ...state,
            stores: {
              ...stores,
              [action.name]: action.value,
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
        case 'change-store': {
          const reducer = otherReducers[action.name];
          const oldState = state.stores[action.name];
          const newState = reducer(oldState, action.action);

          if (oldState !== newState) {
            return {
              ...state,
              stores: {
                ...state.stores,
                [action.name]: newState,
              },
            };
          }

          return state;
        }
        default: {
          return reducer(state, action) as PiralReduxState;
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
        store.dispatch({
          type: 'create-store',
          name,
          value: reducer(undefined, { type: '$init' }),
        });
        const dispatch = (action: any) => ({
          type: 'change-store',
          name,
          action,
        });
        return component =>
          connect<{}, {}, ReduxConnectorComponentProps, PiralReduxState>(state => ({ state: state.stores[name] }), {
            dispatch,
          })(component) as any;
      },
    });
  };
}
