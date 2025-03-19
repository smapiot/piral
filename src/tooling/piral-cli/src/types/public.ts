import type { Argv, Arguments } from 'yargs';
import type { RuleRunner, PiletRuleContext, PiralRuleContext, LogLevels, SharedDependency } from './common';

export type FlagType = 'string' | 'number' | 'boolean' | 'object';

export interface Flag {
  name: string;
  type?: FlagType;
  alias: Array<string>;
  values?: Array<any>;
  describe?: string;
  default?: any;
  required?: boolean;
  ignore?: boolean;
  filter?: (answer: any, others: Record<string, any>) => any;
  validate?: (input: any) => boolean | string | Promise<boolean | string>;
  when?: (answers: Record<string, any>) => boolean;
  convert?: (answer: any) => any;
}

export interface ToolCommandRunner<U = {}> {
  (args: Arguments<U>): void | Promise<void>;
}

export interface ToolCommandWrapper<U = {}> {
  (args: Arguments<U>, runner: ToolCommandRunner<U>): void | Promise<void>;
}

export interface ToolCommandFlagsSetter<T = {}> {
  (argv: Argv<T>): Argv<T>;
}

export interface SelectCommands {
  (commands: ListCommands): Array<ToolCommand<any>>;
}

export interface ToolCommand<T = any, U = any> {
  name: string;
  description: string;
  arguments: Array<string>;
  survey?: boolean;
  flags?: ToolCommandFlagsSetter<T>;
  alias: Array<string>;
  run: ToolCommandRunner<U>;
}

export interface ListCommands {
  all: Array<ToolCommand<any>>;
  pilet: Array<ToolCommand<any>>;
  piral: Array<ToolCommand<any>>;
}

export interface CliPluginApi {
  withCommand<T, U>(command: ToolCommand<T, U>): CliPluginApi;
  withoutCommand(commandName: string): CliPluginApi;
  withFlags<T>(commandName: string, setter: ToolCommandFlagsSetter<T>): CliPluginApi;
  wrapCommand<U>(commandName: string, wrapper: ToolCommandWrapper<U>): CliPluginApi;
  beforeCommand<U>(commandName: string, before: ToolCommandRunner<U>): CliPluginApi;
  afterCommand<U>(commandName: string, after: ToolCommandRunner<U>): CliPluginApi;
  withPiralRule(ruleName: string, runner: RuleRunner<PiralRuleContext>): CliPluginApi;
  withPiletRule(ruleName: string, runner: RuleRunner<PiletRuleContext>): CliPluginApi;
  withPatcher(packageName: string, patch: PackagePatcher): CliPluginApi;
  withBundler(bundlerName: string, bundler: BundlerDefinition): CliPluginApi;
}

export interface CliPlugin {
  (api: CliPluginApi): void;
}

export interface PackagePatcher {
  (rootDir: string): Promise<void>;
}

export interface PackagePatcher {
  (rootDir: string): Promise<void>;
}

export interface BaseBundleParameters {
  root: string;
  optimizeModules: boolean;
  ignored: Array<string>;
  _: Record<string, any>;
}

export interface DebugPiralParameters extends BaseBundleParameters {
  piralInstances: Array<string>;
  hmr: boolean;
  externals: Array<string>;
  publicUrl: string;
  outFile: string;
  outDir: string;
  entryFiles: string;
  logLevel: LogLevels;
}

export interface WatchPiralParameters extends BaseBundleParameters {
  piralInstances: Array<string>;
  externals: Array<string>;
  publicUrl: string;
  entryFiles: string;
  logLevel: LogLevels;
}

export interface BuildPiralParameters extends BaseBundleParameters {
  piralInstances: Array<string>;
  emulator: boolean;
  standalone: boolean;
  sourceMaps: boolean;
  watch: boolean;
  contentHash: boolean;
  minify: boolean;
  externals: Array<string>;
  publicUrl: string;
  outFile: string;
  outDir: string;
  entryFiles: string;
  logLevel: LogLevels;
}

export interface DebugPiletParameters extends BaseBundleParameters {
  piralInstances: Array<string>;
  hmr: boolean;
  externals: Array<string>;
  importmap: Array<SharedDependency>;
  targetDir: string;
  outFile: string;
  outDir: string;
  entryModule: string;
  logLevel: LogLevels;
  version: PiletSchemaVersion;
}

export interface BuildPiletParameters extends BaseBundleParameters {
  piralInstances: Array<string>;
  sourceMaps: boolean;
  watch: boolean;
  contentHash: boolean;
  minify: boolean;
  externals: Array<string>;
  importmap: Array<SharedDependency>;
  targetDir: string;
  outFile: string;
  outDir: string;
  entryModule: string;
  logLevel: LogLevels;
  version: PiletSchemaVersion;
}

export interface BundlerPrepareArgs<T> {
  (args: T): T | Promise<T>;
}

export interface BaseBundlerDefinition<T> {
  path: string;
  exec?: string;
  prepare?: BundlerPrepareArgs<T>;
}

export interface WatchPiralBundlerDefinition extends BaseBundlerDefinition<WatchPiralParameters> {}

export interface DebugPiralBundlerDefinition extends BaseBundlerDefinition<DebugPiralParameters> {
  flags?: ToolCommandFlagsSetter;
}

export interface BuildPiralBundlerDefinition extends BaseBundlerDefinition<BuildPiralParameters> {
  flags?: ToolCommandFlagsSetter;
}

export interface DebugPiletBundlerDefinition extends BaseBundlerDefinition<DebugPiletParameters> {
  flags?: ToolCommandFlagsSetter;
}

export interface BuildPiletBundlerDefinition extends BaseBundlerDefinition<BuildPiletParameters> {
  flags?: ToolCommandFlagsSetter;
}

export interface PiralBuildHandler {
  create(config: {
    root: string;
    entryFiles: string;
    outDir: string;
    outFile: string;
    externals: Array<string>;
    emulator: boolean;
    sourceMaps: boolean;
    contentHash: boolean;
    minify: boolean;
    publicUrl: string;
    hmr: boolean;
    logLevel: LogLevels;
    watch: boolean;
    args: any;
  }): Promise<BundleHandlerResponse>;
}

export interface PiletBuildHandler {
  create(config: {
    root: string;
    piralInstances: Array<string>;
    entryModule: string;
    targetDir: string;
    outDir: string;
    outFile: string;
    externals: Array<string>;
    importmap: Array<SharedDependency>;
    version: PiletSchemaVersion;
    develop: boolean;
    sourceMaps: boolean;
    contentHash: boolean;
    minify: boolean;
    logLevel: LogLevels;
    watch: boolean;
    args: any;
  }): Promise<BundleHandlerResponse>;
}

export interface BundleResult {
  outDir: string;
  outFile: string;
  hash?: string;
  name?: string;
  requireRef?: string;
}

export interface BundleHandlerResponse {
  onStart(cb: () => void): void;
  onEnd(cb: (result: BundleResult) => void): void;
  bundle(): Promise<BundleResult>;
}

export interface BundlerDefinition {
  debugPiral: DebugPiralBundlerDefinition;
  watchPiral: WatchPiralBundlerDefinition;
  buildPiral: BuildPiralBundlerDefinition;
  debugPilet: DebugPiletBundlerDefinition;
  buildPilet: BuildPiletBundlerDefinition;
}

export type ImportmapVersions = 'all' | 'match-major' | 'any-patch' | 'exact';

export type ImportmapMode = 'host' | 'remote';

export type PiletSchemaVersion = 'none' | 'v0' | 'v1' | 'v2' | 'v3' | 'mf';

export interface HeaderAuthConfig {
  mode: 'header';
  key: string;
  value: string;
}

export interface HttpAuthConfig {
  mode: 'http';
  username: string;
  password: string;
}

export type AuthConfig = HeaderAuthConfig | HttpAuthConfig;

export type SourceLanguage = 'js' | 'ts';

export type PublishScheme = 'none' | 'digest' | 'bearer' | 'basic';

export type PiletPublishSource = 'local' | 'npm' | 'remote';

export type PiralBuildType =
  | 'all'
  | 'release'
  | 'emulator'
  | 'emulator-package'
  | 'emulator-sources'
  | 'emulator-website';

export type PiralPublishType = 'release' | 'emulator';

export type PiletBuildType = 'default' | 'standalone' | 'manifest';

export type PackageType = 'registry' | 'monorepo' | 'file' | 'git' | 'remote';

export type NpmDirectClientType = 'npm' | 'yarn' | 'pnp' | 'pnpm' | 'bun';

export type NpmWapperClientType = 'lerna' | 'rush';

export type NpmClientType = NpmDirectClientType | NpmWapperClientType;

export type Framework = 'piral' | 'piral-core' | 'piral-base';

export interface StandardEnvProps {
  production?: boolean;
  debugPiral?: boolean;
  debugPilet?: boolean;
  root: string;
  publicPath?: string;
  piralInstances?: Array<string>;
  dependencies?: Array<string>;
}
