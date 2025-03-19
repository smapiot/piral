import { resolve, basename } from 'path';
import { SourceLanguage, LogLevels, NpmClientType } from '../types';
import {
  ForceOverwrite,
  createDirectory,
  createFileIfNotExists,
  copyPiralFiles,
  patchPiletPackage,
  scaffoldPiletSourceFiles,
  installNpmDependencies,
  readPiralPackage,
  getPiletsInfo,
  runScript,
  checkAppShellPackage,
  setLogLevel,
  fail,
  progress,
  log,
  logDone,
  determineNpmClient,
  copyScaffoldingFiles,
  getPiralPath,
  getPiletScaffoldData,
  config,
  initNpmProject,
  cliVersion,
  installPiralInstance,
  piletJson,
  defaultSchemaVersion,
  piletJsonSchemaUrl,
  ensure,
  getCertificate,
  getAgent,
} from '../common';

export interface NewPiletOptions {
  /**
   * The package registry to use for resolving the specified Piral app.
   */
  registry?: string;

  /**
   * The target directory for scaffolding. By default, the current directory.
   */
  target?: string;

  /**
   * The source package containing a Piral instance for templating the scaffold process.
   */
  source?: string;

  /**
   * Defines a custom certificate for the website emulator.
   */
  cert?: string;

  /**
   * Allow self-signed certificates.
   */
  allowSelfSigned?: boolean;

  /**
   * Determines if files should be overwritten by the scaffolding.
   */
  forceOverwrite?: ForceOverwrite;

  /**
   * Determines the programming language for the new pilet.
   * @example 'ts'
   */
  language?: SourceLanguage;

  /**
   * States if the npm dependencies should be installed when scaffolding.
   */
  install?: boolean;

  /**
   * Sets the boilerplate template to be used when scaffolding.
   * @example 'empty'
   */
  template?: string;

  /**
   * Sets the log level to use (1-5).
   */
  logLevel?: LogLevels;

  /**
   * The npm client to be used when scaffolding.
   * @example 'yarn'
   */
  npmClient?: NpmClientType;

  /**
   * Sets the default bundler to install.
   * @example 'parcel'
   */
  bundlerName?: string;

  /**
   * Places additional variables that should used when scaffolding.
   */
  variables?: Record<string, string>;

  /**
   * Sets Pilet's name
   */
  name?: string;
}

export const newPiletDefaults: NewPiletOptions = {
  target: '.',
  registry: config.registry,
  source: undefined,
  forceOverwrite: ForceOverwrite.no,
  language: config.language,
  install: true,
  template: undefined,
  logLevel: LogLevels.info,
  npmClient: undefined,
  bundlerName: 'none',
  variables: {},
  name: undefined,
  cert: undefined,
  allowSelfSigned: config.allowSelfSigned,
};

export async function newPilet(baseDir = process.cwd(), options: NewPiletOptions = {}) {
  const {
    target = newPiletDefaults.target,
    registry = newPiletDefaults.registry,
    source = newPiletDefaults.source,
    forceOverwrite = newPiletDefaults.forceOverwrite,
    language = newPiletDefaults.language,
    install = newPiletDefaults.install,
    template = newPiletDefaults.template,
    logLevel = newPiletDefaults.logLevel,
    bundlerName = newPiletDefaults.bundlerName,
    variables = newPiletDefaults.variables,
    npmClient: defaultNpmClient = newPiletDefaults.npmClient,
    name = newPiletDefaults.name,
    cert = newPiletDefaults.cert,
    allowSelfSigned = newPiletDefaults.allowSelfSigned,
  } = options;

  ensure('baseDir', baseDir, 'string');
  ensure('source', source, 'string');
  ensure('target', target, 'string');
  ensure('template', template, ['string', 'undefined']);
  ensure('variables', variables, 'object');

  const fullBase = resolve(process.cwd(), baseDir);
  const root = resolve(fullBase, target);
  setLogLevel(logLevel);
  progress('Preparing source and target ...');
  const success = await createDirectory(root);

  if (success) {
    const npmClient = await determineNpmClient(root, defaultNpmClient);
    const ca = await getCertificate(cert);
    const agent = getAgent({ ca, allowSelfSigned });
    const projectName = name || basename(root);

    progress(`Scaffolding new pilet in %s ...`, root);

    await createFileIfNotExists(
      root,
      'package.json',
      JSON.stringify(
        {
          name: projectName,
          version: '1.0.0',
          description: '',
          keywords: ['pilet'],
          dependencies: {},
          devDependencies: {},
          peerDependencies: {},
          scripts: {},
          main: 'dist/index.js',
          files: ['dist'],
        },
        undefined,
        2,
      ),
    );

    await initNpmProject(npmClient, projectName, root);

    if (registry !== newPiletDefaults.registry) {
      progress(`Setting up npm registry (%s) ...`, registry);

      await createFileIfNotExists(
        root,
        '.npmrc',
        `registry=${registry}
always-auth=true`,
        forceOverwrite,
      );
    }

    await createFileIfNotExists(
      root,
      piletJson,
      JSON.stringify(
        {
          $schema: piletJsonSchemaUrl,
          schemaVersion: defaultSchemaVersion,
          piralInstances: {},
        },
        undefined,
        2,
      ),
    );

    const sourceName = source || `empty-piral@${cliVersion}`;
    const packageName = await installPiralInstance(sourceName, fullBase, root, npmClient, agent, true);
    const piralInfo = await readPiralPackage(root, packageName);
    const isEmulator = checkAppShellPackage(piralInfo);
    const { preScaffold, postScaffold, files, template: preSelectedTemplate } = getPiletsInfo(piralInfo);

    if (preScaffold) {
      progress(`Running preScaffold script ...`);
      log('generalDebug_0003', `Run: ${preScaffold}`);
      await runScript(preScaffold, root);
    }

    progress(`Taking care of templating ...`);

    const data = getPiletScaffoldData(language, root, packageName, variables);

    await patchPiletPackage(root, piralInfo, isEmulator, npmClient, {
      language,
      bundler: bundlerName,
    });

    const chosenTemplate = template || preSelectedTemplate || 'default';
    await scaffoldPiletSourceFiles(chosenTemplate, registry, data, forceOverwrite);

    if (isEmulator) {
      // in the emulator case we get the files (and files_once) from the contained tarballs
      await copyPiralFiles(root, packageName, piralInfo, ForceOverwrite.yes, data);
    } else {
      // otherwise, we perform the same action as in the emulator creation
      // just with a different target; not a created directory, but the root
      const packageRoot = getPiralPath(root, packageName);
      await copyScaffoldingFiles(packageRoot, root, files, piralInfo, data);
    }

    if (install) {
      progress(`Installing dependencies ...`);
      await installNpmDependencies(npmClient, root);
    }

    if (postScaffold) {
      progress(`Running postScaffold script ...`);
      log('generalDebug_0003', `Run: ${postScaffold}`);
      await runScript(postScaffold, root);
    }

    logDone(`Pilet scaffolded successfully!`);
  } else {
    fail('cannotCreateDirectory_0044');
  }
}
