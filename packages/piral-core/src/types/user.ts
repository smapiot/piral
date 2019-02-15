import { Dict } from './utils';

export type UserFeatures = Dict<boolean>;

export type UserPermissions = Dict<any>;

export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  mail: string;
  language: string;
}
