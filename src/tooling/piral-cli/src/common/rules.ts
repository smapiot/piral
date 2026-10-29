import { fail, log, logDone } from './log';
import { RuleContext, Rule } from '../types';

export function ruleSummary(errors: Array<string>, warnings: Array<string>) {
  if (errors.length > 0) {
    fail('validationFailed_0080', errors.length);
  } else if (warnings.length > 0) {
    log('validationWarned_0081', warnings.length);
  } else {
    logDone('Validation successful. No errors or warnings.');
  }
}

export async function runRules<T extends RuleContext>(
  rules: Array<Rule<T>>,
  context: T,
  configurations: Record<string, any> = {},
  strict = false,
) {
  const loadedRules = new Set(rules.map(rule => rule.name));
  const missingRules = Object.keys(configurations).filter(name => !loadedRules.has(name));

  if (missingRules.length > 0) {
    const message = `Configured validator(s) could not be loaded: ${missingRules.join(', ')}`;

    if (strict) {
      context.error(message);
    } else {
      context.warning(message);
    }
  }

  for (const rule of rules) {
    log('generalDebug_0003', `Running rule "${rule?.name}" ...`);
    const options = configurations[rule.name];
    await rule.run(context, options);
  }
}
