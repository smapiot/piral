/**
 * The error message tuple. Consists of
 * 1. The unique error code
 * 2. The (short) error message
 */
export type QuickMessage = [string, string];

/**
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
  return ['0010', `The defined Piral instance ("${name}") could not be found.`];
}
