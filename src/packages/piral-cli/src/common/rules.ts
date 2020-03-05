import { fail, log } from './log';
import { RuleContext, Rule } from '../types';

export function ruleSummary(errors: Array<string>, warnings: Array<string>) {
  if (errors.length > 0) {
    fail('validationFailed_0080', errors.length);
  } else if (warnings.length > 0) {
    log('validationWarned_0081', warnings.length);
  } else {
    log('validationSuccess_0082');
  }
}

export async function runRules<T extends RuleContext>(
  rules: Array<Rule<T>>,
  context: T,
  configurations: Record<string, any> = {},
) {
  for (const rule of rules) {
    const options = configurations[rule.name];
    await rule.run(context, options);
  }
}
