import { swap, Atom } from '@dbeining/react-atom';
import { UserInfo, UserFeatures, UserPermissions, GlobalState } from '../../types';

export function setUser(user: UserInfo, features: UserFeatures, permissions: UserPermissions) {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    user: {
      current: user,
      features,
      permissions,
    },
  }));
}
