import { Argv, Arguments } from 'yargs';

export interface ToolCommandRunner<U> {
  (args: Arguments<U>): void | Promise<void>;
}

export interface ToolCommandWrapper<U> {
  (args: Arguments<U>, runner: ToolCommandRunner<U>): void | Promise<void>;
}

export interface ToolCommand<T = any, U = any> {
  name: string;
  description: string;
  arguments: Array<string>;
  flags?(argv: Argv<T>): Argv<T>;
  alias: Array<string>;
  run: ToolCommandRunner<U>;
}

export interface CliPluginApi {
  withCommand<T>(command: ToolCommand<T>): CliPluginApi;
  withoutCommand(commandName: string): CliPluginApi;
  wrapCommand<U>(commandName: string, wrapper: ToolCommandWrapper<U>): CliPluginApi;
  beforeCommand<U>(commandName: string, before: ToolCommandRunner<U>): CliPluginApi;
  afterCommand<U>(commandName: string, after: ToolCommandRunner<U>): CliPluginApi;
}

export interface CliPlugin {
  (api: CliPluginApi): void;
}
