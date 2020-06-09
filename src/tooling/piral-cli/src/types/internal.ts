import { LogLevels } from './common';

export interface PackageData {
  name: string;
  version: string;
  description: string;
  main: string;
  author:
    | string
    | {
        name?: string;
        url?: string;
        email?: string;
      };
  custom?: any;
}

export interface PackageFiles {
  [file: string]: Buffer;
}

export interface FileInfo {
  path: string;
  hash: string;
  changed: boolean;
}

/**
 * The error message tuple. Consists of
 * 0. The log level
 * 1. The unique error code
 * 2. The (short) error message
 */
export type QuickMessage = [LogLevels, string, string];
