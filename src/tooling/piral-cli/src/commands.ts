import * as apps from './apps';
import {
  piletBuildTypeKeys,
  availableBundlers,
  availableReleaseProviders,
  forceOverwriteKeys,
  keyOfForceOverwrite,
  valueOfForceOverwrite,
  keyOfPiletLanguage,
  piletLanguageKeys,
  valueOfPiletLanguage,
  frameworkKeys,
  clientTypeKeys,
  schemaKeys,
  fromKeys,
  bundlerKeys,
  piralBuildTypeKeys,
  publishModeKeys,
} from './helpers';
import {
  ToolCommand,
  ListCommands,
  NpmClientType,
  LogLevels,
  PiralBuildType,
  PiletPublishSource,
  PiletSchemaVersion,
  PiletBuildType,
  PiletPublishScheme,
} from './types';

function specializeCommand(commands: Array<ToolCommand<any>>, command: ToolCommand<any>, suffix: string) {
  if (command.name.endsWith(suffix)) {
    commands.push({
      ...command,
      name: command.name.replace(suffix, ''),
      alias: command.alias.filter((n) => n.endsWith(suffix)).map((n) => n.replace(suffix, '')),
    });
  }
}

function specializeCommands(suffix: string) {
  const commands: Array<ToolCommand<any>> = [];

  for (const command of allCommands) {
    specializeCommand(commands, command, suffix);
  }

  return commands;
}

export { apps };

const allCommands: Array<ToolCommand<any>> = [
  {
    name: 'debug-piral',
    alias: ['watch-piral', 'debug-portal', 'watch-portal'],
    description: 'Starts the debugging process for a Piral instance.',
    arguments: ['[source]'],
    // "any" due to https://github.com/microsoft/TypeScript/issues/28663 [artifical N = 50]
    flags(argv: any) {
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
        .default('log-level', apps.debugPiralDefaults.logLevel)
        .boolean('open')
        .describe('open', 'Opens the Piral instance directly in the browser.')
        .default('open', apps.debugPiralDefaults.open)
        .boolean('hmr')
        .describe('hmr', 'Activates Hot Module Reloading (HMR).')
        .default('hmr', apps.debugPiralDefaults.hmr)
        .boolean('optimize-modules')
        .describe('optimize-modules', 'Also includes the node modules for target transpilation.')
        .default('optimize-modules', apps.debugPiralDefaults.optimizeModules)
        .choices('bundler', availableBundlers)
        .describe('bundler', 'Sets the bundler to use.')
        .default('bundler', availableBundlers[0])
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      return apps.debugPiral(args.base as string, {
        entry: args.source as string,
        port: args.port as number,
        hmr: args.hmr as boolean,
        optimizeModules: args['optimize-modules'] as boolean,
        publicUrl: args['public-url'] as string,
        bundlerName: args.bundler as string,
        logLevel: args['log-level'] as LogLevels,
        open: args.open as boolean,
        hooks: args.hooks as object,
        _: args,
      });
    },
  },
  {
    name: 'build-piral',
    alias: ['bundle-piral', 'build-portal', 'bundle-portal'],
    description: 'Creates a production build for a Piral instance.',
    arguments: ['[source]'],
    // "any" due to https://github.com/microsoft/TypeScript/issues/28663 [artifical N = 50]
    flags(argv: any) {
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
        .describe('public-url', 'Sets the public URL (path) of the bundle. Only for release output.')
        .default('public-url', apps.buildPiralDefaults.publicUrl)
        .number('log-level')
        .describe('log-level', 'Sets the log level to use (1-5).')
        .default('log-level', apps.buildPiralDefaults.logLevel)
        .boolean('fresh')
        .describe('fresh', 'Performs a fresh build by removing the target directory first.')
        .default('fresh', apps.buildPiralDefaults.fresh)
        .boolean('minify')
        .describe('minify', 'Performs minification or other post-bundle transformations.')
        .default('minify', apps.buildPiralDefaults.minify)
        .boolean('source-maps')
        .describe('source-maps', 'Create associated source maps for the bundles.')
        .default('source-maps', apps.buildPiralDefaults.sourceMaps)
        .boolean('subdir')
        .describe(
          'subdir',
          `Places the build's output in an appropriate subdirectory (e.g., "emulator"). Ignored for "--all".`,
        )
        .default('subdir', apps.buildPiralDefaults.subdir)
        .boolean('content-hash')
        .describe('content-hash', 'Appends the hash to the side-bundle files.')
        .default('content-hash', apps.buildPiralDefaults.contentHash)
        .boolean('optimize-modules')
        .describe('optimize-modules', 'Also includes the node modules for target transpilation.')
        .default('optimize-modules', apps.buildPiralDefaults.optimizeModules)
        .choices('type', piralBuildTypeKeys)
        .describe('type', 'Selects the target type of the build. "all" builds all target types.')
        .default('type', apps.buildPiralDefaults.type)
        .choices('bundler', availableBundlers)
        .describe('bundler', 'Sets the bundler to use.')
        .default('bundler', availableBundlers[0])
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      return apps.buildPiral(args.base as string, {
        entry: args.source as string,
        target: args.target as string,
        publicUrl: args['public-url'] as string,
        bundlerName: args.bundler as string,
        minify: args.minify as boolean,
        fresh: args.fresh as boolean,
        subdir: args.subdir as boolean,
        contentHash: args['content-hash'] as boolean,
        sourceMaps: args['source-maps'] as boolean,
        optimizeModules: args['optimize-modules'] as boolean,
        logLevel: args['log-level'] as LogLevels,
        type: args.type as PiralBuildType,
        hooks: args.hooks as object,
        _: args,
      });
    },
  },
  {
    name: 'publish-piral',
    alias: ['release-piral', 'release'],
    description: 'Publishes Piral instance build artifacts.',
    arguments: ['[source]'],
    flags(argv) {
      return argv
        .positional('source', {
          type: 'string',
          describe: 'Sets the previously used output directory to publish.',
          default: apps.publishPiralDefaults.source,
        })
        .number('log-level')
        .describe('log-level', 'Sets the log level to use (1-5).')
        .default('log-level', apps.publishPiralDefaults.logLevel)
        .choices('type', piralBuildTypeKeys)
        .describe('type', 'Selects the target type to publish. "all" publishes all target types.')
        .default('type', apps.publishPiralDefaults.type)
        .choices('provider', availableReleaseProviders)
        .describe('provider', 'Sets the provider for publishing the release assets.')
        .default('provider', apps.publishPiralDefaults.provider)
        .option('fields', undefined)
        .describe('fields', 'Sets additional fields to be included in the feed service request.')
        .default('fields', apps.publishPiralDefaults.fields)
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      return apps.publishPiral(args.base as string, {
        source: args.source as string,
        logLevel: args['log-level'] as LogLevels,
        type: args.type as PiralBuildType,
        provider: args.provider as string,
        fields: args.fields as Record<string, string>,
      });
    },
  },
  {
    name: 'declaration-piral',
    alias: ['declare-piral', 'declaration-portal', 'declare-portal'],
    description: 'Creates the TypeScript declaration file (index.d.ts) for a Piral instance.',
    arguments: ['[source]'],
    flags(argv) {
      return argv
        .positional('source', {
          type: 'string',
          describe: 'Sets the source root directory or index.html file for collecting all the information.',
          default: apps.declarationPiralDefaults.entry,
        })
        .string('target')
        .describe('target', 'Sets the target directory for the generated .d.ts file.')
        .default('target', apps.declarationPiralDefaults.target)
        .number('log-level')
        .describe('log-level', 'Sets the log level to use (1-5).')
        .default('log-level', apps.declarationPiralDefaults.logLevel)
        .choices('force-overwrite', forceOverwriteKeys)
        .describe('force-overwrite', 'Determines if files should be overwritten by the command.')
        .default('force-overwrite', keyOfForceOverwrite(apps.declarationPiralDefaults.forceOverwrite))
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      return apps.declarationPiral(args.base as string, {
        entry: args.source as string,
        target: args.target as string,
        forceOverwrite: valueOfForceOverwrite(args['force-overwrite'] as string),
        logLevel: args['log-level'] as LogLevels,
      });
    },
  },
  {
    name: 'new-piral',
    alias: ['create-piral', 'scaffold-piral', 'setup-piral'],
    description: 'Creates a new Piral instance by adding all files and changes to the current project.',
    arguments: ['[target]'],
    // "any" due to https://github.com/microsoft/TypeScript/issues/28663 [artifical N = 50]
    flags(argv: any) {
      return argv
        .positional('target', {
          type: 'string',
          describe: "Sets the project's root directory for making the changes.",
          default: apps.newPiralDefaults.target,
        })
        .string('app')
        .describe('app', "Sets the path to the app's source HTML file.")
        .default('app', apps.newPiralDefaults.app)
        .choices('framework', frameworkKeys)
        .describe('framework', 'Sets the framework/library level to use.')
        .default('framework', apps.newPiralDefaults.framework)
        .boolean('install')
        .describe('install', 'Already performs the installation of its npm dependencies.')
        .default('install', apps.newPiralDefaults.install)
        .string('registry')
        .describe('registry', 'Sets the package registry to use for resolving the dependencies.')
        .default('registry', apps.newPiralDefaults.registry)
        .number('log-level')
        .describe('log-level', 'Sets the log level to use (1-5).')
        .default('log-level', apps.newPiralDefaults.logLevel)
        .string('tag')
        .describe(
          'tag',
          'Sets the tag or version of the package to install. By default, this uses the version of the CLI.',
        )
        .default('tag', apps.newPiralDefaults.version)
        .choices('force-overwrite', forceOverwriteKeys)
        .describe('force-overwrite', 'Determines if files should be overwritten by the installation.')
        .default('force-overwrite', keyOfForceOverwrite(apps.newPiralDefaults.forceOverwrite))
        .choices('language', piletLanguageKeys)
        .describe('language', 'Determines the programming language for the new Piral instance.')
        .default('language', keyOfPiletLanguage(apps.newPiralDefaults.language))
        .string('template')
        .describe('template', 'Sets the boilerplate template package to be used when scaffolding.')
        .default('template', apps.newPiralDefaults.template)
        .choices('npm-client', clientTypeKeys)
        .describe('npm-client', 'Sets the npm client to be used when scaffolding.')
        .default('npm-client', apps.newPiralDefaults.npmClient)
        .choices('bundler', bundlerKeys)
        .describe('bundler', 'Sets the default bundler to install.')
        .default('bundler', apps.newPiralDefaults.bundlerName)
        .option('vars', undefined)
        .describe('vars', 'Sets additional variables to be used when scaffolding.')
        .default('vars', apps.newPiralDefaults.variables)
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      return apps.newPiral(args.base as string, {
        app: args.app as string,
        target: args.target as string,
        framework: args.framework,
        version: args.tag as string,
        registry: args.registry as string,
        forceOverwrite: valueOfForceOverwrite(args['force-overwrite'] as string),
        language: valueOfPiletLanguage(args.language as string),
        install: args.install as boolean,
        template: args.template as string,
        logLevel: args['log-level'] as LogLevels,
        npmClient: args['npm-client'] as NpmClientType,
        bundlerName: args.bundler as string,
        variables: args.vars as Record<string, string>,
      });
    },
  },
  {
    name: 'upgrade-piral',
    alias: ['patch'],
    description: 'Upgrades the Piral instance to the latest version of the used Piral packages.',
    arguments: ['[target-version]'],
    flags(argv) {
      return argv
        .positional('target-version', {
          type: 'string',
          describe: 'Sets the tag or version of Piral to upgrade to. By default, it is "latest".',
          default: apps.upgradePiralDefaults.version,
        })
        .string('target')
        .describe('target', 'Sets the target directory to upgrade. By default, the current directory.')
        .default('target', apps.upgradePiralDefaults.target)
        .number('log-level')
        .describe('log-level', 'Sets the log level to use (1-5).')
        .default('log-level', apps.upgradePiralDefaults.logLevel)
        .boolean('install')
        .describe('install', 'Already performs the update of its npm dependencies.')
        .default('install', apps.upgradePiralDefaults.install)
        .choices('npm-client', clientTypeKeys)
        .describe('npm-client', 'Sets the npm client to be used when upgrading.')
        .default('npm-client', apps.upgradePiralDefaults.npmClient)
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      return apps.upgradePiral(args.base as string, {
        target: args.target as string,
        version: args['target-version'] as string,
        logLevel: args['log-level'] as LogLevels,
        install: args.install as boolean,
        npmClient: args['npm-client'] as NpmClientType,
      });
    },
  },
  {
    name: 'validate-piral',
    alias: ['verify-piral', 'check-piral'],
    description: 'Checks the validity of the current project as a Piral instance.',
    arguments: ['[source]'],
    flags(argv) {
      return argv
        .positional('source', {
          type: 'string',
          describe: 'Sets the source root directory or index.html file for collecting all the information.',
          default: apps.validatePiralDefaults.entry,
        })
        .number('log-level')
        .describe('log-level', 'Sets the log level to use (1-5).')
        .default('log-level', apps.validatePiralDefaults.logLevel)
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      return apps.validatePiral(args.base as string, {
        entry: args.entry as string,
        logLevel: args['log-level'] as LogLevels,
      });
    },
  },
  {
    name: 'debug-pilet',
    alias: ['watch-pilet', 'debug', 'watch'],
    description: 'Starts the debugging process for a pilet using a Piral instance.',
    arguments: ['[source..]'],
    // "any" due to https://github.com/microsoft/TypeScript/issues/28663 [artifical N = 50]
    flags(argv: any) {
      return argv
        .positional('source', {
          type: 'string',
          describe: 'Sets the source file containing the pilet root module.',
          default: apps.debugPiletDefaults.entry,
        })
        .string('target')
        .describe('target', 'Sets the target directory or file of bundling.')
        .default('target', apps.debugPiletDefaults.target)
        .string('public-url')
        .describe('public-url', 'Sets the public URL (path) of the application.')
        .default('public-url', apps.debugPiletDefaults.publicUrl)
        .number('port')
        .describe('port', 'Sets the port of the local development server.')
        .default('port', apps.debugPiletDefaults.port)
        .number('log-level')
        .describe('log-level', 'Sets the log level to use (1-5).')
        .default('log-level', apps.debugPiletDefaults.logLevel)
        .number('concurrency')
        .describe('concurrency', 'Sets the maximum number of concurrent build jobs.')
        .default('concurrency', apps.debugPiletDefaults.concurrency)
        .boolean('open')
        .describe('open', 'Opens the pilet directly in the browser.')
        .default('open', apps.debugPiletDefaults.open)
        .boolean('hmr')
        .describe('hmr', 'Activates Hot Module Reloading (HMR).')
        .default('hmr', apps.debugPiletDefaults.hmr)
        .boolean('optimize-modules')
        .describe('optimize-modules', 'Also includes the node modules for target transpilation.')
        .default('optimize-modules', apps.debugPiletDefaults.optimizeModules)
        .choices('schema', schemaKeys)
        .describe('schema', 'Sets the schema to be used when bundling the pilets.')
        .default('schema', apps.debugPiletDefaults.schemaVersion)
        .choices('bundler', availableBundlers)
        .describe('bundler', 'Sets the bundler to use.')
        .default('bundler', availableBundlers[0])
        .string('app')
        .describe('app', 'Sets the name of the Piral instance.')
        .string('app-dir')
        .describe('app-dir', 'Sets the path to a custom Piral instance for serving.')
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.')
        .string('feed')
        .describe('feed', 'Sets the URL of a pilet feed for including remote pilets.');
    },
    run(args) {
      return apps.debugPilet(args.base as string, {
        entry: args.source as string,
        target: args.target as string,
        publicUrl: args['public-url'] as string,
        port: args.port as number,
        hmr: args.hmr as boolean,
        bundlerName: args.bundler as string,
        optimizeModules: args['optimize-modules'] as boolean,
        appInstanceDir: args['app-dir'] as string,
        app: args.app as string,
        logLevel: args['log-level'] as LogLevels,
        open: args.open as boolean,
        schemaVersion: args.schema as PiletSchemaVersion,
        concurrency: args.concurrency as number,
        feed: args.feed as string,
        hooks: args.hooks as object,
        _: args,
      });
    },
  },
  {
    name: 'build-pilet',
    alias: ['bundle-pilet', 'build', 'bundle'],
    description: 'Creates a production build for a pilet.',
    arguments: ['[source]'],
    // "any" due to https://github.com/microsoft/TypeScript/issues/28663 [artifical N = 50]
    flags(argv: any) {
      return argv
        .positional('source', {
          type: 'string',
          describe: 'Sets the source index.tsx file for collecting all the information.',
          default: apps.buildPiletDefaults.entry,
        })
        .string('target')
        .describe('target', 'Sets the target file of bundling.')
        .default('target', apps.buildPiletDefaults.target)
        .string('public-url')
        .describe('public-url', 'Sets the public URL (path) of the application.')
        .default('public-url', apps.buildPiletDefaults.publicUrl)
        .number('log-level')
        .describe('log-level', 'Sets the log level to use (1-5).')
        .default('log-level', apps.buildPiletDefaults.logLevel)
        .number('concurrency')
        .describe('concurrency', 'Sets the maximum number of concurrent build jobs.')
        .default('concurrency', apps.buildPiletDefaults.concurrency)
        .boolean('source-maps')
        .describe('source-maps', 'Creates source maps for the bundles.')
        .default('source-maps', apps.buildPiletDefaults.sourceMaps)
        .boolean('fresh')
        .describe('fresh', 'Performs a fresh build by removing the target directory first.')
        .default('fresh', apps.buildPiletDefaults.fresh)
        .boolean('minify')
        .describe('minify', 'Performs minification or other post-bundle transformations.')
        .default('minify', apps.buildPiletDefaults.minify)
        .boolean('declaration')
        .describe('declaration', 'Creates a declaration file for the pilet.')
        .default('declaration', apps.buildPiletDefaults.declaration)
        .boolean('content-hash')
        .describe('content-hash', 'Appends the hash to the side-bundle files.')
        .default('content-hash', apps.buildPiletDefaults.contentHash)
        .boolean('optimize-modules')
        .describe('optimize-modules', 'Also includes the node modules for target transpilation.')
        .default('optimize-modules', apps.buildPiletDefaults.optimizeModules)
        .choices('schema', schemaKeys)
        .describe('schema', 'Sets the schema to be used when bundling the pilets.')
        .default('schema', apps.buildPiletDefaults.schemaVersion)
        .choices('bundler', availableBundlers)
        .describe('bundler', 'Sets the bundler to use.')
        .default('bundler', availableBundlers[0])
        .choices('type', piletBuildTypeKeys)
        .describe('type', 'Selects the target type of the build.')
        .default('type', apps.buildPiletDefaults.type)
        .string('app')
        .describe('app', 'Sets the name of the Piral instance.')
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      return apps.buildPilet(args.base as string, {
        entry: args.source as string,
        target: args.target as string,
        publicUrl: args['public-url'] as string,
        minify: args.minify as boolean,
        contentHash: args['content-hash'] as boolean,
        bundlerName: args.bundler as string,
        declaration: args.declaration as boolean,
        sourceMaps: args['source-maps'] as boolean,
        optimizeModules: args['optimize-modules'] as boolean,
        type: args.type as PiletBuildType,
        fresh: args.fresh as boolean,
        logLevel: args['log-level'] as LogLevels,
        schemaVersion: args.schema as PiletSchemaVersion,
        concurrency: args.concurrency as number,
        app: args.app as string,
        hooks: args.hooks as object,
        _: args,
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
        .number('log-level')
        .describe('log-level', 'Sets the log level to use (1-5).')
        .default('log-level', apps.packPiletDefaults.logLevel)
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      return apps.packPilet(args.base as string, {
        source: args.source as string,
        target: args.target as string,
        logLevel: args['log-level'] as LogLevels,
      });
    },
  },
  {
    name: 'publish-pilet',
    alias: ['post-pilet', 'publish'],
    description: 'Publishes a pilet package to a pilet feed.',
    arguments: ['[source]'],
    // "any" due to https://github.com/microsoft/TypeScript/issues/28663 [artifical N = 50]
    flags(argv: any) {
      return argv
        .positional('source', {
          type: 'string',
          describe: 'Sets the source of either the previously packed *.tgz bundle or the pilet root module to publish.',
        })
        .string('url')
        .describe('url', 'Sets the explicit URL where to publish the pilet to.')
        .default('url', apps.publishPiletDefaults.url)
        .string('api-key')
        .describe('api-key', 'Sets the potential API key to send to the service.')
        .default('api-key', apps.publishPiletDefaults.apiKey)
        .string('ca-cert')
        .describe('ca-cert', 'Sets a custom certificate authority to use, if any.')
        .default('ca-cert', apps.publishPiletDefaults.cert)
        .number('log-level')
        .describe('log-level', 'Sets the log level to use (1-5).')
        .default('log-level', apps.publishPiletDefaults.logLevel)
        .boolean('fresh')
        .describe('fresh', 'Performs a fresh build, then packages and finally publishes the pilet.')
        .default('fresh', apps.publishPiletDefaults.fresh)
        .choices('schema', schemaKeys)
        .describe('schema', 'Sets the schema to be used when making a fresh build of the pilet.')
        .default('schema', apps.publishPiletDefaults.schemaVersion)
        .choices('mode', publishModeKeys)
        .describe('mode', 'Sets the authorization mode to use.')
        .default('mode', apps.publishPiletDefaults.mode)
        .choices('bundler', availableBundlers)
        .describe('bundler', 'Sets the bundler to use.')
        .default('bundler', availableBundlers[0])
        .choices('from', fromKeys)
        .describe('from', 'Sets the type of the source to use for publishing.')
        .default('from', apps.publishPiletDefaults.from)
        .option('fields', undefined)
        .describe('fields', 'Sets additional fields to be included in the feed service request.')
        .default('fields', apps.publishPiletDefaults.fields)
        .option('headers', undefined)
        .describe('headers', 'Sets additional headers to be included in the feed service request.')
        .default('headers', apps.publishPiletDefaults.headers)
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      return apps.publishPilet(args.base as string, {
        source: args.source as string,
        apiKey: args['api-key'] as string,
        url: args.url as string,
        logLevel: args['log-level'] as LogLevels,
        cert: args['ca-cert'] as string,
        bundlerName: args.bundler as string,
        fresh: args.fresh as boolean,
        from: args.from as PiletPublishSource,
        schemaVersion: args.schema as PiletSchemaVersion,
        fields: args.fields as Record<string, string>,
        headers: args.headers as Record<string, string>,
        mode: args.mode as PiletPublishScheme,
        _: args,
      });
    },
  },
  {
    name: 'new-pilet',
    alias: ['create-pilet', 'scaffold-pilet', 'scaffold', 'new', 'create'],
    description: 'Scaffolds a new pilet for a specified Piral instance.',
    arguments: ['[source]'],
    // "any" due to https://github.com/microsoft/TypeScript/issues/28663 [artifical N = 50]
    flags(argv: any) {
      return argv
        .positional('source', {
          type: 'string',
          describe:
            'Sets the source package (potentially incl. its tag/version) containing a Piral instance for templating the scaffold process.',
          default: apps.newPiletDefaults.source,
        })
        .string('target')
        .describe('target', 'Sets the target directory for scaffolding. By default, the current directory.')
        .default('target', apps.newPiletDefaults.target)
        .string('registry')
        .describe('registry', 'Sets the package registry to use for resolving the specified Piral app.')
        .default('registry', apps.newPiletDefaults.registry)
        .boolean('install')
        .describe('install', 'Already performs the installation of its npm dependencies.')
        .default('install', apps.newPiletDefaults.install)
        .choices('force-overwrite', forceOverwriteKeys)
        .describe('force-overwrite', 'Determines if files should be overwritten by the scaffolding.')
        .default('force-overwrite', keyOfForceOverwrite(apps.newPiletDefaults.forceOverwrite))
        .number('log-level')
        .describe('log-level', 'Sets the log level to use (1-5).')
        .default('log-level', apps.newPiletDefaults.logLevel)
        .choices('language', piletLanguageKeys)
        .describe('language', 'Determines the programming language for the new pilet.')
        .default('language', keyOfPiletLanguage(apps.newPiletDefaults.language))
        .string('template')
        .describe('template', 'Sets the boilerplate template package to be used when scaffolding.')
        .default('template', apps.newPiletDefaults.template)
        .choices('npm-client', clientTypeKeys)
        .describe('npm-client', 'Sets the npm client to be used when scaffolding.')
        .default('npm-client', apps.newPiletDefaults.npmClient)
        .choices('bundler', bundlerKeys)
        .describe('bundler', 'Sets the default bundler to install.')
        .default('bundler', apps.newPiletDefaults.bundlerName)
        .option('vars', undefined)
        .describe('vars', 'Sets additional variables to be used when scaffolding.')
        .default('vars', apps.newPiletDefaults.variables)
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      return apps.newPilet(args.base as string, {
        target: args.target as string,
        source: args.source as string,
        registry: args.registry as string,
        forceOverwrite: valueOfForceOverwrite(args['force-overwrite'] as string),
        language: valueOfPiletLanguage(args.language as string),
        logLevel: args['log-level'] as LogLevels,
        install: args.install as boolean,
        template: args.template as string,
        npmClient: args['npm-client'] as NpmClientType,
        bundlerName: args.bundler as string,
        variables: args.vars as Record<string, string>,
      });
    },
  },
  {
    name: 'upgrade-pilet',
    alias: ['upgrade'],
    description: 'Upgrades an existing pilet to the latest version of the used Piral instance.',
    arguments: ['[target-version]'],
    flags(argv) {
      return argv
        .positional('target-version', {
          type: 'string',
          describe: 'Sets the tag or version of the Piral instance to upgrade to. By default, it is "latest".',
          default: apps.upgradePiletDefaults.version,
        })
        .string('target')
        .describe('target', 'Sets the target directory to upgrade. By default, the current directory.')
        .default('target', apps.upgradePiletDefaults.target)
        .number('log-level')
        .describe('log-level', 'Sets the log level to use (1-5).')
        .default('log-level', apps.upgradePiletDefaults.logLevel)
        .boolean('install')
        .describe('install', 'Already performs the update of its npm dependencies.')
        .default('install', apps.upgradePiletDefaults.install)
        .choices('force-overwrite', forceOverwriteKeys)
        .describe('force-overwrite', 'Determines if files should be overwritten by the upgrading process.')
        .default('force-overwrite', keyOfForceOverwrite(apps.upgradePiletDefaults.forceOverwrite))
        .choices('npm-client', clientTypeKeys)
        .describe('npm-client', 'Sets the npm client to be used when upgrading.')
        .default('npm-client', apps.upgradePiletDefaults.npmClient)
        .option('vars', undefined)
        .describe('vars', 'Sets additional variables to be used when scaffolding.')
        .default('vars', apps.upgradePiletDefaults.variables)
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      return apps.upgradePilet(args.base as string, {
        target: args.target as string,
        version: args['target-version'] as string,
        logLevel: args['log-level'] as LogLevels,
        forceOverwrite: valueOfForceOverwrite(args['force-overwrite'] as string),
        install: args.install as boolean,
        npmClient: args['npm-client'] as NpmClientType,
        variables: args.vars as Record<string, string>,
      });
    },
  },
  {
    name: 'validate-pilet',
    alias: ['verify-pilet', 'check-pilet', 'lint-pilet', 'assert-pilet'],
    description: 'Checks the validity of the current pilet according to the rules defined by the Piral instance.',
    arguments: ['[source]'],
    flags(argv) {
      return argv
        .positional('source', {
          type: 'string',
          describe: 'Sets the source file containing the pilet root module.',
          default: apps.validatePiletDefaults.entry,
        })
        .number('log-level')
        .describe('log-level', 'Sets the log level to use (1-5).')
        .default('log-level', apps.validatePiletDefaults.logLevel)
        .string('app')
        .describe('app', 'Sets the name of the Piral instance.')
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      return apps.validatePilet(args.base as string, {
        entry: args.entry as string,
        logLevel: args['log-level'] as LogLevels,
        app: args.app as string,
      });
    },
  },
];

class Commands implements ListCommands {
  public all = allCommands;

  public get pilet() {
    return specializeCommands('-pilet');
  }

  public get piral() {
    return specializeCommands('-piral');
  }
}

export const commands = new Commands();
