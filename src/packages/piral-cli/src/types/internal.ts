import { ParcelOptions } from 'parcel-bundler';
import { LogLevels } from './common';

declare module 'parcel-bundler' {
  interface ParcelBundle {
    getHash(): string;
  }
}

export type TemplateType = 'default' | 'empty' | 'other';

export type PackageType = 'registry' | 'file' | 'git';

export interface ParcelConfig extends ParcelOptions {
  global?: string;
  autoInstall?: boolean;
  logLevel?: any;
}

export interface PiralBundlerSetup {
  type: 'piral';
  entryFiles: string;
  config: ParcelConfig;
}

export enum PiletLanguage {
  ts,
  js,
}

export interface PiletBundlerSetup {
  type: 'pilet';
  targetDir: string;
  externals: Array<string>;
  entryModule: string;
  config: ParcelConfig;
}

export interface StandardEnvProps {
  production?: boolean;
  debugPiral?: boolean;
  debugPilet?: boolean;
  root: string;
  piral?: string;
  dependencies?: Array<string>;
}

export type BundlerSetup = PiralBundlerSetup | PiletBundlerSetup;

export type Framework = 'piral' | 'piral-core' | 'piral-base';

export enum ForceOverwrite {
  no,
  prompt,
  yes,
}

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
