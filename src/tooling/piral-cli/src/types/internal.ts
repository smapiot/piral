import type { LogLevels, PiletsInfo } from './common';

export interface Importmap {
  imports: Record<string, string>;
  inherit: Array<string>;
}

export interface PackageData {
  name: string;
  version: string;
  description: string;
  importmap?: Importmap;
  main: string;
  author:
    | string
    | {
        name?: string;
        url?: string;
        email?: string;
      };
  dependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

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

// Shape of the package.json of a pilet
export interface PiletPackageData extends PackageData {
  piral?: {
    name: string;
  };
  custom?: any;
}

// Shape of the package.json of a Piral instance or emulator
export interface PiralPackageData extends PackageData {
  pilets?: PiletsInfo;
  piralCLI?: { generated: boolean; version: string };
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
