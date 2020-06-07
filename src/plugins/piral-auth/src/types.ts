declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiralAuthApi {}

  interface PiralCustomEventMap {
    'change-user': PiralChangeUserEvent;
  }

  interface PiralCustomState {
    /**
     * The currently authenticated user, if any.
     */
    user: UserInfo | undefined;
  }

  interface PiralCustomActions {
    /**
     * Sets the currently logged in user.
     * @param user The current user or undefined is anonymous.
     * @param features The features for the current user, if any.
     * @param permissions The permissions of the current user, if any.
     */
    setUser(user: UserInfo, features: UserFeatures, permissions: UserPermissions): void;
  }
}

export type UserFeatures = Record<string, boolean>;

export type UserPermissions = Record<string, any>;

export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  mail: string;
  language: string;
  permissions: UserPermissions;
  features: UserFeatures;
}

export interface PiralChangeUserEvent {
  previous: UserInfo;
  current: UserInfo;
}

export interface PiralAuthApi {
  /**
   * Gets the currently authenticated user, if any.
   */
  getUser(): UserInfo | undefined;
}
