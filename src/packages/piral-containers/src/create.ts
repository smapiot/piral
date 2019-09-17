import { PiletApi, buildName, PiletMetadata } from 'piral-core';
import { withPiletState } from './withPiletState';
import { PiletContainersApi } from './types';

export function createContainerApi(api: PiletApi, target: PiletMetadata): PiletContainersApi {
  let containers = 0;
  return {
    createState(options) {
      const actions = {};
      const id = buildName(target.name, containers++);
      const cb = dispatch => context.replaceState(id, dispatch);
      context.createState(id, options.state);
      Object.keys(options.actions).forEach(key => {
        const action = options.actions[key];
        actions[key] = (...args) => action.call(api, cb, ...args);
      });
      return component => withPiletState(component, id, actions) as any;
    },
  };
}
