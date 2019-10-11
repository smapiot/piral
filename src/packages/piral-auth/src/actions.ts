import { swap, Atom } from '@dbeining/react-atom';
import { EventEmitter, GlobalState } from 'piral-core';
import { UserInfo } from './types';

export function setUser(this: EventEmitter, ctx: Atom<GlobalState>, user: UserInfo) {
  swap(ctx, state => {
    this.emit('change-user', {
      current: user,
      previous: state.user,
    });
    return {
      ...state,
      user,
    };
  });
}
