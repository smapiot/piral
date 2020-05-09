import { Argv, Arguments } from 'yargs';
import { RuleRunner, PiletRuleContext, PiralRuleContext, Bundler, BundleDetails, LogLevels } from './common';

export interface ToolCommandRunner<U> {
  (args: Arguments<U>): void | Promise<void>;
}

export interface ToolCommandWrapper<U> {
  (args: Arguments<U>, runner: ToolCommandRunner<U>): void | Promise<void>;
}

export interface ToolCommandFlagsSetter<T> {
  (argv: Argv<T>): Argv<T>;
}

export interface ToolCommand<T = any, U = any> {
  name: string;
  description: string;
  arguments: Array<string>;
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

export interface DebugPiralParameters {
  root: string;
  piral: string;
  optimizeModules: boolean;
  scopeHoist: boolean;
  autoInstall: boolean;
  hmr: boolean;
  cacheDir: string;
  externals: Array<string>;
  publicUrl: string;
  entryFiles: string;
  logLevel: LogLevels;
  ignored: Array<string>;
}

export interface WatchPiralParameters {
  root: string;
  piral: string;
  externals: Array<string>;
  entryFiles: string;
  logLevel: LogLevels;
}

export interface BuildPiralParameters {
  root: string;
  piral: string;
  optimizeModules: boolean;
  scopeHoist: boolean;
  develop: boolean;
  sourceMaps: boolean;
  contentHash: boolean;
  detailedReport: boolean;
  minify: boolean;
  cacheDir: string;
  externals: Array<string>;
  publicUrl: string;
  outFile: string;
  outDir: string;
  entryFiles: string;
  logLevel: LogLevels;
  ignored: Array<string>;
}

export interface DebugPiletParameters {
  root: string;
  piral: string;
  optimizeModules: boolean;
  scopeHoist: boolean;
  autoInstall: boolean;
  hmr: boolean;
  cacheDir: string;
  externals: Array<string>;
  targetDir: string;
  entryModule: string;
  logLevel: LogLevels;
  version: PiletSchemaVersion;
  ignored: Array<string>;
}

export interface BuildPiletParameters {
  root: string;
  piral: string;
  optimizeModules: boolean;
  scopeHoist: boolean;
  sourceMaps: boolean;
  contentHash: boolean;
  detailedReport: boolean;
  minify: boolean;
  cacheDir: string;
  externals: Array<string>;
  targetDir: string;
  outFile: string;
  outDir: string;
  entryModule: string;
  logLevel: LogLevels;
  version: PiletSchemaVersion;
  ignored: Array<string>;
}

export interface BundlerDefinition {
  debugPiral(args: DebugPiralParameters): Promise<Bundler>;
  watchPiral(args: WatchPiralParameters): Promise<Bundler>;
  buildPiral(args: BuildPiralParameters): Promise<BundleDetails>;
  debugPilet(args: DebugPiletParameters): Promise<Bundler>;
  buildPilet(args: BuildPiletParameters): Promise<BundleDetails>;
}

export type PiletSchemaVersion = 'v0' | 'v1';

export type PiralBuildType = 'all' | 'release' | 'develop';

export type TemplateType = 'default' | 'empty' | 'other';

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
