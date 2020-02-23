/**
 * The error message tuple.
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
 * @example
 * {
 *   "name": "my-pilet",
 *   // ...
 *   "piral": {
 *     "name": "my-app-shell"
 *   }
 * }
 */
export function appInstanceNotFound(name: string): QuickMessage {
  return ['0010', `The defined Piral instance ("${name}") could not be found.`];
}
