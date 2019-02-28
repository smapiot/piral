import { Argv, Arguments } from 'yargs';
import { apps } from './index';

function specializeCommands(suffix: string) {
  return allCommands
    .filter(m => m.name.endsWith(suffix))
    .map(m => ({
      ...m,
      name: m.name.replace(suffix, ''),
      alias: [],
    }));
}

export interface ToolCommand<T> {
  name: string;
  description: string;
  arguments: Array<string>;
  flags?(argv: Argv<T>): Argv<T>;
  alias: Array<string>;
  run<U>(args: Arguments<U>): void | Promise<void>;
}

export const allCommands: Array<ToolCommand<any>> = [
  {
    name: 'debug-piral',
    alias: ['watch-piral', 'debug-portal', 'watch-portal'],
    description: 'Starts the debugging process for a Piral instance.',
    arguments: ['[source]'],
    flags(argv) {
      return argv
        .positional('source', {
          type: 'string',
          describe: 'Sets the source index.html file for collecting all the information.',
          default: apps.buildPiralDefaults.entry,
        })
        .number('port')
        .describe('port', 'Sets the port of the local development server.')
        .default('port', apps.debugPiralDefaults.port)
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      return apps.debugPiral(args.base as string, {
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
        .positional('source', {
          type: 'string',
          describe: 'Sets the source index.html file for collecting all the information.',
          default: apps.buildPiralDefaults.entry,
        })
        .string('target')
        .describe('target', 'Sets the target file of bundling.')
        .default('target', apps.buildPiralDefaults.target)
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      return apps.buildPiral(args.base as string, {
        entry: args.source as string,
        target: args.target as string,
      });
    },
  },
  {
    name: 'debug-pilet',
    alias: ['watch-pilet', 'debug', 'watch'],
    description: '(currently not implemented)',
    arguments: [],
    run(args) {},
  },
  {
    name: 'build-pilet',
    alias: ['bundle-pilet', 'build', 'bundle'],
    description: '(currently not implemented)',
    arguments: [],
    run(args) {},
  },
  {
    name: 'new-pilet',
    alias: ['create-pilet', 'new', 'create'],
    description: 'Scaffolds a new pilet for a specified Piral instance.',
    arguments: ['[source]'],
    flags(argv) {
      return argv
        .positional('source', {
          type: 'string',
          describe: 'Sets the source package containing a Piral instance for templating the scaffold process.',
          default: apps.newPiletDefaults.source,
        })
        .string('target')
        .describe('target', 'Sets the target directory for scaffolding. By default, the current directory.')
        .default('target', apps.newPiletDefaults.target)
        .string('registry')
        .describe('registry', 'Sets the package registry to use for resolving the specified Piral app.')
        .default('registry', apps.newPiletDefaults.registry)
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      return apps.newPilet(args.base as string, {
        target: args.target as string,
        source: args.source as string,
        registry: args.registry as string,
      });
    },
  },
  {
    name: 'upgrade-pilet',
    alias: ['upgrade'],
    description: 'Upgrades an existing pilet to the latest version of the used Piral instance.',
    arguments: [],
    flags(argv) {
      return argv
        .string('target')
        .describe('target', 'Sets the target directory to upgrade. By default, the current directory.')
        .default('target', apps.upgradePiletDefaults.target)
        .string('version')
        .describe('version', 'Sets the version of the Piral instance to upgrade to. By default, the latest version.')
        .default('version', apps.upgradePiletDefaults.version)
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      return apps.upgradePilet(args.base as string, {
        target: args.target as string,
        version: args.version as string,
      });
    },
  },
];

export const piletCommands = specializeCommands('-pilet');

export const piralCommands = specializeCommands('-piral');
