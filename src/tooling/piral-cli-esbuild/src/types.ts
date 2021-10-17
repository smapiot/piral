import type { SharedDependency } from 'piral-cli';

export interface PiralBundlerSetup {
  type: 'piral';
  entryFiles: string;
}

export interface PiletBundlerSetup {
  type: 'pilet';
  targetDir: string;
  externals: Array<string>;
  importmap: Array<SharedDependency>,
  entryModule: string;
}

export interface DependencyBundlerSetup {
  type: 'dependency';
  targetDir: string;
  externals: Array<string>;
  importmap: Array<SharedDependency>,
  entryModule: string;
}

export type BundlerSetup = PiralBundlerSetup | PiletBundlerSetup | DependencyBundlerSetup;
