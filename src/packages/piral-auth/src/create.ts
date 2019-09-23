import * as actions from './actions';
import { swap } from '@dbeining/react-atom';
import { Extend } from 'piral-core';
import { PiralAuthApi } from './types';

/**
 * Creates a new Piral API extension for enabling authentication support.
 */
export function createAuthApi(): Extend<PiralAuthApi> {
  return context => {
    context.defineActions(actions);

    swap(context.state, state => ({
      ...state,
      user: undefined,
    }));

    return {
      getUser() {
        //TODO
        return undefined;
      },
    };
  };
}
