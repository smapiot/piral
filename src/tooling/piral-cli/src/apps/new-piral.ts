import { resolve, basename } from 'path';
import { LogLevels, TemplateType, Framework, NpmClientType } from '../types';
import {
  ForceOverwrite,
  PiletLanguage,
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
} from '../common';

export interface NewPiralOptions {
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
  language?: PiletLanguage;

  /**
   * States if the npm dependecies should be installed when scaffolding.
   */
  install?: boolean;

  /**
   * Sets the boilerplate template to be used when scaffolding.
   */
  template?: TemplateType;

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
  bundler?: string;
}

export const newPiralDefaults: NewPiralOptions = {
  app: './src/index.html',
  framework: 'piral',
  target: '.',
  version: 'latest',
  forceOverwrite: ForceOverwrite.no,
  language: PiletLanguage.ts,
  install: true,
  template: 'default',
  logLevel: LogLevels.info,
  npmClient: undefined,
  bundler: 'none',
};

export async function newPiral(baseDir = process.cwd(), options: NewPiralOptions = {}) {
  const {
    app = newPiralDefaults.app,
    framework = newPiralDefaults.framework,
    target = newPiralDefaults.target,
    version = newPiralDefaults.version,
    forceOverwrite = newPiralDefaults.forceOverwrite,
    language = newPiralDefaults.language,
    install = newPiralDefaults.install,
    template = newPiralDefaults.template,
    logLevel = newPiralDefaults.logLevel,
    bundler = newPiralDefaults.bundler,
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

    await updateExistingJson(root, 'package.json', getPiralPackage(app, language, version, framework, bundler));

    progress(`Installing NPM package ${packageRef} ...`);

    await installPackage(npmClient, packageRef, root);

    progress(`Taking care of templating ...`);

    await scaffoldPiralSourceFiles(template, language, root, app, framework, forceOverwrite);

    if (install) {
      progress(`Installing dependencies ...`);
      await installDependencies(npmClient, root);
    }

    logDone(`Piral instance scaffolded successfully!`);
  } else {
    fail('cannotCreateDirectory_0044');
  }
}
