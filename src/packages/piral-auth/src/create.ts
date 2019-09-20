import * as actions from './actions';
import { PiralAuthApi } from './types';
import { GlobalStateContext } from 'piral-core';

export function createAuthApi(context: GlobalStateContext): PiralAuthApi {
  context.defineActions(actions);

  return {
    getUser() {
      //TODO
      return undefined;
    },
  };
}
