import { extname } from 'path';
import { PiralRuleContext } from '../types';

export interface Options {}

export default function(this: PiralRuleContext, options: Options = {}) {
  if (this.entry.endsWith('.html')) {
    this.warning(`
The resolved app should be an HTML file, otherwise it may be an invalid bundler entry point.
  Expected: Ends with ".html".
  Received: Ends with "${extname(this.entry)}".
`);
  }
}
