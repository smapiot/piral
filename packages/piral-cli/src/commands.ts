import { Argv, Arguments } from 'yargs';
import { apps } from './index';

export interface ParsedArgs {
  baseDir: string;
}

export interface ToolCommand<T> {
  name: string;
  description: string;
  arguments: Array<string>;
  flags?(argv: Argv<T>): Argv<T>;
  alias: Array<string>;
  run<U extends ParsedArgs>(args: Arguments<U>): void | Promise<void>;
}

export const allCommands: Array<ToolCommand<any>> = [
  {
    name: 'debug-piral',
    alias: ['watch-piral', 'debug-portal', 'watch-portal'],
    description: 'Starts the debugging process for a Piral instance.',
    arguments: ['[source]'],
    flags(argv) {
      return argv
        .number('port')
        .describe('port', 'Sets the port of the local development server.')
        .default('port', 1234);
    },
    run(args) {
      return apps.debugPiral(args.baseDir, {
        entry: args.source as string,
        port: args.port as number,
      });
    },
  },
  {
    name: 'build-piral',
    alias: ['bundle-piral', 'build-portal', 'bundle-portal'],
    description: 'Creates a production build for a Piral instance.',
    arguments: ['[source]'],
    flags(argv) {
      return argv
        .string('target')
        .describe('target', 'Sets the target file of bundling.')
        .default('target', './dist/index.html');
    },
    run(args) {
      return apps.buildPiral(args.baseDir, {
        entry: args.source as string,
        target: args.target as string,
      });
    },
  },
  {
    name: 'debug-pilet',
    alias: ['watch-pilet', 'debug', 'watch'],
    description: '',
    arguments: [],
    run(args) {},
  },
  {
    name: 'build-pilet',
    alias: ['bundle-pilet', 'build', 'bundle'],
    description: '',
    arguments: [],
    run(args) {},
  },
  {
    name: 'new-pilet',
    alias: ['create-pilet', 'new', 'create'],
    description: '',
    arguments: [],
    run(args) {},
  },
];

function specializeCommands(suffix: string) {
  return allCommands
    .filter(m => m.name.endsWith(suffix))
    .map(m => ({
      ...m,
      name: m.name.replace(suffix, ''),
      alias: [],
    }));
}

export const piletCommands = specializeCommands('-pilet');

export const piralCommands = specializeCommands('-piral');
