import { Argv, Arguments } from 'yargs';

export interface ToolCommand<T> {
  name: string;
  description: string;
  arguments: Array<string>;
  flags?(argv: Argv<T>): Argv<T>;
  alias: Array<string>;
  run<U>(args: Arguments<U>): void | Promise<void>;
}
