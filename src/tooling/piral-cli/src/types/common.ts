export interface Importmap {
  imports?: Record<string, string>;
  inherit?: Array<string>;
  exclude?: Array<string>;
}

export interface EmulatorWebsiteManifestFiles {
  typings: string;
  main: string;
  app: string;
  assets: Array<string>;
  always?: string;
  once?: string;
}

export interface EmulatorWebsiteManifest {
  name: string;
  description: string;
  version: string;
  timestamp: string;
  scaffolding: {
    pilets: PiletsInfo;
    cli: string;
  };
  files: EmulatorWebsiteManifestFiles;
  importmap: Importmap;
  dependencies: {
    optional: Record<string, string>;
    included: Record<string, string>;
  };
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

export interface PiralInstancePackageData extends PiralPackageData {
  root: string;
  app: string;
  port: number;
}

export interface AppDefinition {
  appPackage: PiralInstancePackageData;
  appFile: string;
  appRoot: string;
  appPort: number;
  emulator: boolean;
}

export enum LogLevels {
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

export interface BundleDetails {
  dir: string;
  name: string;
  hash: string;
}

export interface Bundler {
  readonly bundle: BundleDetails;
  start(): void;
  stop(): Promise<void>;
  on(cb: (args: any) => void): void;
  off(cb: (args: any) => void): void;
  ready(): Promise<void>;
}

export interface NetworkSpec {
  port: number;
  type: 'proposed' | 'wanted' | 'fixed';
}

export interface PlatformStartModuleOptions {
  appDir?: string;
  open: boolean;
  fullBase: string;
  feed: string | Array<string>;
  publicUrl: string;
  customkrasrc: string;
  network: NetworkSpec;
  hooks: Record<string, Function>;
  registerWatcher(file: string): void;
  registerEnd(cb: () => void): void;

  maxListeners: number;
  pilets: Array<any>;
}

export interface PlatformStartShellOptions {
  open: boolean;
  fullBase: string;
  root: string;
  feed: string | Array<string>;
  targetDir: string;
  publicUrl: string;
  bundler: Bundler;
  customkrasrc: string;
  network: NetworkSpec;
  hooks: Record<string, Function>;
  registerWatcher(file: string): void;
  registerEnd(cb: () => void | Promise<void>): void;
}

export interface ReleaseProvider {
  (directory: string, files: Array<string>, args: Record<string, string>, interactive: boolean): Promise<void>;
}

export interface TemplateFileLocation {
  from: string;
  to: string;
  deep?: boolean;
  once?: boolean;
}

export interface PiletsInfo {
  files: Array<string | TemplateFileLocation>;
  template: string;
  devDependencies: Record<string, string | true>;
  scripts: Record<string, string>;
  validators: Record<string, any>;
  packageOverrides: Record<string, any>;
  preScaffold: string;
  postScaffold: string;
  preUpgrade: string;
  postUpgrade: string;
}

export interface RuleContext {
  error(message: string): void;
  warning(message: string): void;
  logLevel?: LogLevels;
  root: string;
  entry: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
}

export interface SharedDependency {
  id: string;
  requireId: string;
  name: string;
  ref: string;
  type: 'local' | 'remote';
  entry: string;
  parents?: Array<string>;
  alias?: string;
  isAsync?: boolean;
}

export interface RuleRunner<T extends RuleContext> {
  (context: T, options: any): void | Promise<void>;
}

export interface Rule<T extends RuleContext> {
  run: RuleRunner<T>;
  name: string;
}

export interface PiralRuleContext extends RuleContext {
  info: PiletsInfo;
  externals: Array<SharedDependency>;
}

export interface PiletRuleContext extends RuleContext {
  apps: Array<AppDefinition>;
  piletPackage: any;
  peerModules: Array<string>;
  importmap: Array<SharedDependency>;
}
