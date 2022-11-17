import type { LogLevels } from './common';

/**
 * Shape of the pilet.json
 */
export interface PiletDefinition {
  piralInstances?: Record<
    string,
    {
      selected?: boolean;
    }
  >;
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
