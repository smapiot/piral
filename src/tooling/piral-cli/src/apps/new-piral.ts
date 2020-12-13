import { resolve, basename } from 'path';
import { LogLevels, Framework, NpmClientType } from '../types';
import {
  ForceOverwrite,
  SourceLanguage,
  installPackage,
  updateExistingJson,
  getPiralPackage,
  scaffoldPiralSourceFiles,
  createDirectory,
  createFileIfNotExists,
  logDone,
  installDependencies,
  combinePackageRef,
  setLogLevel,
  fail,
  progress,
  determineNpmClient,
  defaultRegistry,
  cliVersion,
} from '../common';

export interface NewPiralOptions {
  /**
   * The package registry to use for resolving the specified Piral app.
   */
  registry?: string;

  /**
   * Sets the path to the app's source HTML file.
   */
  app?: string;

  /**
   * Sets the framework/library to use.
   */
  framework?: Framework;

  /**
   * Sets the target directory where the generated files should be placed.
   */
  target?: string;

  /**
   * The initial version that will also be written into the package.json
   */
  version?: string;

  /**
   * Determines if files should be overwritten by the installation.
   */
  forceOverwrite?: ForceOverwrite;

  /**
   * Determines the programming language for the new Piral instance. (e.g. 'ts')
   */
  language?: SourceLanguage;

  /**
   * States if the npm dependecies should be installed when scaffolding.
   */
  install?: boolean;

  /**
   * Sets the boilerplate template to be used when scaffolding.
   */
  template?: string;

  /**
   * The log level that should be used within the scaffolding process.
   */
  logLevel?: LogLevels;

  /**
   * Sets the NPM client to be used when scaffolding. (e.g. 'yarn')
   */
  npmClient?: NpmClientType;

  /**
   * Sets the default bundler to install. (e.g. 'parcel').
   */
  bundlerName?: string;

  /**
   * Places additional variables that should used when scaffolding.
   */
  variables?: Record<string, string>;
}

export const newPiralDefaults: NewPiralOptions = {
  app: './src/index.html',
  registry: defaultRegistry,
  framework: 'piral',
  target: '.',
  version: cliVersion,
  forceOverwrite: ForceOverwrite.no,
  language: SourceLanguage.ts,
  install: true,
  template: 'default',
  logLevel: LogLevels.info,
  npmClient: undefined,
  bundlerName: 'none',
  variables: {},
};

export async function newPiral(baseDir = process.cwd(), options: NewPiralOptions = {}) {
  const {
    app = newPiralDefaults.app,
    registry = newPiralDefaults.registry,
    framework = newPiralDefaults.framework,
    target = newPiralDefaults.target,
    version = newPiralDefaults.version,
    forceOverwrite = newPiralDefaults.forceOverwrite,
    language = newPiralDefaults.language,
    install = newPiralDefaults.install,
    template = newPiralDefaults.template,
    logLevel = newPiralDefaults.logLevel,
    bundlerName = newPiralDefaults.bundlerName,
    variables = newPiralDefaults.variables,
  } = options;
  setLogLevel(logLevel);
  progress('Preparing source and target ...');
  const root = resolve(baseDir, target);
  const success = await createDirectory(root);

  if (success) {
    const npmClient = await determineNpmClient(root, options.npmClient);
    const packageRef = combinePackageRef(framework, version, 'registry');

    progress(`Creating a new Piral instance in %s ...`, root);

    await createFileIfNotExists(
      root,
      'package.json',
      JSON.stringify(
        {
          name: basename(root),
          version: '1.0.0',
          description: '',
          keywords: ['piral'],
          dependencies: {},
          scripts: {},
        },
        undefined,
        2,
      ),
    );

    if (registry !== newPiralDefaults.registry) {
      progress(`Setting up NPM registry (%s) ...`, registry);

      await createFileIfNotExists(
        root,
        '.npmrc',
        `registry=${registry}
always-auth=true`,
        forceOverwrite,
      );
    }

    await updateExistingJson(root, 'package.json', getPiralPackage(app, language, version, framework, bundlerName));

    progress(`Installing NPM package ${packageRef} ...`);

    await installPackage(npmClient, packageRef, root);

    progress(`Taking care of templating ...`);

    await scaffoldPiralSourceFiles(template, registry, language, root, app, framework, forceOverwrite, variables);

    if (install) {
      progress(`Installing dependencies ...`);
      await installDependencies(npmClient, root);
    }

    logDone(`Piral instance scaffolded successfully!`);
  } else {
    fail('cannotCreateDirectory_0044');
  }
}
