import { Argv, Arguments } from 'yargs';
import { RuleRunner, PiletRuleContext, PiralRuleContext, LogLevels, SharedDependency, ReleaseProvider } from './common';

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
  withReleaseProvider(providerName: string, provider: ReleaseProvider): CliPluginApi;
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
  piral: string;
  hmr: boolean;
  externals: Array<string>;
  publicUrl: string;
  entryFiles: string;
  logLevel: LogLevels;
}

export interface WatchPiralParameters extends BaseBundleParameters {
  piral: string;
  externals: Array<string>;
  entryFiles: string;
  logLevel: LogLevels;
}

export interface BuildPiralParameters extends BaseBundleParameters {
  piral: string;
  emulator: boolean;
  standalone: boolean;
  sourceMaps: boolean;
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
  piral: string;
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
  piral: string;
  sourceMaps: boolean;
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
    piral: string;
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

export type PiletSchemaVersion = 'none' | 'v0' | 'v1' | 'v2';

export type PiletPublishScheme = 'none' | 'digest' | 'bearer' | 'basic';

export type PiletPublishSource = 'local' | 'npm' | 'remote';

export type PiralBuildType = 'all' | 'release' | 'emulator' | 'emulator-sources';

export type PiletBuildType = 'default' | 'standalone' | 'manifest';

export type PackageType = 'registry' | 'file' | 'git';

export type NpmClientType = 'npm' | 'yarn' | 'pnpm' | 'lerna' | 'rush';

export type Framework = 'piral' | 'piral-core' | 'piral-base';

export interface StandardEnvProps {
  production?: boolean;
  debugPiral?: boolean;
  debugPilet?: boolean;
  root: string;
  publicPath?: string;
  piral?: string;
  dependencies?: Array<string>;
}
