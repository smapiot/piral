import type { ParcelOptions } from 'parcel-bundler';
import type { SharedDependency } from 'piral-cli';

declare module 'parcel-bundler' {
  interface ParcelBundle {
    getHash(): string;
  }
}

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

export interface PiletBundlerSetup {
  type: 'pilet';
  targetDir: string;
  externals: Array<string>;
  importmap: Array<SharedDependency>;
  entryModule: string;
  config: ParcelConfig;
}

export interface DependencyBundlerSetup {
  type: 'dependency';
  targetDir: string;
  externals: Array<string>;
  importmap: Array<SharedDependency>;
  entryModule: string;
  config: ParcelConfig;
}

export type BundlerSetup = PiralBundlerSetup | PiletBundlerSetup | DependencyBundlerSetup;
