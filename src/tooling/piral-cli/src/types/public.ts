import { Argv, Arguments } from 'yargs';
import {
  RuleRunner,
  PiletRuleContext,
  PiralRuleContext,
  Bundler,
  BundleDetails,
  LogLevels,
  ReleaseProvider,
} from './common';

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
  targetDir: string;
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
  targetDir: string;
  outFile: string;
  outDir: string;
  entryModule: string;
  logLevel: LogLevels;
  version: PiletSchemaVersion;
}

export interface WatchPiralBundlerDefinition {
  run(args: WatchPiralParameters): Promise<Bundler>;
}

export interface DebugPiralBundlerDefinition {
  flags?: ToolCommandFlagsSetter;
  run(args: DebugPiralParameters): Promise<Bundler>;
}

export interface BuildPiralBundlerDefinition {
  flags?: ToolCommandFlagsSetter;
  run(args: BuildPiralParameters): Promise<BundleDetails>;
}

export interface DebugPiletBundlerDefinition {
  flags?: ToolCommandFlagsSetter;
  run(args: DebugPiletParameters): Promise<Bundler>;
}

export interface BuildPiletBundlerDefinition {
  flags?: ToolCommandFlagsSetter;
  run(args: BuildPiletParameters): Promise<BundleDetails>;
}

export interface BundlerDefinition {
  debugPiral: DebugPiralBundlerDefinition;
  watchPiral: WatchPiralBundlerDefinition;
  buildPiral: BuildPiralBundlerDefinition;
  debugPilet: DebugPiletBundlerDefinition;
  buildPilet: BuildPiletBundlerDefinition;
}

export type PiletSchemaVersion = 'none' | 'v0' | 'v1';

export type PiletPublishSource = 'local' | 'npm' | 'remote';

export type PiralBuildType = 'all' | 'release' | 'emulator' | 'emulator-sources';

export type PackageType = 'registry' | 'file' | 'git';

export type NpmClientType = 'npm' | 'yarn' | 'pnpm';

export type Framework = 'piral' | 'piral-core' | 'piral-base';

export interface StandardEnvProps {
  production?: boolean;
  debugPiral?: boolean;
  debugPilet?: boolean;
  root: string;
  piral?: string;
  dependencies?: Array<string>;
}
