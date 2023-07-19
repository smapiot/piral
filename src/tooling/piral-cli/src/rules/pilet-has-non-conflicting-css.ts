import { analyzeCss } from 'css-conflict-inspector';
import { PiletRuleContext } from '../types';

export type Options = 'suggest' | 'required' | 'ignore';

/**
 * Checks if the pilet has some CSS rules that might conflict with other pilets.
 */
export default async function (context: PiletRuleContext, options: Options = 'suggest') {
  if (options !== 'ignore') {
    //TODO
    const result = analyzeCss('');
  }
}
