import type { GlobalStateContext } from 'piral-core';
import { UserInfo } from './types';

export function setUser(ctx: GlobalStateContext, user: UserInfo) {
  ctx.dispatch((state) => {
    ctx.emit('change-user', {
      current: user,
      previous: state.user,
    });
    return {
      ...state,
      user,
    };
  });
}
