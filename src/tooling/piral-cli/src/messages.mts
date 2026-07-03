import { QuickMessage, LogLevels } from './types';

/**
 * @kind Info
 *
 * @summary
 * General information without further content.
 *
 * @abstract
 * Printed to inform you about certain progress in the current command.
 *
 * @see
 * - [Node Console](https://nodejs.org/api/console.html)
 *
 * @example
 * Nothing of interest yet.
 */
export function generalInfo_0000(message: string): QuickMessage {
  return [LogLevels.info, '0000', message];
}

/**
 * @kind Warning
 *
 * @summary
 * General warning without further content.
 *
 * @abstract
 * Printed to inform you about a potential problem that may require
 * changes to your project.
 *
 * @see
 * - [Node Console](https://nodejs.org/api/console.html)
 *
 * @example
 * Nothing of interest yet.
 */
export function generalWarning_0001(message: string): QuickMessage {
  return [LogLevels.warning, '0001', message];
}

/**
 * @kind Error
 *
 * @summary
 * General error without further content.
 *
 * @abstract
 * Printed to inform you about a problem that requires changes to
 * your project.
 *
 * @see
 * - [Node Console](https://nodejs.org/api/console.html)
 *
 * @example
 * Nothing of interest yet.
 */
export function generalError_0002(message: string): QuickMessage {
  return [LogLevels.error, '0002', message];
}

/**
 * @kind Debug
 *
 * @summary
 * General debug message without further content.
 *
 * @abstract
 * Printed to give some indication about the application's current
 * progress and state.
 *
 * @see
 * - [Node Console](https://nodejs.org/api/console.html)
 *
 * @example
 * Nothing of interest yet.
 */
export function generalDebug_0003(message: string): QuickMessage {
  return [LogLevels.debug, '0003', message];
}

/**
 * @kind Verbose
 *
 * @summary
 * General info message without further content.
 *
 * @abstract
 * Printed to inform you about some more detailed progress in the
 * application.
 *
 * @see
 * - [Node Console](https://nodejs.org/api/console.html)
 *
 * @example
 * Nothing of interest yet.
 */
export function generalVerbose_0004(message: string): QuickMessage {
  return [LogLevels.verbose, '0004', message];
}

/**
 * @kind Error
 *
 * @summary
 * Reported when the Piral instance defined in the package.json could not be found.
 *
 * @abstract
 * The Piral instance is defined in the package.json via an object set as value of the "piral" key.
 *
 * The resolution of the Piral instance is done via the `require.resolve` function of Node.js. Thus, if the defined module is simply not yet installed this error will be shown.
 *
 * @see
 * - [npm i](https://docs.npmjs.com/cli/install)
 * - [npm install is missing modules](https://stackoverflow.com/questions/24652681/npm-install-is-missing-modules)
 *
 * @example
 * Assuming that the available package.json of your pilet contains content such as:
 *
 * ```json
 * {
 *   "name": "my-pilet",
 *   // ...
 *   "piral": {
 *     "name": "my-app-shell"
 *   }
 * }
 * ```
 *
 * However, running
 *
 * ```sh
 * ls node_modules/my-app-shell
 * ```
 *
 * returns an error.
 *
 * To mitigate it try running
 *
 * ```sh
 * npm i
 * ```
 *
 * which will install all dependencies.
 */
export function appInstanceNotFound_0010(name: string): QuickMessage {
  return [LogLevels.error, '0010', `The defined Piral instance ("${name}") could not be found.`];
}

/**
 * @kind Error
 *
 * @summary
 * Reported when the Piral instance defined in the package.json seems invalid.
 *
 * @abstract
 * There are a couple of properties that need to be fulfilled by a valid Piral instance.
 * An important property is that the package.json contains an "app" field.
 *
 * The app field denotes the entry point of the Piral instance for bundling purposes.
 * It should be an HTML file.
 *
 * @see
 * - [Parcel HTML Asset](https://parceljs.org/languages/html/)
 *
 * @example
 * Make sure the package.json of the Piral instance is valid (has an "app" field).
 *
 * This could look as follows:
 *
 * ```json
 * {
 *   "name": "my-piral",
 *   // ...
 *   "app": "src/index.html"
 * }
 * ```
 */
export function appInstanceInvalid_0011(): QuickMessage {
  return [LogLevels.error, '0011', `Could not find a valid Piral instance.`];
}

/**
 * @kind Error
 *
 * @summary
 * Reported when no valid Piral instance was specified.
 *
 * @abstract
 * The Piral instance is defined either in the package.json or in the pilet.json.
 *
 * The resolution of the Piral instance is done via the `require.resolve` function of Node.js. Thus, if the defined module is simply not yet installed this error will be shown.
 *
 * @see
 * - [npm i](https://docs.npmjs.com/cli/install)
 * - [npm install is missing modules](https://stackoverflow.com/questions/24652681/npm-install-is-missing-modules)
 *
 * @example
 * Assuming that the available pilet.json of your pilet contains content such as:
 *
 * ```json
 * {
 *   // ...
 *   "piralInstances": {
 *     "my-app-shell": {}
 *   }
 * }
 * ```
 *
 * However, running
 *
 * ```sh
 * ls node_modules/my-app-shell
 * ```
 *
 * returns an error.
 *
 * To mitigate it try running
 *
 * ```sh
 * npm i
 * ```
 *
 * which will install all dependencies.
 */
export function appInstancesNotGiven_0012(): QuickMessage {
  return [LogLevels.error, '0012', `No Piral instances have been provided.`];
}

/**
 * @kind Error
 *
 * @summary
 * No valid package.json found
 *
 * @abstract
 * For performing this action on the pilet more information is required, which should come from
 * the project's package.json.
 *
 * To operate correctly the piral-cli needs to read information provided in the package.json.
 * Unfortunately, in the given scenario no package.json was found, or the contents of the found
 * package.json have not met the expected standard.
 *
 * Make sure to operate the piral-cli only in a valid Node.js project folder. A valid Node.js
 * project folder has a package.json in its root.
 *
 * @see
 * - [npm Package Specification](https://docs.npmjs.com/files/package.json)
 *
 * @example
 * You can see if you are currently in a correct folder.
 *
 * ```sh
 * ls package.json
 * ```
 *
 * If nothing is displayed make sure to either change to the right directory, or to start a new
 * project using:
 *
 * ```sh
 * npm init
 * ```
 *
 * If you want to start directly with a pilet just use the following command:
 *
 * ```sh
 * npm init pilet
 * ```
 */
export function packageJsonNotFound_0020(): QuickMessage {
  return [LogLevels.error, '0020', `No valid package.json could be found.`];
}

/**
 * @kind Error
 *
 * @summary
 * Cannot pack the pilet - missing name.
 *
 * @abstract
 * For performing this action on the pilet the piral-cli needs to know the name of the pilet.
 * The name of the pilet is provided by the name field specified in its package.json.
 *
 * A valid package.json file requires a valid name. The name has to follow standard naming
 * conventions of the npm system.
 *
 * @see
 * - [Package Naming Guidelines](https://docs.npmjs.com/package-name-guidelines)
 *
 * @example
 * Check the contents of the available package.json:
 *
 * ```sh
 * cat package.json
 * ```
 *
 * The displayed content should look similar to:
 *
 * ```json
 * {
 *   "name": "my-pilet",
 *   "version": "1.0.0",
 *   "dependencies": {},
 *   "devDependencies": {
 *     "piral-cli": "^0.11.0",
 *     "my-piral": "1.0.0"
 *   },
 *   "piral": {
 *     "name": "my-piral",
 *     "tooling": "0.11.0"
 *   }
 * }
 * ```
 *
 * The exact values do not matter much, but rather the general structure.
 */
export function packageJsonMissingName_0021(): QuickMessage {
  return [LogLevels.error, '0021', `Cannot pack the pilet - missing name.`];
}

/**
 * @kind Error
 *
 * @summary
 * Cannot pack the pilet - missing version.
 *
 * @abstract
 * For performing this action on the pilet the piral-cli needs to know the version of the pilet.
 * The version of the pilet is provided by the version field specified in its package.json.
 *
 * A valid package.json file requires a valid version. The version has to follow standard semver
 * specification.
 *
 * @see
 * - [npm on Semantic Versioning](https://docs.npmjs.com/about-semantic-versioning)
 *
 * @example
 * Check the contents of the available package.json:
 *
 * ```sh
 * cat package.json
 * ```
 *
 * The displayed content should look similar to:
 *
 * ```json
 * {
 *   "name": "my-pilet",
 *   "version": "1.0.0",
 *   "dependencies": {},
 *   "devDependencies": {
 *     "piral-cli": "^0.11.0",
 *     "my-piral": "1.0.0"
 *   },
 *   "piral": {
 *     "name": "my-piral",
 *     "tooling": "0.11.0"
 *   }
 * }
 * ```
 *
 * The exact values do not matter much, but rather the general structure.
 */
export function packageJsonMissingVersion_0022(): QuickMessage {
  return [LogLevels.error, '0022', `Cannot pack the pilet - missing version.`];
}

/**
 * @kind Warning
 *
 * @summary
 * Cannot pack the package.
 *
 * @abstract
 * For updating a Piral instance the packages have to be installed. Otherwise,
 * it is impossible for the Piral CLI to detect what packages need to be updated
 * and which ones can remain at their current version.
 *
 * @see
 * - [npm Install](https://docs.npmjs.com/cli/install)
 *
 * @example
 * Check that the package is indeed installed:
 *
 * ```sh
 * cat node_modules/{missing-package}/package.json
 * ```
 *
 * The displayed content should look similar to:
 *
 * ```json
 * {
 *   "name": "missing package",
 *   "version": "1.0.0",
 *   "dependencies": {},
 *   "devDependencies": {}
 * }
 * ```
 *
 * The exact values do not matter much, but rather that the file is found at all.
 */
export function packageNotInstalled_0023(name: string): QuickMessage {
  return [LogLevels.warning, '0023', `Cannot find the package "${name}". Skipping.`];
}

/**
 * @kind Error
 *
 * @summary
 * The desired version is invalid.
 *
 * @abstract
 * For updating a Piral instance the provided version must be a valid version
 * identifier (e.g., 0.10.0) or a valid tag (e.g., latest).
 *
 * Before an update is performed the desired version is checked with the available
 * versions. If no release for the given version was found then an error is emitted.
 *
 * @see
 * - [StackOverflow Listing npm Versions](https://stackoverflow.com/questions/41415945/how-to-list-all-versions-of-an-npm-module)
 *
 * @example
 * Check that the version is valid:
 *
 * ```sh
 * npm show piral-cli version --tag 0.10.10
 * ```
 *
 * The result has to be a valid version answer. In the given example there is no
 * response, so it is empty. A valid response appear for:
 *
 * ```sh
 * npm show piral-cli version --tag 0.10.9
 * ```
 *
 * Here the answer is 0.10.9.
 */
export function packageVersionInvalid_0024(version: string): QuickMessage {
  return [LogLevels.error, '0024', `The given package version "${version}" is invalid.`];
}

/**
 * @kind Error
 *
 * @summary
 * Cannot add the shared dependency since its version constraint is not satisfied.
 *
 * @abstract
 * The importmap definition allows you to define a version specifier separated with
 * the '@' character. If you write down a version specifier then it has to be
 * fulfilled already from the local version, otherwise the packaged version can
 * potentially not be resolved at runtime. This would resolve in a pilet that fails
 * when running in isolation and most likely fails when running with other pilets.
 *
 * @see
 * - [import-maps specification](https://github.com/WICG/import-maps)
 *
 * @example
 * Check the contents of the available package.json:
 *
 * ```sh
 * cat package.json
 * ```
 *
 * The displayed content should look similar to (i.e., contain an importmap such as):
 *
 * ```json
 * {
 *   "importmap": {
 *     "imports": {
 *       "foo@^3.2.1": "foo"
 *     }
 *   }
 * }
 * ```
 *
 * For the error to occur the specifier (^3.2.1) potentially does not match the version (e.g., if
 * the version of the dependency is 3.1.2).
 *
 * One strategy is to remove the specifier, which will automatically use the exact current version
 * as specifier:
 *
 * ```json
 * {
 *   "importmap": {
 *     "imports": {
 *       "foo": "foo"
 *     }
 *   }
 * }
 * ```
 *
 * The best way, however, is to look at the used version and adjust the specifier to be correct again.
 * Alternatively, change the used version to satisfy the constraint again.
 */
export function importMapVersionSpecNotSatisfied_0025(
  depName: string,
  availableVersion: string,
  specVersion: string,
): QuickMessage {
  return [
    LogLevels.error,
    '0025',
    `The dependency "${depName}" is locally installed in version "${availableVersion}", but specified as "${specVersion}".`,
  ];
}

/**
 * @kind Error
 *
 * @summary
 * The version spec part of the importmap identifer is invalid.
 *
 * @abstract
 * The importmap definition allows you to define a version specifier separated with
 * the '@' character. This part has to follow the semver convention and rules.
 *
 * Check your specifier via online tools such as "Semver check" to verify it is
 * valid and follows the semver specification.
 *
 * @see
 * - [Online Checker](https://jubianchi.github.io/semver-check/)
 *
 * @example
 * Check the contents of the available package.json:
 *
 * ```sh
 * cat package.json
 * ```
 *
 * The displayed content should look similar to (i.e., contain an importmap such as):
 *
 * ```json
 * {
 *   "importmap": {
 *     "imports": {
 *       "foo@bar": "foo"
 *     }
 *   }
 * }
 * ```
 *
 * For the error to occur the specifier (bar) is not following the semver specification.
 *
 * One way is to remove the version spec, which will resolve to an exact version specifier
 * and therefore always works:
 *
 * ```json
 * {
 *   "importmap": {
 *     "imports": {
 *       "foo": "foo"
 *     }
 *   }
 * }
 * ```
 *
 * The best way, however, is to look at the used version and adjust the specifier to be correct again,
 * such as "^1.2.3" or "1.x" or "3" etc.
 */
export function importMapVersionSpecInvalid_0026(depName: string): QuickMessage {
  return [LogLevels.error, '0026', `The dependency "${depName}" has an invalid version spec.`];
}

/**
 * @kind Error
 *
 * @summary
 * The provided importmap reference could not be resolved.
 *
 * @abstract
 * The importmap consists of keys and values. The keys represent the packages names and optional
 * version specifiers to demand at runtime. The values represent the entry point or URL to use
 * when the dependency is not yet loaded.
 *
 * In case of a non-URL value the reference has either to be a valid package name or a file path
 * that leads to either a package or valid JS module. Either way, it needs to exist. If the path
 * is invalid an error will be emitted.
 *
 * @see
 * - [npm Install](https://docs.npmjs.com/cli/install)
 *
 * @example
 * Check the contents of the available package.json:
 *
 * ```sh
 * cat package.json
 * ```
 *
 * The displayed content should look similar to (i.e., contain an importmap such as):
 *
 * ```json
 * {
 *   "importmap": {
 *     "imports": {
 *       "foo@bar": "./node_modules/prect"
 *     }
 *   }
 * }
 * ```
 *
 * Note the potential misspelling. It maybe should have been "./node_modules/preact". In such
 * cases the reference may not be resolved locally. If everything was written correctly the
 * node modules are most likely not installed (correctly).
 */
export function importMapReferenceNotFound_0027(dir: string, reference: string): QuickMessage {
  return [
    LogLevels.error,
    '0027',
    `The reference to "${reference}" could not be resolved from "${dir}". Are you sure the file or package exists?`,
  ];
}

/**
 * @kind Error
 *
 * @summary
 * The provided importmap file could not be found.
 *
 * @abstract
 * The importmap can be referenced in a file from the package.json. If the named
 * file cannot be found the build process has to be stopped. Make sure that the
 * file has been specified relative to the package.json where it was referenced
 * from.
 *
 * @see
 * - [import-maps specification](https://github.com/WICG/import-maps)
 *
 * @example
 * Check the contents of the available package.json:
 *
 * ```sh
 * cat package.json
 * ```
 *
 * The displayed content should look similar to (i.e., contain an importmap such as):
 *
 * ```json
 * {
 *   "importmap": "./import-map.json"
 * }
 * ```
 *
 * If the importmap has instead been (re)named "importmap.json" then this will not work.
 * Likewise, with the reference above the file is expected to be in the same directory
 * as the package.json. If it is, e.g., in the "src" subfolder you'd should reference it
 * as "./src/import-map.json" instead.
 */
export function importMapFileNotFound_0028(dir: string, file: string): QuickMessage {
  return [LogLevels.error, '0028', `The importmap "${file}" could not be found at "${dir}".`];
}

/**
 * @kind Warning
 *
 * @summary
 * The given dependency seems to be a Piral plugin and should not be exposed
 * as a shared dependency.
 *
 * @abstract
 * While you should be quite restrictive in general regarding sharing dependencies,
 * there are some dependencies that should never be shared. One area are dependencies
 * that are only meant for the app shell and don't make sense somewhere else.
 *
 * Even though many dependencies might exist that fall into that area the only ones
 * we know for sure are the so-called Piral plugins. These are dependencies that only
 * make sense to be used within an app shell, i.e., a Piral instance (or host application).
 *
 * When the Piral CLI detects that you want to share such a dependency from an app shell,
 * or alternatively within a pilet directly, it will print a warning. There might be false
 * positives here, so having an error here might be a bit too much. Nevertheless, depending
 * on your scenario you might want to treat these warnings as errors.
 *
 * @see
 * - [Sharing dependencies](https://docs.piral.io/concepts/I08-importmap)
 *
 * @example
 * Check the contents of the available package.json:
 *
 * ```sh
 * cat package.json
 * ```
 *
 * The displayed content should look similar to (i.e., contain an importmap such as):
 *
 * ```json
 * {
 *   "importmap": {
 *     "imports": {
 *       "piral-ng": ""
 *     }
 *   }
 * }
 * ```
 *
 * This would share the whole Piral plugin, which does not make much sense. First of all,
 * the plugin is presumably already installed - it even could only be installed in a
 * Piral instance. Second, there is no use of the exported function somewhere else.
 *
 * Instead, you potentially might want to share a submodule. For instance, in the example
 * above the "piral-ng/common" submodule should be shared.
 *
 * ```json
 * {
 *   "importmap": {
 *     "imports": {
 *       "piral-ng/common": ""
 *     }
 *   }
 * }
 * ```
 */
export function invalidSharedDependency_0029(name: string): QuickMessage {
  return [LogLevels.warning, '0029', `The dependency "${name}" should not be shared.`];
}

/**
 * @kind Error
 *
 * @summary
 * Cannot not find the given full path to successfully scaffold the pilet.
 *
 * @abstract
 * The provided Piral instance resolves to a local file, however, this file cannot be found from the
 * current directory. Either specify an absolute path or make sure that the relative path works for
 * the current working directory.
 *
 * Since no Piral instance can be resolved the scaffolding process needs to be stopped.
 *
 * @see
 * - [Current Working Directory](https://en.wikipedia.org/wiki/Working_directory)
 *
 * @example
 * ...
 */
export function scaffoldPathDoesNotExist_0030(fullPath: string): QuickMessage {
  return [LogLevels.error, '0030', `Could not find "${fullPath}" for scaffolding.`];
}

/**
 * @kind Error
 *
 * @summary
 * Cannot not find the given full path to successfully upgrade the pilet.
 *
 * @abstract
 * The provided Piral instance resolves to a local file, however, this file cannot be found from the
 * current directory. Either specify an absolute path or make sure that the relative path works for
 * the current working directory.
 *
 * Since no Piral instance can be resolved the upgrade process needs to be stopped.
 *
 * @see
 * - [Current Working Directory](https://en.wikipedia.org/wiki/Working_directory)
 *
 * @example
 * ...
 */
export function upgradePathDoesNotExist_0031(fullPath: string): QuickMessage {
  return [LogLevels.error, '0031', `Could not find "${fullPath}" for upgrading.`];
}

/**
 * @kind Error
 *
 * @summary
 * Right now project references are not supported. Please specify a tarball.
 *
 * @abstract
 * The provided Piral instance resolves to a local project directory. Instead,
 * an already prepared tarball (using "piral build") has been expected.
 *
 * In the future we may change this and support direct project references, too,
 * however, right now you'll need to first prepare your Piral instance by
 * running `piral build`. Obviously, we could run that for you, too, but we would
 * not know what options you may want to use.
 *
 * Since no Piral instance can be resolved the command needs to be aborted.
 *
 * @see
 * - [Current Working Directory](https://en.wikipedia.org/wiki/Working_directory)
 *
 * @example
 * ...
 */
export function projectReferenceNotSupported_0032(fullPath: string): QuickMessage {
  return [LogLevels.error, '0032', `Expected a tarball, but found a project at "${fullPath}".`];
}

/**
 * @kind Error
 *
 * @summary
 * The provided target must be an existing directory containing a package.json.
 *
 * @abstract
 * The Piral CLI has to get some meta information for a pilet from its package.json.
 * The meta information include its name, version, which Piral instance to use, as well
 * as other relevant infos.
 *
 * Make sure to start the Piral CLI in the right folder containing a package.json or a
 * subdirectory. Alternatively, make sure to provide an additional path to the Piral
 * CLI via command line parameters.
 *
 * @see
 * - [npm Package Specification](https://docs.npmjs.com/files/package.json)
 *
 * @example
 * Make sure you are in the right directory by calling commands such as
 *
 * ```sh
 * pwd # gets the current directory
 * ```
 *
 * or
 *
 * ```sh
 * ls -la # gets the files of the current directory
 * ```
 *
 * Navigate to the right directory via the `cd` command.
 */
export function invalidPiletTarget_0040(): QuickMessage {
  return [LogLevels.error, '0040', `The provided target directory is not a valid.`];
}

/**
 * @kind Error
 *
 * @summary
 * The section "piral" in the "package.json" file is missing.
 *
 * @abstract
 * The Piral CLI has to get some meta information for a pilet from its package.json.
 * The meta information include its name, version, which Piral instance to use, as well
 * as other relevant infos.
 *
 * Make sure that you modified the package.json correctly using the specification for
 * pilets or that the pilet was initially created / scaffolded by the Piral CLI using
 * the
 *
 * ```sh
 * pilet new
 * ```
 *
 * command.
 *
 * Specifically, the package.json needs to contain a special key called `piral`, which
 * contains an object with additional fields.
 *
 * @see
 * - [Pilet Package Definition](https://docs.piral.io/reference/documentation/C31-pilet-metadata)
 *
 * @example
 * Your pilet's package.json may look similar to the following snippet:
 *
 * ```json
 * {
 *   "name": "my-pilet",
 *   "version": "1.0.0",
 *   "devDependencies": {
 *     "my-piral": "1.0.0",
 *     "piral-cli": "0.11.0"
 *   },
 *   "piral": {
 *     "name": "my-piral",
 *     "tooling": "0.11.0"
 *   }
 * }
 * ```
 */
export function invalidPiletPackage_0041(): QuickMessage {
  return [LogLevels.error, '0041', `Could not find a Piral instance reference.`];
}

/**
 * @kind Error
 *
 * @summary
 * The field "name" in the "piral" section of the "package.json" file is missing.
 *
 * @abstract
 * The Piral CLI has to get some meta information for a pilet from its package.json.
 * The meta information include its name, version, which Piral instance to use, as well
 * as other relevant infos.
 *
 * Make sure that you modified the package.json correctly using the specification for
 * pilets or that the pilet was initially created / scaffolded by the Piral CLI using
 * the
 *
 * ```sh
 * pilet new
 * ```
 *
 * command.
 *
 * Specifically, the package.json needs to contain a special section called `piral`, which
 * should contain (among others) a field `name` pointing to the Piral instance to use.
 *
 * @see
 * - [Pilet Package Definition](https://docs.piral.io/reference/documentation/C31-pilet-metadata)
 *
 * @example
 * If your Piral instance is called `my-piral` then the package.json may look similar to
 * the following snippet:
 *
 * ```json
 * {
 *   "name": "my-pilet",
 *   "version": "1.0.0",
 *   "devDependencies": {
 *     "my-piral": "1.0.0",
 *     "piral-cli": "0.11.0"
 *   },
 *   "piral": {
 *     "name": "my-piral",
 *     "tooling": "0.11.0"
 *   }
 * }
 * ```
 */
export function invalidPiletPackage_0042(): QuickMessage {
  return [LogLevels.error, '0042', `Could not find a Piral instance reference.`];
}

/**
 * @kind Error
 *
 * @summary
 * The reference to the Piral instance in the "package.json" file is invalid.
 *
 * @abstract
 * Even though everything seems to be correct on the first glance it may be that the
 * actual reference is broken. This could be due to various reasons.
 *
 * - npm linking is broken
 * - The dependencies have not been installed yet (run `npm i`)
 * - The Piral instance's name is invalid (e.g., due to a typo)
 *
 * @see
 * - [Pilet Package Definition](https://docs.piral.io/reference/documentation/C31-pilet-metadata)
 * - [Node Modules Loading](https://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders)
 *
 * @example
 * Let's say you just cloned the pilet via
 *
 * ```sh
 * git clone https://myhub.com/mypilet
 * ```
 *
 * Right now the dependencies should still be missing as dependencies are usually not
 * checked in. Under these circumstances the Piral instance reference is invalid.
 *
 * Make sure to resolve the dependencies correctly by running
 *
 * ```sh
 * npm i
 * ```
 */
export function invalidPiralReference_0043(): QuickMessage {
  return [LogLevels.error, '0043', `Invalid Piral instance reference.`];
}

/**
 * @kind Error
 *
 * @summary
 * The desired target directory could not be created.
 *
 * @abstract
 * When a non-existing target directory is specified the Piral CLI needs to create it first. This,
 * however, can lead to problems if
 *
 * - the file system is corrupted
 * - necessary privileges are missing
 * - the given path is invalid
 *
 * If one of these cases is hit the Piral CLI needs to stop the action.
 *
 * @see
 * - [File System Permissions](https://en.wikipedia.org/wiki/File_system_permissions)
 *
 * @example
 * On nix systems the easiest way to ensure ownership of a folder is using the `chmod` command.
 * Make sure, however, to only expand permissions when overall security is still ensured.
 *
 * Ideally, you'd select a folder that is below your home directory. That way the necessary
 * permissions are there by definition.
 *
 * On nix systems you can change to your home directory via:
 *
 * ```sh
 * cd ~
 * ```
 *
 * On Windows you can use:
 *
 * ```sh
 * cd %HOMEPATH%
 * ```
 */
export function cannotCreateDirectory_0044(): QuickMessage {
  return [LogLevels.error, '0044', 'Could not create the target directory.'];
}

/**
 * @kind Warning
 *
 * @summary
 * Reported when a file could not be overwritten.
 *
 * @abstract
 * Usually, this only indicates that a file already existed and was not overwritten.
 * There are three modes concerning the overwrite policy:
 *
 * - Do not overwrite (usually the default)
 * - Ask before overwriting
 * - Always overwrite
 *
 * In the first mode the warning is produced to indicate an operation was not
 * performed due to the integrated overwrite protection.
 *
 * @see
 * - [File System Permissions](https://en.wikipedia.org/wiki/File_system_permissions)
 *
 * @example
 * Many commands allow setting the overwrite mode. For instance, when performing an
 * upgrade of a pilet we can set it.
 *
 * To ask before overwriting the following command works:
 *
 * ```sh
 * pilet upgrade --force-overwrite prompt
 * ```
 *
 * If you want to always overwrite use:
 *
 * ```sh
 * pilet upgrade --force-overwrite yes
 * ```
 */
export function didNotOverWriteFile_0045(file: string): QuickMessage {
  return [LogLevels.warning, '0045', `Did not overwrite: File ${file} already exists.`];
}

/**
 * @kind Error
 *
 * @summary
 * Reported when a file could not be found.
 *
 * @abstract
 * Usually, this only indicates that a file already existed and was deleted or
 * that the configuration is corrupt.
 *
 * Make sure to have a valid Piral instance and the latest version of the Piral
 * CLI installed. Verify that the node_modules have not been corrupted.
 *
 * To avoid any issues try to upgrade the Piral CLI and reinstall the project
 * dependencies.
 *
 * @see
 * - [File System Permissions](https://en.wikipedia.org/wiki/File_system_permissions)
 *
 * @example
 * On some systems the node_modules folder may become instable or get corrupted
 * with multiple dependency installations and modifications. After a time a
 * complete swipe may be the best solution to ensure a stable project
 * configuration.
 */
export function cannotFindFile_0046(file: string): QuickMessage {
  return [LogLevels.error, '0046', `The file "${file}" does not exist!`];
}

/**
 * @kind Warning
 *
 * @summary
 * Reported when the provided / default port was not available.
 *
 * @abstract
 * By default, the debug commands spawn at the port 1234. However, under certain
 * circumstances (e.g., another debug command running somewhere) this port may not
 * be free.
 *
 * The piral-cli can select a new port, which is free, however, it will still report
 * a warning message in such cases. You can then always abort the current debug
 * process and start a new one - either closing the other run blocking the port or
 * explicitly selecting a new one using the `--port` flag.
 *
 * @see
 * - [Port (computer networking)](https://en.wikipedia.org/wiki/Port_(computer_networking))
 *
 * @example
 * If you start one process to debug an app shell using `piral debug` and another process
 * to debug some pilet using `pilet debug` both processes would want to run on the default
 * port 1234.
 *
 * As a mitigation you can now either be very explicit, e.g., `piral debug --port 1010` and
 * `pilet debug --port 1020` or you can just drop one of the two and always only run a single
 * debug process.
 *
 * In any case, running both without any options also works, but then a new port will be chosen.
 * The output of the Piral CLI will always show you what port is currently used.
 */
export function portChanged_0047(newPort: number, oldPort: number): QuickMessage {
  return [LogLevels.warning, '0047', `The selected port "${oldPort}" is already used. Changed port to "${newPort}".`];
}

/**
 * @kind Error
 *
 * @summary
 * Reported when the provided / default port was not available.
 *
 * @abstract
 * By default, the debug commands spawn at the port 1234. However, under certain
 * circumstances (e.g., another debug command running somewhere) this port may not
 * be free.
 *
 * The piral-cli can select a new port, which is free, however, it will still report
 * a warning message in such cases. You can then always abort the current debug
 * process and start a new one - either closing the other run blocking the port or
 * explicitly selecting a new one using the `--port` flag.
 *
 * @see
 * - [Port (computer networking)](https://en.wikipedia.org/wiki/Port_(computer_networking))
 *
 * @example
 * If you start one process to debug an app shell using `piral debug` and another process
 * to debug some pilet using `pilet debug` both processes would want to run on the default
 * port 1234.
 *
 * As a mitigation you can now either be very explicit, e.g., `piral debug --port 1010` and
 * `pilet debug --port 1020` or you can just drop one of the two and always only run a single
 * debug process.
 *
 * In any case, running both without any options also works, but then a new port will be chosen.
 * The output of the Piral CLI will always show you what port is currently used.
 */
export function portNotFree_0048(port: number): QuickMessage {
  return [LogLevels.error, '0048', `The selected port "${port}" is already used.`];
}

/**
 * @kind Warning
 *
 * @summary
 * Reported when the Piral instance is locally resolved, but no location for the upgrade is known.
 *
 * @abstract
 * The Piral instance is currently resolved locally, but no local file for the upgrade has been specified.
 *
 * Since the local resolution only works against a filename the update process has also to be triggered with
 * a file location. Otherwise, there is no chance to know a different file location.
 *
 * Potentially, you wanted to switch / resolve the module from npm instead. Therefore, we are then trying to
 * obtain the Piral instance from npm instead using the known name.
 *
 * @see
 * - [Local File Dependencies](https://stackoverflow.com/questions/14381898/local-dependency-in-package-json)
 *
 * @example
 * You may have set up the pilet using a locally available tgz file. In this case your original command may
 * have looked similar to:
 *
 * ```json
 * pilet new ../../my-app-shell/dist/emulator/my-app-shell-1.0.0.tgz
 * ```
 *
 * To run an upgrade in such a scenario a command such as
 *
 * ```sh
 * pilet upgrade ../../my-app-shell/dist/emulator/my-app-shell-1.1.0.tgz
 * ```
 *
 * needs to be used.
 */
export function localeFileForUpgradeMissing_0050(): QuickMessage {
  return [LogLevels.warning, '0050', `No local file for the upgrade has been specified.`];
}

/**
 * @kind Warning
 *
 * @summary
 * Reported when the Piral instance is resolved via git, but an invalid version was specified.
 *
 * @abstract
 * The Piral instance is currently resolved via Git, but latest was not used to try a direct update.
 *
 * Right now we only support "latest" for Git resolved Piral instances. In this scenario we obtain the
 * current head from the repository's default branch and update accordingly.
 *
 * Potentially, you wanted to switch / resolve the module from npm instead. Therefore, we are then trying to
 * obtain the Piral instance from npm instead using the known name.
 *
 * @see
 * - [Git Dependencies in npm](https://medium.com/&commat;jonchurch/use-github-branch-as-dependency-in-package-json-5eb609c81f1a)
 *
 * @example
 * You may have set up the pilet using a locally available tgz file. In this case your original command may
 * have looked similar to:
 *
 * ```json
 * pilet new https://github.com/foo/my-app-shell.git
 * ```
 *
 * To run an upgrade in such a scenario a command such as
 *
 * ```sh
 * pilet upgrade latest
 * ```
 *
 * needs to be used.
 *
 * Since "latest" is the default version the specifier can actually be omitted, too.
 */
export function gitLatestForUpgradeMissing_0051(): QuickMessage {
  return [LogLevels.warning, '0051', `No valid version has been not used.`];
}

/**
 * @kind Warning
 *
 * @summary
 * Reported when the version of a dependency cannot be resolved.
 *
 * @abstract
 * When a pilet is scaffolded from a Piral instance special dev tools may be installed
 * as specified from the "devDependencies" section in the "pilets" section.
 *
 * The default version resolution falls back to the version specified already in the
 * standard "devDependencies" of the Piral instance's package.json.
 *
 * Under some conditions no version of the specified dependency can be determined.
 *
 * The conditions may be:
 *
 * - Missing dev dependencies
 * - Invalid dev dependencies
 * - Disk failures
 *
 * @see
 * - [Piral Instance Package Definition](https://docs.piral.io/reference/documentation/C21-piral-metadata)
 *
 * @example
 * The primary example hits when a dev dependency was specified that is otherwise not given.
 *
 * Consider the following package.json:
 *
 * ```json
 * {
 *   "name": "my-piral",
 *   "devDependencies": {},
 *   "pilets": {
 *     "devDependencies": {
 *       "prettier": true
 *     }
 *   }
 * }
 * ```
 *
 * Just make sure that `prettier` is already available on the standard `devDependencies`.
 *
 * ```json
 * {
 *   "name": "my-piral",
 *   "devDependencies": {
 *     "prettier": "^1.0.0"
 *   },
 *   "pilets": {
 *     "devDependencies": {
 *       "prettier": true
 *     }
 *   }
 * }
 * ```
 */
export function cannotResolveVersion_0052(name: string): QuickMessage {
  return [LogLevels.warning, '0052', `The version for "${name}" could not be resolved. Using "latest".`];
}

/**
 * @kind Warning
 *
 * @summary
 * Reported when a dependency cannot be resolved.
 *
 * @abstract
 * When a pilet is scaffolded from a Piral instance special dev tools may be installed
 * as specified from the "devDependencies" section in the "pilets" section.
 *
 * The default version resolution falls back to the version specified already in the
 * standard "devDependencies" of the Piral instance's package.json.
 *
 * Under some conditions no version of the specified dependency can be determined.
 *
 * The conditions may be:
 *
 * - Missing dev dependencies
 * - Invalid dev dependencies
 * - Disk failures
 *
 * @see
 * - [Piral Instance Package Definition](https://docs.piral.io/reference/documentation/C21-piral-metadata)
 *
 * @example
 * The primary example hits when a dev dependency was specified that is otherwise not given.
 *
 * Consider the following package.json:
 *
 * ```json
 * {
 *   "name": "my-piral",
 *   "devDependencies": {},
 *   "pilets": {
 *     "devDependencies": {
 *       "prettier": true
 *     }
 *   }
 * }
 * ```
 *
 * Just make sure that `prettier` is already available on the standard `devDependencies`.
 *
 * ```json
 * {
 *   "name": "my-piral",
 *   "devDependencies": {
 *     "prettier": "^1.0.0"
 *   },
 *   "pilets": {
 *     "devDependencies": {
 *       "prettier": true
 *     }
 *   }
 * }
 * ```
 */
export function cannotResolveDependency_0053(names: Array<string>, rootDir: string): QuickMessage {
  return [
    LogLevels.warning,
    '0053',
    `Could not resolve any package (tried "${names.join('", "')}") from "${rootDir}". Taking "latest" version.`,
  ];
}

/**
 * @kind Info
 *
 * @summary
 * Reported when an inherited dependency cannot be resolved.
 *
 * @abstract
 * When a pilet is built all the inherited (i.e., centrally shared) dependencies will be resolved. In case
 * you did not install one of these dependencies a short info will be shown. This acts as a reminder that
 * you could install more dependencies - without any runtime cost.
 *
 * Note that even though shared dependencies are available at runtime in any case they will might be
 * for building your pilet. Therefore, if you plan to use shared dependencies please install them in your
 * pilet's repository.
 *
 * @see
 * - [Piral Instance Package Definition](https://docs.piral.io/reference/documentation/C21-piral-metadata)
 */
export function skipUnresolvedDependency_0054(name: string): QuickMessage {
  return [LogLevels.info, '0054', `The inherited dependency "${name}" is not installed and will be skipped.`];
}

/**
 * @kind Error
 *
 * @summary
 * Incomplete configuration. Missing URL of the pilet feed.
 *
 * @abstract
 * The publish command works either against the official public feed using a feed name
 * (e.g., `sample`) or a fully qualified URL working against *any* feed service.
 *
 * Make sure that the provided publish endpoint URL follows the Feed Service API specification.
 *
 * If the URL is missing (i.e., not provided) then the Piral CLI does not know to which feed
 * service to publish.
 *
 * @see
 * - [Feed API Specification](https://docs.piral.io/reference/specifications/feed-api-specification)
 *
 * @example
 * Always specify the URL via the `--url` provider.
 *
 * ```sh
 * pilet publish --url https://feed.piral.cloud/api/v1/pilet/sample
 * ```
 */
export function missingPiletFeedUrl_0060(): QuickMessage {
  return [LogLevels.error, '0060', `Missing pilet feed service URL.`];
}

/**
 * @kind Error
 *
 * @summary
 * Could not find a valid pilet to upload to the pilet feed.
 *
 * @abstract
 * The `pilet publish` commands works against an already created pilet package.
 * If no pilet package is yet available the command will ultimately fail.
 *
 * There are a couple of options. For instance, using the `--fresh` flag it is
 * possible to trigger a `pilet build` and `pilet pack` process implicitly.
 *
 * Otherwise, make sure to have a `.tgz` file in the directory or specify it
 * directly.
 *
 * @see
 * - [npm Pack](https://docs.npmjs.com/cli-commands/pack.html)
 *
 * @example
 * Make sure to have build a pilet beforehand:
 *
 * ```sh
 * pilet build
 * ```
 *
 * Then you should pack the current contents:
 *
 * ```sh
 * pilet pack
 * ```
 *
 * Finally, you can publish it:
 *
 * ```sh
 * pilet publish --url sample
 * ```
 *
 * To do these three commands in one sweep just use `--fresh`:
 *
 * ```sh
 * pilet publish --fresh --url sample
 * ```
 *
 * Using multiple commands is preferred if you use custom options, otherwise
 * just go for the single command.
 */
export function missingPiletTarball_0061(sources: Array<string>): QuickMessage {
  return [LogLevels.error, '0061', `No files found using pattern "${sources.join('", "')}".`];
}

/**
 * @kind Warning
 *
 * @summary
 * Could not upload the pilet to the pilet feed.
 *
 * @abstract
 * Uploading to the pilet feed service API failed. This could have various reasons:
 *
 * - Loss of connectivity
 * - The provided authentication was invalid or missing
 * - The URL was invalid
 * - The feed service does not follow the specification
 * - A custom condition from the feed service was rejected
 * - The given pilet was already available at the feed service
 *
 * The Piral CLI will print the error response from the feed service. Please contact
 * your feed service admin if nothing was printed.
 *
 * @see
 * - [Feed API Specification](https://docs.piral.io/reference/specifications/feed-api-specification)
 *
 * @example
 * Make sure that you are connected to the internet and that the desired feed service URL
 * can be reached from your computer.
 *
 * Run
 *
 * ```sh
 * pilet publish --fresh --url https://myfeedservice.com/api/pilet
 * ```
 *
 * Look at the error response. Make sure that your version is not yet published. If other
 * conditions (e.g., a certain naming convention for your pilet) need to be followed adjust
 * the package.json accordingly.
 */
export function failedToUpload_0062(fileName: string): QuickMessage {
  return [LogLevels.warning, '0062', `Could not upload "${fileName}" to feed service.`];
}

/**
 * @kind Warning
 *
 * @summary
 * Could not read the contents from the pilet.
 *
 * @abstract
 * Publishing pilet requires a valid tgz file that can be read and transmitted.
 * If such a file can be found, however, cannot be opened then we have no chance
 * of publishing the pilet.
 *
 * This warning is thus emitted in case of:
 *
 * - an empty tgz file
 * - an inaccessible tgz file
 *
 * Make sure that the disk is properly functioning and that necessary permissions
 * are set to allow accessing the file.
 *
 * @see
 * - [File System Permissions](https://en.wikipedia.org/wiki/File_system_permissions)
 *
 * @example
 * Find the available tgz files:
 *
 * ```sh
 * ls -la *.tgz
 * ```
 *
 * Make sure that at least one tgz file is available. Check the displayed permissions
 * and use `chmod` to set the right permissions.
 *
 * Usually, changing permissions should not be required at all. Make sure you operate
 * from the same user account as when the tgz file was created.
 */
export function failedToRead_0063(fileName: string): QuickMessage {
  return [LogLevels.warning, '0063', `Could not read the file "${fileName}".`];
}

/**
 * @kind Error
 *
 * @summary
 * Did finish uploading the pilet(s) with errors.
 *
 * @abstract
 * The Piral CLI tries to upload all matched .tgz files. In case of
 * multiple hits all files are published. This may not be the behavior you
 * look for as it will lead to errors in case of already published pilets.
 *
 * To avoid uploading already published pilets either perform a fresh
 * build omitting any tgz inputs at all or specify the tgz file directly.
 *
 * @see
 * - [Semantic Versioning](https://semver.org)
 *
 * @example
 * To perform a fresh build use the following command:
 *
 * ```sh
 * pilet publish --fresh --url sample
 * ```
 *
 * In order to specify the file explicitly just use a positional argument.
 *
 * ```sh
 * pilet publish my-pilet-1.0.0.tgz --url sample
 * ```
 *
 * Make sure that the specified file exists.
 *
 * Additionally, you can use globs to match multiple files.
 */
export function failedUploading_0064(): QuickMessage {
  return [LogLevels.error, '0064', 'Failed to upload some pilet(s)!'];
}

/**
 * @kind Error
 *
 * @summary
 * The HTTP post request failed.
 *
 * @abstract
 * While submitting the HTTP post request an error was reported. This usually indicates
 * a problem with the network, either due to
 *
 * - loss of connectivity
 * - an invalid host name (DNS broken)
 * - a system restriction (e.g., firewall)
 * - invalid SSL certificate
 *
 * Make sure to understand the presented Node.js error before proceeding.
 *
 * @see
 * - [Feed API Specification](https://docs.piral.io/reference/specifications/feed-api-specification)
 *
 * @example
 * The easiest way to replicate an error would be to use an invalid host.
 *
 * ```sh
 * pilet publish --url https://doesnotexist/api/pilet
 * ```
 */
export function failedHttpPost_0065(error: string): QuickMessage {
  return [LogLevels.error, '0065', `Failed to upload via HTTP: ${error}.`];
}

/**
 * @kind Warning
 *
 * @summary
 * The HTTP post request was reported to be unsuccessful.
 *
 * @abstract
 * The URL could be reached, however, the returned status code did not indicate success.
 * Note that only a status code of 200 will be interpreted as successful.
 *
 * The error message prints the received status text and status code. Usually, this should be
 * sufficient to know where the problem lies. Some feed service implementations will also provide
 * a custom payload with further information. This response body will also be printed.
 *
 * @see
 * - [Feed API Specification](https://docs.piral.io/reference/specifications/feed-api-specification)
 *
 * @example
 * The easiest way to replicate an error would be to use any URL.
 *
 * ```sh
 * pilet publish --url https://example.com/api/pilet
 * ```
 */
export function unsuccessfulHttpPost_0066(statusText: string, statusCode: number, error: string): QuickMessage {
  return [
    LogLevels.warning,
    '0066',
    `Failed to upload: ${statusText} (${statusCode}). Received: ${JSON.stringify(error)}`,
  ];
}

/**
 * @kind Info
 *
 * @summary
 * The HTTP post response body data.
 *
 * @abstract
 * When the pilet was successfully updated the server is free to respond with
 * whatever HTTP body. Since the content of this body may be interesting, we
 * show the content in the terminal.
 *
 * Note that we serialize the content to a string. So the result may not look
 * as wanted from the server's perspective. In general we do not recommend to
 * transport lengthy messages as a result of publishing a pilet.
 *
 * @see
 * - [Feed API Specification](https://docs.piral.io/reference/specifications/feed-api-specification)
 *
 * @example
 * The easiest way to see the output is to publish a pilet to the temporary feed.
 *
 * ```sh
 * pilet publish --api-key ac6c202085f07099da1729a20e5750e651ef093ef4a5856c70997a6cc71dcab2 --url https://feed.piral.cloud/api/v1/pilet/temp
 * ```
 */
export function httpPostResponse_0067(response: any): QuickMessage {
  const content = typeof response !== 'string' ? JSON.stringify(response, undefined, 2) : response;
  return [LogLevels.info, '0067', `HTTP: ${content}`];
}

/**
 * @kind Error
 *
 * @summary
 * The HTTP get request failed.
 *
 * @abstract
 * While submitting the HTTP get request an error was reported. This usually indicates
 * a problem with the network, either due to
 *
 * - loss of connectivity
 * - an invalid host name (DNS broken)
 * - a system restriction (e.g., firewall)
 * - invalid SSL certificate
 *
 * It could also mean that the endpoint is not reachable or requires additional headers /
 * authentication for retrieving the content.
 *
 * @example
 * The easiest way to replicate an error would be to use an invalid host.
 *
 * ```sh
 * pilet publish https://doesnotexist/api/pilet.tgz --from remote
 * ```
 */
export function failedHttpGet_0068(error: string): QuickMessage {
  return [LogLevels.error, '0068', `Failed to download via HTTP: ${error}.`];
}

/**
 * @kind Warning
 *
 * @summary
 * The HTTP post request was reported to be unsuccessful. The server indicated
 * that some payment is required before this pilet can be published.
 *
 * @abstract
 * While submitting the HTTP get request an error was reported.
 *
 * Potentially, the server returned some more indicative error message. In this
 * case read it carefully to know what version was already published.
 *
 * In any case only the documentation of the corresponding feed service can be
 * conclusive how this can be resolved. Presumably, some payment of some fee
 * is necessary to publish pilets.
 */
export function failedToUploadPayment_0161(response: any): QuickMessage {
  const content = typeof response !== 'string' ? JSON.stringify(response, undefined, 2) : response;
  return [LogLevels.warning, '0161', `Failed to publish pilet due to missing payment: ${content}.`];
}

/**
 * @kind Warning
 *
 * @summary
 * The HTTP post request was reported to be unsuccessful. The server indicated
 * that the same version of this pilet was already published.
 *
 * @abstract
 * While submitting the HTTP get request an error was reported.
 *
 * Potentially, the server returned some more indicative error message. In this
 * case read it carefully to know what version was already published.
 *
 * In any case you need to change the version to continue. You can do that by
 * editing the "version" field in the pilet's package.json or using `npm version`.
 *
 * @example
 * If you already published the pilet, e.g., via
 *
 * ```sh
 * pilet publish --api-key ... --url ...
 * ```
 *
 * then doing this again without any change should result in this error.
 *
 * Now we can patch-upgrade the version of the pilet:
 *
 * ```sh
 * npm version patch
 * ```
 *
 * And try the `pilet publish` command again. This time it should just work.
 */
export function failedToUploadVersion_0162(response: any): QuickMessage {
  const content = typeof response !== 'string' ? JSON.stringify(response, undefined, 2) : response;
  return [LogLevels.warning, '0162', `Failed to publish pilet. The version was already published: ${content}.`];
}

/**
 * @kind Warning
 *
 * @summary
 * The HTTP post request was reported to be unsuccessful. The server indicated
 * that the size of the pilet was too large.
 *
 * @abstract
 * While submitting the HTTP get request an error was reported.
 *
 * Potentially, the server returned some more indicative error message. In this
 * case read it carefully to know how much the limit was exceeded.
 *
 * In any case the pilet must be somehow trimmed down. Most often, the size is
 * dominantly determined by some external packages that are referened. Use a
 * page such as bundlephobia.com or some IDE tools to find out which packages
 * are to blame. Also tools such as the Webpack or Parcel bundle analyzer can
 * be helpful to determine the source of the bundle size.
 */
export function failedToUploadSize_0163(response: any): QuickMessage {
  const content = typeof response !== 'string' ? JSON.stringify(response, undefined, 2) : response;
  return [LogLevels.warning, '0163', `Failed to upload pilet. The pilet is too large: ${content}.`];
}

/**
 * @kind Error
 *
 * @summary
 * The package.json containing a valid entry point for the Piral instance is missing.
 *
 * @abstract
 * A Piral instance needs to be a valid Node.js project. Valid Node.js projects contain a
 * package.json file in their root directory. This file is used by the Piral CLI to get
 * relevant meta data for the Piral instance.
 *
 * The relevant meta data includes information such as the name of the Piral instance, the
 * additional typings, what dependencies are shared with the pilets, and what is the entry
 * point for bundling.
 *
 * The entry point for bundling refers to the index.html file that should act as the file
 * containing all references for scripts, stylesheets, and other resources.
 *
 * @see
 * - [Parcel Bundling](https://codeburst.io/bundle-your-web-application-with-parceljs-b4eee99bdb55)
 *
 * @example
 * The following shows a valid package.json of a Piral instance:
 *
 * ```json
 * {
 *   "name": "my-app-shell",
 *   "version": "1.0.0",
 *   "app": "src/index.html",
 *   "dependencies": {
 *     "piral": "0.11.0"
 *   },
 *   "devDependencies": {
 *     "piral-cli": "0.11.0"
 *   },
 *   "pilets": {}
 * }
 * ```
 *
 * The app field indicates what file to use as entry point.
 */
export function entryPointMissing_0070(rootDir: string): QuickMessage {
  return [LogLevels.error, '0070', `Cannot find a valid entry point. Missing package.json in "${rootDir}".`];
}

/**
 * @kind Error
 *
 * @summary
 * The package.json of the Piral instance is missing the "app" field.
 *
 * @abstract
 * A Piral instance needs to be a valid Node.js project. Valid Node.js projects contain a
 * package.json file in their root directory. This file is used by the Piral CLI to get
 * relevant meta data for the Piral instance.
 *
 * Among other meta data the file requires a special field "app". The field is used to
 * indicate what file to be used as entry point for the bundler. It is usually set to an
 * HTML file containing a reference to the entry script(s) and style sheet(s).
 *
 * @see
 * - [Parcel Bundling](https://codeburst.io/bundle-your-web-application-with-parceljs-b4eee99bdb55)
 *
 * @example
 * The following shows a valid package.json of a Piral instance:
 *
 * ```json
 * {
 *   "name": "my-app-shell",
 *   "version": "1.0.0",
 *   "app": "src/index.html",
 *   "dependencies": {
 *     "piral": "0.11.0"
 *   },
 *   "devDependencies": {
 *     "piral-cli": "0.11.0"
 *   },
 *   "pilets": {}
 * }
 * ```
 *
 * The app field indicates what file to use as entry point.
 */
export function entryPointMissing_0071(): QuickMessage {
  return [LogLevels.error, '0071', `Cannot find a valid entry point. Missing field "app" in the "package.json".`];
}

/**
 * @kind Warning
 *
 * @summary
 * An Array field in the package.json was defined with another type.
 *
 * @abstract
 * The package.json additions that Piral brings to the table are all well-defined. As such
 * using unexpected types such as a string in case of an array will be ignored and will lead
 * to warnings.
 *
 * @see
 * - [JavaScript Types](https://javascript.info/types)
 * - [JSON Types](https://cswr.github.io/JsonSchema/spec/basic_types/)
 *
 * @example
 * In case of, e.g., "externals" an array needs to be supplied. So given the following snippet
 * of a package.json
 *
 * ```json
 * {
 *   "name": "my-app-shell",
 *   "version": "1.0.0",
 *   "app": "src/index.html",
 *   "pilets": {
 *     "externals": true
 *   }
 * }
 * ```
 *
 * the value needs to be a valid array. It could be also dismissed or presented as an empty array.
 *
 * The following would work:
 *
 * ```json
 * {
 *   "name": "my-app-shell",
 *   "version": "1.0.0",
 *   "app": "src/index.html",
 *   "pilets": {
 *     "externals": []
 *   }
 * }
 * ```
 */
export function expectedArray_0072(key: string, type: string): QuickMessage {
  return [LogLevels.warning, '0072', `The value of "${key}" should be an array. Found "${type}".`];
}

/**
 * @kind Error
 *
 * @summary
 * The entry point specified in the "app" field does not exist.
 *
 * @abstract
 * The entry point of a Piral instance is provided via the "app" field of the
 * package.json. The field is interpreted as a file path relative to the location
 * of the package.json. In case the resolved file path is invalid the bundler
 * cannot start building the Piral instance.
 *
 * Make sure to only enter valid paths to resolve the app entry point correctly.
 *
 * Check that a forward slash (`/`) has been used as path separator. Do not use
 * backslashes (`\`).
 *
 * @see
 * - [File not found](https://stackoverflow.com/questions/17575492/file-not-found-in-node-js)
 *
 * @example
 * Let's assume we have a folder structure that looks like
 *
 * ```sh
 * package.json
 * + src
 *   + index.html
 * ```
 *
 * The app field in the package.json has to be "src/index.html", not "index.html" or "/src/index.html".
 *
 * Alternatively, you can also specify the path as "./src/index.html" (keep the dot in front). We
 * recommend also using the `/` as path separator on Windows to enable cross-platform usage of the
 * same repository.
 */
export function entryPointDoesNotExist_0073(app: string): QuickMessage {
  return [LogLevels.error, '0073', `The given entry pointing to "${app}" does not exist.`];
}

/**
 * @kind Error
 *
 * @summary
 * The project is missing a package.json.
 *
 * @abstract
 * Make sure to start the Piral CLI in the right directory. It should run from the project's
 * root directory. A Node.js project's root directory contains a file called package.json.
 *
 * The package.json contains important meta information such as the name, version, and entry
 * point for the bundler.
 *
 * @see
 * - [npm Init](https://docs.npmjs.com/cli/init)
 *
 * @example
 * You can create a new npm project using the `npm init` command. This will essentially guide
 * you through a number of decisions for creating a proper package.json.
 *
 * Even better you could start a new Piral instance using the following command:
 *
 * ```sh
 * npm init piral-instance
 * ```
 *
 * This will create or patch a package.json to be a valid Piral instance.
 */
export function packageJsonMissing_0074(): QuickMessage {
  return [
    LogLevels.error,
    '0074',
    'Cannot find the "package.json". You need a valid package.json for your Piral instance.',
  ];
}

/**
 * @kind Error
 *
 * @summary
 * The project is missing a package.json.
 *
 * @abstract
 * Make sure to start the Piral CLI in the right directory. It should run from the project's
 * root directory. A Node.js project's root directory contains a file called package.json.
 *
 * The package.json contains important meta information such as the name, version, and entry
 * point for the bundler.
 *
 * @see
 * - [npm Init](https://docs.npmjs.com/cli/init)
 *
 * @example
 * You can create a new npm project using the `npm init` command. This will essentially guide
 * you through a number of decisions for creating a proper package.json.
 *
 * Even better you could start a new pilet using the following command:
 *
 * ```sh
 * npm init pilet
 * ```
 *
 * This will create or patch a package.json to be a valid pilet.
 */
export function packageJsonMissing_0075(): QuickMessage {
  return [LogLevels.error, '0075', 'Cannot find the "package.json". You need a valid package.json for your pilet.'];
}

/**
 * @kind Error
 *
 * @summary
 * The declaration could not be generated.
 *
 * @abstract
 * A Piral instance emulator package consists of a pre-bundled version of the
 * app shell, its package.json, files for scaffolding, and generated typings.
 *
 * The typings are generated to provide the smallest bundle possible, together
 * with accurate typing that does not only reflect the truly available subset
 * for the pilets, but also custom API additions and more.
 *
 * Our way of generating requires a custom tool called dets, which is a TS
 * declaration bundler. It can do more than just spit out *.d.ts file and
 * somehow merge them together - it actually performs this on the real AST
 * of the found application. This way any interface merging is respected,
 * as well as not available APIs omitted.
 *
 * When the declaration cannot be created its either the fault of a missing
 * configuration or a bug in dets. Make sure to have an appropriate package.json
 * with the right configuration. The tsconfig.json is not used, so any
 * custom setting there may also be indicator of an issue.
 *
 * @see
 * - [dets](https://github.com/FlorianRappl/dets)
 * - [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree)
 *
 * @example
 * The declaration can be build independently:
 *
 * ```sh
 * piral declaration
 * ```
 *
 * If an error occurs check first if the package.json contains a valid "app"
 * field pointing to the HTML. The HTML requires a script reference to the
 * entry point of the appplication, e.g.,
 *
 * ```html
 * <script src="./index.tsx"></script>
 * ```
 *
 * The TypeScript declaration generator will take all files as input to
 * gather all required information for constructing the API declaration.
 */
export function declarationCouldNotBeGenerated_0076(rootDir: string, error: Error | string): QuickMessage {
  return [LogLevels.error, '0076', `Could not create the declaration in "${rootDir}". Error: ${error}`];
}

/**
 * @kind Error
 *
 * @summary
 * The path does not match to any valid entry file.
 *
 * @abstract
 * Pilets will be bundled by specifying their root module. The
 * root module is the module containing the exported `setup`
 * function, which is then used by the app shell to integrate
 * the pilet.
 *
 * @example
 * Let's say you started by scaffolding a pilet like so:
 *
 * ```sh
 * npm init pilet
 * ```
 *
 * This will give you a `src` folder containing the root module named
 * `index.tsx`.
 *
 * In this case you'd write:
 *
 * ```sh
 * pilet debug src/index.tsx
 * ```
 *
 * While in some scenarios we support dropping the extension there are
 * some edge cases that would not work without an extension. Our
 * recommendation is to be explicit about the root module's extension.
 */
export function entryFileMissing_0077(): QuickMessage {
  return [LogLevels.error, '0077', 'No valid entry file for the pilet found.'];
}

/**
 * @kind Warning
 *
 * @summary
 * The Piral instance is not referencing any framework package.
 *
 * @abstract
 * A Piral instance has to reference either `piral-base`, `piral-core`
 * or the whole `piral` framework package. If none of these dependencies
 * is found then no framework dependencies can be shared automatically.
 * Framework dependencies include react and react-router.
 *
 * @example
 * You might use a monorepo where most / all dependencies are declared in
 * a top-level package.json. Therefore, the package.json of the actual
 * Piral instance could look like this:
 *
 * ```json
 * {
 *   "name": "my-piral-instance",
 *   "version": "1.0.0",
 *   "app": "./src/index.html",
 *   "pilets": {}
 * }
 * ```
 *
 * While perfectly valid, this one lacks `dependencies` and `devDependencies`.
 * Surely, those are not really needed in the described case, but under
 * those conditions we cannot know what dependencies you may want to share. It
 * could be that you only reference `piral-base` and therefore don't want to
 * share anything except `tslib`. Or you use `piral-core` and also share things
 * like `react` or `react-router-dom`.
 *
 * Either way, in order to recognize that you'll need to include the correct
 * reference:
 *
 * ```json
 * {
 *   "name": "my-piral-instance",
 *   "version": "1.0.0",
 *   "app": "./src/index.html",
 *   "pilets": {},
 *   "dependencies": {
 *     "piral": "latest"
 *   }
 * }
 * ```
 *
 * If you only want to use `piral-base` or `piral-core` then replace `piral` in
 * the example above. Also use the version that you'll like to use - `latest`
 * is just one example.
 *
 */
export function frameworkLibMissing_0078(frameworkLibs: Array<string>): QuickMessage {
  return [
    LogLevels.warning,
    '0078',
    `Did not find any reference to either ${frameworkLibs.join(', ')}. No framework dependencies are shared.`,
  ];
}

/**
 * @kind Error
 *
 * @summary
 * The validation process failed.
 *
 * @abstract
 * The validation found errors. For the error details you'll need to check the
 * console output. Make sure to either follow the individual error codes or
 * instructions in the console.
 *
 * If the performed validations are incorrectly placed or inappropriate for the
 * current project then change the settings in your Piral instance configuration.
 *
 * @see
 * - [Validation](https://docs.piral.io/guidelines/tutorials/08-the-piral-cli#validations)
 *
 * @example
 * ...
 */
export function validationFailed_0080(errors: number): QuickMessage {
  return [LogLevels.error, '0080', `Validation failed. Found ${errors} error(s).`];
}

/**
 * @kind Warning
 *
 * @summary
 * The validation process succeeded with warnings.
 *
 * @abstract
 * The validation found warnings. For the warnings details you'll need to check
 * the console output. Make sure to either follow the individual message codes
 * or instructions in the console. Not all warnings could be that relevant for
 * your project.
 *
 * If the performed validations are incorrectly placed or inappropriate for the
 * current project then change the settings in your Piral instance configuration.
 *
 * @see
 * - [Validation](https://docs.piral.io/guidelines/tutorials/08-the-piral-cli#validations)
 *
 * @example
 * ...
 */
export function validationWarned_0081(warnings: number): QuickMessage {
  return [LogLevels.warning, '0081', `Validation succeeded with ${warnings} warning(s).`];
}

/**
 * @kind Warning
 *
 * @summary
 * The Piral CLI detected a misalignment between the used version of the tooling in the Piral instance and the currently
 * used version of the tooling.
 *
 * @abstract
 * The tooling of the pilet and the tooling used to produce the Piral instance should be aligned at least with their most
 * significant ("major") version. As such using the Piral CLI for building the emulator package in version 0.10.5 should be
 * aligned with a similar 0.10.x version of the Piral CLI for the pilet.
 *
 * Recommendation: Update to the same version of the Piral CLI.
 *
 * ```sh
 * npm i piral-cli&commat;{piralVersion}
 * ```
 *
 * Alternatively, you can also try to update the Piral instance.
 *
 * @see
 * - [Semantic Versioning](https://semver.org)
 *
 * @example
 * As an example the following package.json may be given:
 *
 * ```json
 * {
 *   "name": "my-pilet",
 *   "dependencies": {},
 *   "devDependencies": {
 *     "my-app-shell": "^1.0.0"
 *     "piral-cli": "^0.11.0"
 *   },
 *   "piral": {
 *     "name": "my-app-shell",
 *     "tooling": "0.10.3"
 *   }
 * }
 * ```
 *
 * Since the used Piral instance is using the 0.10.3 version of the piral-cli the pilet should also use a 0.10.x version.
 *
 * To solve this just update the Piral CLI accordingly.
 *
 * ```sh
 * npm i piral-cli&commat;0.10.3
 * ```
 */
export function appShellIncompatible_0100(piralVersion: string, cliVersion: string): QuickMessage {
  return [
    LogLevels.warning,
    '0100',
    `The Piral instance's CLI version (${piralVersion}) may be incompatible to the used version (${cliVersion}).`,
  ];
}

/**
 * @kind Warning
 *
 * @summary
 * The Piral CLI detected a misalignment between the used version of the framework and the used version of the tooling.
 *
 * @abstract
 * The tooling and the framework of Piral should aligned at least with their most significant ("major") version. As such
 * using Piral in the frontend in version 0.10.5 should be aligned with a similar 0.10.x version of the Piral CLI for the
 * tooling.
 *
 * Recommendation: Update to the same version of the Piral CLI.
 *
 * ```sh
 * npm i piral-cli&commat;{piralVersion}
 * ```
 *
 * Alternatively, you can also change the used version of Piral.
 *
 * @see
 * - [Semantic Versioning](https://semver.org)
 *
 * @example
 * As an example the following package.json may be given:
 *
 * ```json
 * {
 *   "name": "my-app-shell",
 *   "dependencies": {
 *     "piral": "^0.10.0"
 *   },
 *   "devDependencies": {
 *     "piral-cli": "^0.11.0"
 *   }
 * }
 * ```
 *
 * Since Piral itself is using the 0.10.x version the used Piral CLI should also be using a 0.10.x version.
 *
 * To solve this just update the Piral CLI accordingly.
 *
 * ```sh
 * npm i piral-cli&commat;^0.10.0
 * ```
 */
export function toolingIncompatible_0101(piralVersion: string, cliVersion: string): QuickMessage {
  return [
    LogLevels.warning,
    '0101',
    `The version of Piral (${piralVersion}) may be incompatible to the used version of "piral-cli" (${cliVersion}).`,
  ];
}

/**
 * @kind Info
 *
 * @summary
 * The Piral CLI could not detect the tooling version used by the app shell. Therefore, it may be incompatible to the
 * currently used version of the piral-cli. Keep an eye on weird errors.
 *
 * @abstract
 * The emulator contains a special section to inform the Piral CLI about the used version of the tooling. This is
 * important to detect potential alignment or incompatibilities. The used version of the emulator does not contain
 * this information and therefore may be incompatible.
 */
export function appShellMaybeIncompatible_0102(cliVersion: string): QuickMessage {
  return [
    LogLevels.info,
    '0100',
    `The Piral instance's CLI version is unknown and may be incompatible to the used version (${cliVersion}).`,
  ];
}

/**
 * @kind Error
 *
 * @summary
 * The provided output directory could not be found.
 *
 * @abstract
 * The `piral publish` command only works with a valid output directory. Make
 * sure to provide the same directory that you used for `piral build`.
 *
 * Make sure to run `piral build` before running `piral publish`.
 *
 * @example
 * The following command first removes the output directory, then starts the build,
 * and finally publishes the emulator to npm.
 *
 * ```sh
 * rm -rf dist
 * piral build --target dist
 * piral publish dist --type emulator
 * ```
 */
export function publishDirectoryMissing_0110(directory: string): QuickMessage {
  return [LogLevels.error, '0110', `The provided output directory "${directory}" could not be found.`];
}

/**
 * @kind Error
 *
 * @summary
 * Could not find exactly one *.tgz file.
 *
 * @abstract
 * The `piral publish --type emulator` command only works if a single *.tgz
 * file is found in the "emulator" subdirectory of the provided output directory.
 *
 * Make sure to run `piral build` before running `piral publish`.
 *
 * @example
 * The following command first removes the output directory, then starts the build,
 * and finally publishes the emulator to npm.
 *
 * ```sh
 * rm -rf dist
 * piral build --target dist
 * piral publish dist --type emulator
 * ```
 */
export function publishEmulatorFilesUnexpected_0111(directory: string): QuickMessage {
  return [LogLevels.error, '0111', `The directory "${directory}" should have exaxtly one *.tgz file.`];
}

/**
 * @kind Error
 *
 * @summary
 * The "xcopy" provider requires a "--opts.target" argument.
 *
 * @abstract
 * The `piral publish --type release` command requires the selection of a suitable
 * provider for running successfully. The "xcopy" provider just copies the sources from
 * the output directory (source) to a specified target directory.
 *
 * Make sure to supply the target directory via the `--opts.target` command line flag.
 *
 * @example
 * The following command would specify `/temp/dest` as target directory:
 *
 * ```sh
 * piral publish --type release --provider xcopy --opts.target "/temp/dest"
 * ```
 */
export function publishXcopyMissingTarget_0112(): QuickMessage {
  return [LogLevels.error, '0112', `The "xcopy" provider requires a "--opts.target" argument.`];
}

/**
 * @kind Error
 *
 * @summary
 * The given release provider could not be found.
 *
 * @abstract
 * The `piral publish --type release` command requires the selection of a suitable
 * provider for running successfully. The available providers can be extended via
 * plugins for the `piral-cli` command-line tooling.
 *
 * If a given provider cannot be found we get the error message incl. the list of
 * available providers. If that happens to be inaccurate check if your Node modules
 * have been installed correctly. If in doubt, remove the `node_modules` folder and
 * reinstall your dependencies.
 *
 * @example
 * The following command uses the in-built "xcopy" provider for releasing to a local directory.
 *
 * ```sh
 * piral publish --type release --provider xcopy --opts.target "/temp/dest"
 * ```
 */
export function publishProviderMissing_0113(providerName: string, availableProviders: Array<string>): QuickMessage {
  const s = availableProviders.map((m) => `"${m}"`).join(', ');
  return [LogLevels.error, '0113', `The release provider "${providerName}" is invalid. Available: ${s}.`];
}

/**
 * @kind Error
 *
 * @summary
 * The "emulator-sources" type is not supported for publishing.
 *
 * @abstract
 * The `piral publish` command only works with the emulator or release output types.
 *
 * @example
 * The following command uses the in-built "xcopy" provider for releasing to a local directory.
 *
 * ```sh
 * piral publish --type release --provider xcopy --opts.target "/temp/dest"
 * ```
 *
 * The type is "release".
 */
export function publishEmulatorSourcesInvalid_0114(): QuickMessage {
  return [
    LogLevels.error,
    '0114',
    `The command "publish" cannot be done with "--type emulator-sources". Use another type instead.`,
  ];
}

/**
 * @kind Error
 *
 * @summary
 * The "feed" provider requires a "--opts.url" argument.
 *
 * @abstract
 * The `piral publish --type release` command requires the selection of a suitable
 * provider for running successfully. The "feed" provider releases the files to
 * the a Piral Feed Service with the static page feature.
 *
 * Make sure to supply the URL for the feed service via the `--opts.url` command
 * line flag.
 *
 * @example
 * The following command would specify `https://feed.piral.cloud/api/v1/feed/sample/page`
 * for the feed service:
 *
 * ```sh
 * piral publish --type release --provider feed --opts.url "https://feed.piral.cloud/api/v1/feed/sample/page" --opts.apikey "foobar123"
 * ```
 */
export function publishFeedMissingUrl_0115(): QuickMessage {
  return [LogLevels.error, '0115', `The "feed" provider requires a "--opts.url" argument.`];
}

/**
 * @kind Error
 *
 * @summary
 * The "feed" provider requires a "--opts.version" argument.
 *
 * @abstract
 * The `piral publish --type release` command requires the selection of a suitable
 * provider for running successfully. The "feed" provider releases the files to
 * the a Piral Feed Service with the static page feature.
 *
 * Make sure to supply the version either explicitly via the `--opts.version` argument
 * or implicitly by having the artifacts stored in a sub-directory of the project's root,
 * which contains a package.json with the version to use.
 *
 * @example
 * The following command would specify version "1.2.3" for the feed service:
 *
 * ```sh
 * piral publish --type release --provider feed --opts.url "..." --opts.apikey "..." --opts.version "1.2.3"
 * ```
 */
export function publishFeedMissingVersion_0116(): QuickMessage {
  return [
    LogLevels.error,
    '0116',
    `The "feed" provider requires either a "--opts.version" argument or a package.json with a version.`,
  ];
}

/**
 * @kind Info
 *
 * @summary
 * The remote emulator could not be updated using its given manifest URL.
 *
 * @abstract
 * The remote emulator could not be retrieved from its specified URL. This could be due to a problem with
 * the network or due to the emulator website not being available right now.
 *
 * This is just an informative message. In the current scenario the emulator has been downloaded previously
 * already. Therefore, only potential updates are blocked due to the error.
 *
 * If the error persists please try to access the emulator's URL in your browser. In case this works make
 * sure that the browser does not have different proxy settings compared ot the rest of your system.
 *
 * @see
 * - [Chrome proxy settings](https://oxylabs.io/resources/integrations/chrome)
 * - [Firefox proxy settings](https://support.mozilla.org/en-US/kb/connection-settings-firefox)
 */
export function skipEmulatorUpdate_0120(manifestUrl: string): QuickMessage {
  return [LogLevels.info, '0120', `Failed to retrieve current emulator from "${manifestUrl}". Skipping update.`];
}

/**
 * @kind Warning
 *
 * @summary
 * The remote emulator could not be updated as the given manifest URL returns a differently named emulator.
 *
 * @abstract
 * When a remote emulator is first installed it will be integrated using its specified name as shell name.
 * The remote emulator is always auto-updated whenever the Piral CLI is running pilet commands. However,
 * in case the current emulator manifest has a different name the update will be blocked. In this case a
 * reinstallation of the emulator is necessary.
 *
 * Use "pilet remove-piral-instance" and "pilet add-piral-instance" to remove the old instance (by its given
 * name) and add the new instance (by the manifest URL).
 *
 * @see
 * - [Chrome proxy settings](https://oxylabs.io/resources/integrations/chrome)
 * - [Firefox proxy settings](https://support.mozilla.org/en-US/kb/connection-settings-firefox)
 */
export function remoteEmulatorNameChanged_0121(name: string): QuickMessage {
  return [LogLevels.warning, '0121', `The name of the emulator has changed. Skipping updates for "${name}".`];
}

/**
 * @kind Info
 *
 * @summary
 * An asset of the remote emulator could not be updated.
 *
 * @abstract
 * The metadata of an remote emulator has been updated, however, one of the asset files could
 * not be updated. The previously downloaded version of this file will be used as a fallback.
 *
 * Using the previously downloaded version of a file might just work, however, for several
 * reasons this might also break. In any case, if you see this info then any kinds of issues
 * appearing could potentially be solved by just giving your machine network access again or
 * waiting for the remote sources to be accessible again.
 *
 * @see
 * - [Chrome proxy settings](https://oxylabs.io/resources/integrations/chrome)
 * - [Firefox proxy settings](https://support.mozilla.org/en-US/kb/connection-settings-firefox)
 */
export function optionalEmulatorAssetUpdateSkipped_0122(url: string): QuickMessage {
  return [LogLevels.info, '0122', `Could not update asset file at "${url}".`];
}

/**
 * @kind Warning
 *
 * @summary
 * An asset of the remote emulator could not be downloaded.
 *
 * @abstract
 * The metadata of an remote emulator has been downloaded, however, one of the asset files
 * could not be downloaded. Consequently, the fallback (index.html) will be used as
 * replacement in the dev server.
 *
 * If you see this warning then any kinds of issues appearing could potentially be solved by
 * just giving your machine network access again or waiting for the remote sources to be
 * accessible again.
 *
 * @see
 * - [Chrome proxy settings](https://oxylabs.io/resources/integrations/chrome)
 * - [Firefox proxy settings](https://support.mozilla.org/en-US/kb/connection-settings-firefox)
 */
export function requiredEmulatorAssetDownloadSkipped_0123(url: string): QuickMessage {
  return [LogLevels.warning, '0123', `Could not download asset file at "${url}".`];
}

/**
 * @kind Error
 *
 * @summary
 * The emulator.json and associated files could not be found in the source directory.
 *
 * @abstract
 * Only an emulator website can be published using `piral publish`. Other artifacts such as
 * standard release artifacts or the package emulator (tgz) need to be published using other
 * mechanisms such as `npm publish`.
 *
 * If no emulator website exists you can either build one using the `--fresh` flag with
 * `piral publish` (i.e., `piral publish --fresh`) or preparing the build using `piral build`
 * with the `--type emulator-website` flag.
 *
 * @see
 * - [Emulator](https://docs.piral.io/concepts/T01-emulator)
 */
export function missingEmulatorWebsite_0130(path: string): QuickMessage {
  return [LogLevels.error, '0130', `Could not find the files for an emulator website at "${path}".`];
}

/**
 * @kind Warning
 *
 * @summary
 * The browser could not be opened.
 *
 * @abstract
 * The Piral CLI uses a package called "open" for automatically opening a browser.
 * The package tries to find the system's default browser and open it with the URL
 * given by the currently started debug process.
 *
 * This will fail under the following circumstances:
 *
 * - There are not enough rights to know what is the default browser
 * - There are not enough rights to open the default browser
 * - The default browser cannot be opened
 * - The API for opening the default browser is invalid
 *
 * @see
 * - [npm Open Package](https://www.npmjs.com/package/open)
 *
 * @example
 * The browser is usually just opened via the command line:
 *
 * ```sh
 * pilet debug --open
 * ```
 */
export function failedToOpenBrowser_0170(error: string): QuickMessage {
  return [LogLevels.error, '0170', `Unexpected error while opening in browser: ${error}.`];
}

/**
 * @kind Warning
 *
 * @summary
 * An invalid pilet schema version was found.
 *
 * @abstract
 * For building a pilet you can select a schema version to use. The schema version affects
 * the interpretation of compatible feed services slightly and has an impact of the usage
 * of the pilet in the browser.
 *
 * The selected schema version needs to be either "v0", "v1", "v2", or "mf".
 *
 * - v0: will download and evaluate the pilet explicitly
 * - v1: will use a script tag for integration of the pilet
 * - v2: will use SystemJS for integration of the pilet (default)
 * - mf: will use Module Federation for integration of the pilet (only supported bundlers)
 *
 * The v1 version has better support for older browsers, but requires a polyfill to work
 * correctly. This polyfill is part of the `piral-ie11polyfills-utils` package.
 * Alternatively, use the `currentScript-polyfill` package.
 *
 * The v2 version uses a SystemJS format for the pilet. It has the broadest browser support
 * but requires the custom format as output. Most bundlers support SystemJS directly or
 * indirectly, making it a quite broad choice.
 *
 * In bundlers that support Module Federation (e.g., Webpack 5) the "mf" format may be
 * the best choice. Keep in mind that "mf" is only supported by applications using
 * Piral 1.4.0 or higher.
 *
 * @see
 * - [GitHub currentScript-polyfill](https://github.com/amiller-gh/currentScript-polyfill)
 *
 * @example
 * Use the following command to switch explicitly to v0:
 *
 * ```sh
 * pilet build --schema v0
 * ```
 */
export function invalidSchemaVersion_0171(schemaVersion: string, schemas: Array<string>): QuickMessage {
  const s = schemas.map((m) => `"${m}"`).join(', ');
  return [LogLevels.warning, '0171', `Found invalid pilet schema version "${schemaVersion}". Available schemas: ${s}.`];
}

/**
 * @kind Error
 *
 * @summary
 * The provided bundler is not available.
 *
 * @abstract
 * Piral allows you to set up your own tooling for building and debugging. This
 * is a powerful concept. By default, the Webpack v5 bundler is used.
 * Alternatives include Parcel and Rollup.
 *
 * In case where multiple bundlers are installed the first one is picked. This
 * may not be what you want. In this scenario you can override the selection by
 * explicitly picking a bundler name (e.g., "parcel"). If, for some reason, the
 * name does not correspond to one of the currently installed bundlers the
 * bundler missing error appears.
 *
 * @see
 * - [Webpack](https://webpack.js.org)
 * - [Parcel](https://parceljs.org)
 * - [esbuild](https://esbuild.github.io)
 * - [rspack](https://www.rspack.dev/)
 * - [Pluggable bundlers](https://docs.piral.io/concepts/T02-bundlers)
 *
 * @example
 * Use the following command to make the parcel bundler available:
 *
 * ```sh
 * npm i piral-cli-parcel --save-dev
 * ```
 */
export function bundlerMissing_0172(bundlerName: string, installed: Array<string>): QuickMessage {
  const s = installed.map((m) => `"${m}"`).join(', ');
  return [LogLevels.error, '0172', `Cannot find bundler "${bundlerName}". Installed bundlers: ${s}.`];
}

/**
 * @kind Error
 *
 * @summary
 * No default bundler is available.
 *
 * @abstract
 * Piral allows you to set up your own tooling for building and debugging. This
 * is a powerful concept. By default, the Webpack v5 bundler is used.
 * Alternatives include Parcel and Rollup.
 *
 * In case where no bundler is installed and the default bundler could not be
 * successfully installed this error is shown.
 *
 * @see
 * - [Webpack](https://webpack.js.org)
 * - [Parcel](https://parceljs.org)
 * - [esbuild](https://esbuild.github.io)
 * - [rspack](https://www.rspack.dev/)
 * - [Pluggable bundlers](https://docs.piral.io/concepts/T02-bundlers)
 *
 * @example
 * Use the following command to make the parcel bundler available:
 *
 * ```sh
 * npm i piral-cli-parcel --save-dev
 * ```
 */
export function defaultBundlerMissing_0173(): QuickMessage {
  return [LogLevels.error, '0173', `Cannot find a default bundler.`];
}

/**
 * @kind Error
 *
 * @summary
 * The bundling process failed.
 *
 * @abstract
 * For transforming sources (e.g., a Piral instance or a pilet) into a single
 * set of distributables (JS, CSS, other assets) a bundler is used. When the
 * transformation process fails the Piral CLI will report the received error
 * from the underlying bundler.
 *
 * The detailed set of logs / messages should be available in the command
 * line. These are formatted according to the currently used bundler.
 *
 * @see
 * - [Webpack](https://webpack.js.org)
 * - [Parcel](https://parceljs.org)
 * - [esbuild](https://esbuild.github.io)
 * - [rspack](https://www.rspack.dev/)
 * - [Pluggable bundlers](https://docs.piral.io/concepts/T02-bundlers)
 *
 * @example
 * Use the following command to make the parcel bundler available:
 *
 * ```sh
 * npm i piral-cli-parcel --save-dev
 * ```
 */
export function bundlingFailed_0174(error: string): QuickMessage {
  return [LogLevels.error, '0174', `The bundling process failed: ${error || 'Invalid input.'}`];
}

/**
 * @kind Warning
 *
 * @summary
 * No bundler has been specified even though multiple are available.
 *
 * @abstract
 * Piral allows you to set up your own tooling for building and debugging. This
 * is a powerful concept. By default, the Webpack v5 bundler is used.
 * Alternatives include Parcel and Rollup.
 *
 * In case where multiple bundlers are installed the first one is picked. This
 * may not be what you want. In this scenario you can explicitly set the bundler
 * to use by providing a bundler name (e.g., "parcel").
 *
 * The warning is shown when there are multiple bundlers available, but none has
 * been explicitly demanded. Since the chosen bundler may be installation
 * dependent we recommend setting the bundler explicitly.
 *
 * @see
 * - [Pluggable bundlers](https://docs.piral.io/concepts/T02-bundlers)
 *
 * @example
 * Use the following command to explicitly choose the Parcel bundler:
 *
 * ```sh
 * piral build --bundler parcel
 * ```
 */
export function bundlerUnspecified_0175(available: Array<string>): QuickMessage {
  const s = available.map((m) => `"${m}"`).join(', ');
  return [
    LogLevels.warning,
    '0175',
    `No bundler has been specified even though multiple are available. Choices: ${s}.`,
  ];
}

/**
 * @kind Warning
 *
 * @summary
 * No bundler has been installed yet.
 *
 * @abstract
 * Piral allows you to set up your own tooling for building and debugging. This
 * is a powerful concept. By default, the Webpack v5 bundler is used.
 * Alternatives include Parcel and Rollup.
 *
 * In case no bundler is yet installed the Piral CLI will automatically install
 * the default bundler. However, you should consider installing a bundler of your
 * choice (even if this could also be the default bundler) explicitly.
 *
 * @see
 * - [Pluggable bundlers](https://docs.piral.io/concepts/T02-bundlers)
 *
 * @example
 * Use the following command to install esbuild as a bundler with the npm client:
 *
 * ```sh
 * npm i piral-cli-esbuild --save-dev
 * ```
 */
export function bundlerNotInstalled_0176(): QuickMessage {
  return [LogLevels.warning, '0176', `Installing default bundler since no bundler has been found.`];
}

/**
 * @kind Warning
 *
 * @summary
 * No pilet.json has been found.
 *
 * @abstract
 * For some functionality such as multi Piral instance support when debugging
 * a pilet, a special file called pilet.json is required. While this file is
 * optional in general, it must be available for certain tasks such as adding
 * or removing a Piral instance for debugging purposes.
 *
 * @see
 * - [Pluggable bundlers](https://docs.piral.io/concepts/T02-bundlers)
 *
 * @example
 * If no pilet.json is yet available you can create one. It should be adjacent to
 * the package.json of your pilet, even though different locations are also possible.
 * By default, the following content can be used for an empty file:
 *
 * ```json
 * {
 *   "$schema": "https://docs.piral.io/schemas/pilet-v0.json"
 * }
 * ```
 */
export function piletJsonNotAvailable_0180(root: string): QuickMessage {
  return [LogLevels.warning, '0180', `No "pilet.json" was found for the pilet at "${root}".`];
}

/**
 * @kind Error
 *
 * @summary
 * Using the given platform is not supported.
 *
 * @abstract
 * The Piral instance can run on multiple platforms. The platform is specified via
 * the piral.json file.
 *
 * The standard platform is "web", which starts a web server using the server
 * proxy kras.
 *
 * @example
 * (tbd)
 */
export function platformNotSupported_0190(platform: string): QuickMessage {
  return [LogLevels.error, '0190', `The given platform "${platform}" is not supported.`];
}

/**
 * @kind Warning
 *
 * @summary
 * An invalid argument for "commandName" was supplied.
 *
 * @abstract
 * This warning indicates that a Piral CLI plugin is not working as intended. Usually,
 * you should not see this as a user, but rather as a developer testing a Piral CLI
 * plugin before publishing it.
 *
 * If you see this warning as a user make sure to file an issue at the relevant plugin's
 * repository or issue tracker.
 *
 * @see
 * - [Invalid Parameter](https://www.pcmag.com/encyclopedia/term/invalid-parameter)
 *
 * @example
 * ...
 */
export function apiCommandNameInvalid_0200(type: string): QuickMessage {
  return [LogLevels.warning, '0200', `Invalid argument for "commandName" - no ${type} added.`];
}

/**
 * @kind Warning
 *
 * @summary
 * An invalid value for the given argument was supplied.
 *
 * @abstract
 * This warning indicates that a Piral CLI plugin is not working as intended. Usually,
 * you should not see this as a user, but rather as a developer testing a Piral CLI
 * plugin before publishing it.
 *
 * If you see this warning as a user make sure to file an issue at the relevant plugin's
 * repository or issue tracker.
 *
 * @see
 * - [Semantic Versioning](https://semver.org)
 *
 * @example
 * ...
 */
export function apiArgumentInvalid_0201(name: string, type: string): QuickMessage {
  return [LogLevels.warning, '0201', `Invalid argument for "${name}" - no ${type} added.`];
}

/**
 * @kind Warning
 *
 * @summary
 * An invalid argument for "name" was supplied.
 *
 * @abstract
 * This warning indicates that a Piral CLI plugin is not working as intended. Usually,
 * you should not see this as a user, but rather as a developer testing a Piral CLI
 * plugin before publishing it.
 *
 * If you see this warning as a user make sure to file an issue at the relevant plugin's
 * repository or issue tracker.
 *
 * @see
 * - [Semantic Versioning](https://semver.org)
 *
 * @example
 * ...
 */
export function apiValidateNameInvalid_0202(type: string): QuickMessage {
  return [LogLevels.warning, '0202', `Invalid argument for "name" - no ${type} rule added.`];
}

/**
 * @kind Warning
 *
 * @summary
 * An invalid argument for "run" was supplied.
 *
 * @abstract
 * This warning indicates that a Piral CLI plugin is not working as intended. Usually,
 * you should not see this as a user, but rather as a developer testing a Piral CLI
 * plugin before publishing it.
 *
 * If you see this warning as a user make sure to file an issue at the relevant plugin's
 * repository or issue tracker.
 *
 * @see
 * - [Semantic Versioning](https://semver.org)
 *
 * @example
 * ...
 */
export function apiValidateRunInvalid_0203(type: string): QuickMessage {
  return [LogLevels.warning, '0203', `Invalid argument for "run" - no ${type} rule added.`];
}

/**
 * @kind Warning
 *
 * @summary
 * An invalid value for the given argument was supplied.
 *
 * @abstract
 * This warning indicates that a Piral CLI plugin is not working as intended. Usually,
 * you should not see this as a user, but rather as a developer testing a Piral CLI
 * plugin before publishing it.
 *
 * If you see this warning as a user make sure to file an issue at the relevant plugin's
 * repository or issue tracker.
 *
 * @see
 * - [Semantic Versioning](https://semver.org)
 *
 * @example
 * ...
 */
export function apiPatchInvalid_0204(name: string): QuickMessage {
  return [LogLevels.warning, '0204', `Invalid argument for "${name}" - nothing installed.`];
}

/**
 * @kind Warning
 *
 * @summary
 * The plugin could not be loaded.
 *
 * @abstract
 * This warning is shown when a found plugin could not be loaded during the startup of
 * the Piral CLI. This could be an incompatible plugin or no plugin at all.
 *
 * Make sure that this is a valid plugin.
 *
 * Our recommendation is to get in touch with the author of the plugin if you think that
 * this is a mistake and happened due to regression.
 *
 * @see
 * - [CLI Plugin Definition](https://www.npmjs.com/package/piral-cli#plugins)
 *
 * @example
 * ...
 */
export function pluginCouldNotBeLoaded_0205(pluginPath: string, ex: any): QuickMessage {
  return [LogLevels.warning, '0205', `Failed to load plugin from "${pluginPath}": ${ex}`];
}

/**
 * @kind Warning
 *
 * @summary
 * An invalid value for the given argument was supplied.
 *
 * @abstract
 * This warning indicates that a Piral CLI bundler plugin is not working as intended.
 * Usually, you should not see this as a user, but rather as a developer testing a
 * Piral CLI plugin before publishing it.
 *
 * If you see this warning as a user make sure to file an issue at the relevant plugin's
 * repository or issue tracker.
 *
 * @see
 * - [Semantic Versioning](https://semver.org)
 *
 * @example
 * ...
 */
export function apiBundlerInvalid_0206(name: string): QuickMessage {
  return [LogLevels.warning, '0206', `Invalid argument for "${name}" - skipped bundler.`];
}

/**
 * @kind Warning
 *
 * @summary
 * An invalid value for the given argument was supplied.
 *
 * @abstract
 * This warning indicates that a Piral CLI release provider plugin is not working as
 * intended.
 *
 * Usually, you should not see this as a user, but rather as a developer testing a
 * Piral CLI plugin before publishing it.
 *
 * If you see this warning as a user make sure to file an issue at the relevant plugin's
 * repository or issue tracker.
 *
 * @see
 * - [Semantic Versioning](https://semver.org)
 *
 * @example
 * ...
 */
export function apiReleaseProviderInvalid_0207(name: string): QuickMessage {
  return [LogLevels.warning, '0207', `Invalid argument for "${name}" - skipped bundler.`];
}

/**
 * @kind Warning
 *
 * @summary
 * The declared Piral instances are different.
 *
 * @abstract
 * In a multi-pilet debugging scenario where one (or more) pilets
 * declared a different Piral instance in their package.json this
 * warning appears. It should remind you that only the Piral instance
 * from the first found pilet will be used.
 *
 * Usually the warning is an indicator for you that something is not
 * right. It could be that an invalid pilet, or a wrong folder or
 * repository has been mixed in your multi-pilet debugging source set.
 *
 * @example
 * Have a look at the package.json of each pilet. Find the differences
 * and either re-align them, improve your multi-pilet selection, or
 * remove the invalid pilet.
 */
export function piletMultiDebugAppShellDifferent_0301(expected: string, actual: string): QuickMessage {
  return [LogLevels.warning, '0301', `Different app shells found: "${expected}" and "${actual}".`];
}

/**
 * @kind Warning
 *
 * @summary
 * The used Piral instance versions are different.
 *
 * @abstract
 * In a multi-pilet debugging scenario where one (or more) pilets
 * declared the same Piral instance in their package.json, but the
 * found Piral instances have different versions, this warning appears.
 * It should remind you that only the Piral instance from the first
 * found pilet will be used.
 *
 * Usually the warning is an indicator for you that something is not
 * right. It could be that some pilet(s) have not been properly set up
 * or updated.
 *
 * @example
 * Have a look at the package.json of each pilet. Find the differences
 * and either re-align them, improve your multi-pilet selection, or
 * remove the invalid pilet.
 */
export function piletMultiDebugAppShellVersions_0302(expected: string, actual: string): QuickMessage {
  return [LogLevels.warning, '0302', `Different app shell versions found: "${expected}" and "${actual}".`];
}

/**
 * @kind Warning
 *
 * @summary
 * The declared shared dependencies are different.
 *
 * @abstract
 * In a multi-pilet debugging scenario where one (or more) pilets
 * declared a different set of externals in their package.json this
 * warning appears. It should remind you that only the externals from
 * the first found pilet will be used.
 *
 * Usually the warning is an indicator for you that something is not
 * right. It could be that some pilet(s) have not been properly set up
 * or updated.
 *
 * @example
 * Have a look at the package.json of each pilet. Find the differences
 * and either re-align them, improve your multi-pilet selection, or
 * remove the invalid pilet.
 */
export function piletMultiDebugExternalsDifferent_0303(expected: Array<string>, actual: Array<string>): QuickMessage {
  const el = expected.join(', ');
  const al = actual.join(', ');
  return [LogLevels.warning, '0303', `Different shared dependencies encountered: "${el}" and "${al}".`];
}
