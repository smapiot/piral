import { extname } from 'path';
import { PiralRuleContext } from '../types';

export type Options = void;

/**
 * Checks that the app field is valid and points to an existing HTML file.
 */
export default function (context: PiralRuleContext, options: Options = undefined) {
  if (!context.entry.endsWith('.html')) {
    context.warning(`
The resolved app should be an HTML file, otherwise it may be an invalid bundler entry point.
  Expected: Ends with ".html".
  Received: Ends with "${extname(context.entry)}".
`);
  }
}
