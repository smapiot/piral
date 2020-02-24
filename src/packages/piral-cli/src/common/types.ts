import { ParcelOptions } from 'parcel-bundler';

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

export interface ContextLogger {
  success(): boolean;
  throwIfError(): void;
  summary(): void;
  notify(kind: 'error' | 'warning', message: string): void;
}

export type NotifyContextLogger = ContextLogger['notify'];

export interface FileInfo {
  path: string;
  hash: string;
  changed: boolean;
}

export const enum LogLevels {
  /**
   * Logging disabled
   */
  disabled = 0,
  /**
   * Only log errors
   */
  error = 1,
  /**
   * Log errors and warnings
   */
  warning = 2,
  /**
   * Log errors, warnings and info
   */
  info = 3,
  /**
   * Verbose logging, which keeps everything in log with timestamps
   * and also log http requests to dev server.
   */
  verbose = 4,
  /**
   * Debug logging active, which saves everything to a file with
   * timestamps.
   */
  debug = 5,
}
