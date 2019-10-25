import { logInfo, logWarn, logFail } from './log';
import { RuleContext, Rule } from '../types';

export function ruleSummary(errors: Array<string>, warnings: Array<string>) {
  logInfo('');
  logInfo(`Found ${warnings.length} warning(s) and ${errors.length} error(s).`);
  logInfo('');
  warnings.forEach(warning => logWarn(warning));
  errors.forEach(error => logFail(error));

  if (errors.length > 0) {
    throw new Error(`Please fix the ${errors.length} error(s).`);
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
