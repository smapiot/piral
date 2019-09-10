declare module 'piral-core/lib/types/custom' {
  interface PiralCustomEventMap {
    'change-user': PiralChangeUserEvent;
  }

  interface PiralCustomState {
    user: UserInfo<any> | undefined;
  }
}

export type UserFeatures = Record<string, boolean>;

export type UserPermissions = Record<string, any>;

export interface UserInfo<T> {
  id: string;
  firstName: string;
  lastName: string;
  mail: string;
  language: string;
  custom: T;
  permissions: UserPermissions;
  features: UserFeatures;
}

export interface PiralChangeUserEvent {
  previous: UserInfo<any>;
  current: UserInfo<any>;
}

export interface CustomActions {
  /**
   * Sets the currently logged in user.
   * @param user The current user or undefined is anonymous.
   * @param features The features for the current user, if any.
   * @param permissions The permissions of the current user, if any.
   */
  setUser<T>(user: UserInfo<T>, features: UserFeatures, permissions: UserPermissions): void;
}

