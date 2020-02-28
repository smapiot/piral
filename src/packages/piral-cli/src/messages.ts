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
