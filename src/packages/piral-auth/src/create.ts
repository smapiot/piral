import * as actions from './actions';
import { swap, deref } from '@dbeining/react-atom';
import { Extend } from 'piral-core';
import { PiralAuthApi, UserInfo } from './types';

/**
 * Available configuration options for the auth extension.
 */
export interface AuthConfig {
  /**
   * Gets the current user, if any.
   */
  user?: UserInfo;
}

/**
 * Creates a new Piral API extension for enabling authentication support.
 */
export function createAuthApi(config: AuthConfig = {}): Extend<PiralAuthApi> {
  const { user } = config;

  return context => {
    context.defineActions(actions);

    swap(context.state, state => ({
      ...state,
      user,
    }));

    return {
      getUser() {
        return deref(context.state).user;
      },
    };
  };
}
