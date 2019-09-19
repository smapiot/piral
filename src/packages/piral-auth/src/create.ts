import * as actions from './actions';
import { PiralAuthApi } from './types';
import { GlobalStateContext, PiletApi, PiletMetadata } from 'piral-core';

export function createAuthApi(_api: PiletApi, _target: PiletMetadata, context: GlobalStateContext): PiralAuthApi {
  context.withActions(actions);

  return {
    getUser() {
      //TODO
      return undefined;
    },
  };
}
