import { swap, Atom } from '@dbeining/react-atom';
import { UserInfo, UserFeatures, UserPermissions, GlobalState } from '../../types';

export function setUser(ctx: Atom<GlobalState>, user: UserInfo, features: UserFeatures, permissions: UserPermissions) {
  swap(ctx, state => ({
    ...state,
    user: {
      current: user,
      features,
      permissions,
    },
  }));
}
