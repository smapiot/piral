import { Argv, Arguments } from 'yargs';
import { apps } from './index';
import {
  forceOverwriteKeys,
  keyOfForceOverwrite,
  valueOfForceOverwrite,
  keyOfPiletLanguage,
  piletLanguageKeys,
  valueOfPiletLanguage,
} from './helpers';

function specializeCommands(suffix: string) {
  return allCommands
    .filter(m => m.name.endsWith(suffix))
    .map(m => ({
      ...m,
      name: m.name.replace(suffix, ''),
      alias: m.alias.filter(n => n.endsWith(suffix)).map(n => n.replace(suffix, '')),
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
          describe: 'Sets the source root directory or index.html file for collecting all the information.',
          default: apps.debugPiralDefaults.entry,
        })
        .number('port')
        .describe('port', 'Sets the port of the local development server.')
        .default('port', apps.debugPiralDefaults.port)
        .string('public-url')
        .describe('public-url', 'Sets the public URL (path) of the bundle.')
        .default('public-url', apps.debugPiralDefaults.publicUrl)
        .number('log-level')
        .describe('log-level', 'Sets the log level to use (1-5).')
        .default('log-level', apps.buildPiralDefaults.logLevel)
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      return apps.debugPiral(args.base as string, {
        entry: args.source as string,
        port: args.port as number,
        publicUrl: args.publicUrl as string,
        logLevel: args.logLevel as any,
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
          describe: 'Sets the source root directory or index.html file for collecting all the information.',
          default: apps.buildPiralDefaults.entry,
        })
        .string('target')
        .describe('target', 'Sets the target directory or file of bundling.')
        .default('target', apps.buildPiralDefaults.target)
        .string('public-url')
        .describe('public-url', 'Sets the public URL (path) of the bundle.')
        .default('public-url', apps.buildPiralDefaults.publicUrl)
        .boolean('detailed-report')
        .describe('detailed-report', 'Sets if a detailed report should be created.')
        .default('detailed-report', apps.buildPiralDefaults.detailedReport)
        .number('log-level')
        .describe('log-level', 'Sets the log level to use (1-5).')
        .default('log-level', apps.buildPiralDefaults.logLevel)
        .boolean('fresh')
        .describe('fresh', 'Performs a fresh build by removing the target directory first.')
        .default('fresh', apps.buildPiralDefaults.fresh)
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      return apps.buildPiral(args.base as string, {
        entry: args.source as string,
        target: args.target as string,
        publicUrl: args.publicUrl as string,
        detailedReport: args.detailedReport as boolean,
        logLevel: args.logLevel as any,
      });
    },
  },
  {
    name: 'new-piral',
    alias: ['create-piral', 'scaffold-piral', 'setup-piral'],
    description: 'Creates a new Piral instance by adding all files and changes to the current project.',
    arguments: ['[target]'],
    flags(argv) {
      return argv
        .positional('target', {
          type: 'string',
          describe: "Sets the project's root directory for making the changes.",
          default: apps.newPiralDefaults.target,
        })
        .string('app')
        .describe('app', "Sets the path to the app's source HTML file.")
        .default('app', apps.newPiralDefaults.app)
        .boolean('only-core')
        .describe('only-core', 'Sets if "piral-core" should be used. Otherwise, "piral" is used.')
        .default('only-core', apps.newPiralDefaults.onlyCore)
        .boolean('skip-install')
        .describe('skip-install', 'Skips the installation of the dependencies using NPM.')
        .default('skip-install', apps.newPiralDefaults.skipInstall)
        .string('tag')
        .describe('tag', 'Sets the tag or version of the package to install. By default, it is "latest".')
        .default('tag', apps.newPiralDefaults.version)
        .choices('force-overwrite', forceOverwriteKeys)
        .describe('force-overwrite', 'Determines if files should be overwritten by the installation.')
        .default('force-overwrite', keyOfForceOverwrite(apps.newPiralDefaults.forceOverwrite))
        .choices('language', piletLanguageKeys)
        .describe('language', 'Determines the programming language for the new Piral instance.')
        .default('language', keyOfPiletLanguage(apps.newPiralDefaults.language))
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      return apps.newPiral(args.base as string, {
        app: args.app as string,
        target: args.target as string,
        onlyCore: args.onlyCore as boolean,
        version: args.tag as string,
        forceOverwrite: valueOfForceOverwrite(args.forceOverwrite as string),
        language: valueOfPiletLanguage(args.language as string),
        skipInstall: args.skipInstall as boolean,
      });
    },
  },
  {
    name: 'debug-pilet',
    alias: ['watch-pilet', 'debug', 'watch'],
    description: 'Starts the debugging process for a pilet using a Piral instance.',
    arguments: ['[source]'],
    flags(argv) {
      return argv
        .positional('source', {
          type: 'string',
          describe: 'Sets the source file containing the pilet root module.',
          default: apps.debugPiletDefaults.entry,
        })
        .number('port')
        .describe('port', 'Sets the port of the local development server.')
        .default('port', apps.debugPiletDefaults.port)
        .number('log-level')
        .describe('log-level', 'Sets the log level to use (1-5).')
        .default('log-level', apps.buildPiralDefaults.logLevel)
        .string('app')
        .describe('app', 'Sets the name of the Piral instance.')
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      return apps.debugPilet(args.base as string, {
        entry: args.source as string,
        port: args.port as number,
        app: args.app as string,
        logLevel: args.logLevel as any,
      });
    },
  },
  {
    name: 'build-pilet',
    alias: ['bundle-pilet', 'build', 'bundle'],
    description: 'Creates a production build for a pilet.',
    arguments: ['[source]'],
    flags(argv) {
      return argv
        .positional('source', {
          type: 'string',
          describe: 'Sets the source index.tsx file for collecting all the information.',
          default: apps.buildPiletDefaults.entry,
        })
        .string('target')
        .describe('target', 'Sets the target file of bundling.')
        .default('target', apps.buildPiletDefaults.target)
        .boolean('detailed-report')
        .describe('detailed-report', 'Sets if a detailed report should be created.')
        .default('detailed-report', apps.buildPiletDefaults.detailedReport)
        .number('log-level')
        .describe('log-level', 'Sets the log level to use (1-5).')
        .default('log-level', apps.buildPiletDefaults.logLevel)
        .boolean('fresh')
        .describe('fresh', 'Performs a fresh build by removing the target directory first.')
        .default('fresh', apps.buildPiletDefaults.fresh)
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      return apps.buildPilet(args.base as string, {
        entry: args.source as string,
        target: args.target as string,
        detailedReport: args.detailedReport as boolean,
        fresh: args.fresh as boolean,
        logLevel: args.logLevel as any,
      });
    },
  },
  {
    name: 'pack-pilet',
    alias: ['package-pilet', 'pack', 'package'],
    description: 'Creates a pilet package that can be published.',
    arguments: ['[source]'],
    flags(argv) {
      return argv
        .positional('source', {
          type: 'string',
          describe: 'Sets the source package.json file for creating the package.',
          default: apps.packPiletDefaults.source,
        })
        .string('target')
        .describe('target', 'Sets the target directory or file of packing.')
        .default('target', apps.packPiletDefaults.target)
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      return apps.packPilet(args.base as string, {
        source: args.source as string,
        target: args.target as string,
      });
    },
  },
  {
    name: 'publish-pilet',
    alias: ['post-pilet', 'publish'],
    description: 'Publishes a pilet package to a pilet feed.',
    arguments: ['[source]'],
    flags(argv) {
      return argv
        .positional('source', {
          type: 'string',
          describe: 'Sets the source previously packed *.tgz bundle to publish.',
          default: apps.publishPiletDefaults.source,
        })
        .string('url')
        .describe('url', 'Sets the explicit URL where to publish the pilet to.')
        .default('url', apps.publishPiletDefaults.url)
        .string('api-key')
        .describe('api-key', 'Sets the potential API key to send to the service.')
        .default('api-key', apps.publishPiletDefaults.apiKey)
        .boolean('fresh')
        .describe('fresh', 'Performs a fresh build, then packages and finally publishes the pilet.')
        .default('fresh', apps.publishPiletDefaults.fresh)
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.')
        .demandOption('url');
    },
    run(args) {
      return apps.publishPilet(args.base as string, {
        source: args.source as string,
        apiKey: args.apiKey as string,
        url: args.url as string,
        fresh: args.fresh as boolean,
      });
    },
  },
  {
    name: 'new-pilet',
    alias: ['create-pilet', 'scaffold-pilet', 'scaffold', 'new', 'create'],
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
        .boolean('skip-install')
        .describe('skip-install', 'Skips the installation of the dependencies using NPM.')
        .default('skip-install', apps.newPiletDefaults.skipInstall)
        .choices('force-overwrite', forceOverwriteKeys)
        .describe('force-overwrite', 'Determines if files should be overwritten by the scaffolding.')
        .default('force-overwrite', keyOfForceOverwrite(apps.newPiletDefaults.forceOverwrite))
        .choices('language', piletLanguageKeys)
        .describe('language', 'Determines the programming language for the new pilet.')
        .default('language', keyOfPiletLanguage(apps.newPiletDefaults.language))
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      return apps.newPilet(args.base as string, {
        target: args.target as string,
        source: args.source as string,
        registry: args.registry as string,
        forceOverwrite: valueOfForceOverwrite(args.forceOverwrite as string),
        language: valueOfPiletLanguage(args.language as string),
        skipInstall: args.skipInstall as boolean,
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
        .string('tag')
        .describe('tag', 'Sets the tag or version of the Piral instance to upgrade to. By default, it is "latest".')
        .default('tag', apps.upgradePiletDefaults.version)
        .choices('force-overwrite', forceOverwriteKeys)
        .describe('force-overwrite', 'Determines if files should be overwritten by the upgrading process.')
        .default('force-overwrite', keyOfForceOverwrite(apps.upgradePiletDefaults.forceOverwrite))
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      return apps.upgradePilet(args.base as string, {
        target: args.target as string,
        version: args.tag as string,
        forceOverwrite: valueOfForceOverwrite(args.forceOverwrite as string),
      });
    },
  },
];

export const piletCommands = specializeCommands('-pilet');

export const piralCommands = specializeCommands('-piral');
