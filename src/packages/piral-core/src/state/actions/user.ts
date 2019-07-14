import { swap, Atom } from '@dbeining/react-atom';
import { UserInfo, UserFeatures, UserPermissions, GlobalState, EventEmitter } from '../../types';

export function setUser(
  this: EventEmitter,
  ctx: Atom<GlobalState>,
  user: UserInfo,
  features: UserFeatures,
  permissions: UserPermissions,
) {
  swap(ctx, state => {
    this.emit('change-user', {
      current: user,
      previous: state.user.current,
    });
    return {
      ...state,
      user: {
        current: user,
        features,
        permissions,
      },
    };
  });
}
