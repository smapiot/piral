export type UserFeatures = Record<string, boolean>;

export type UserPermissions = Record<string, any>;

export type UserInfo<T = {}> = {
  id: string;
  firstName: string;
  lastName: string;
  mail: string;
  language: string;
} & T;
