import { join, dirname } from 'path';
import { ruleSummary, runRules, retrievePiletData } from '../common';
import { getPiletRules } from '../rules';

export interface ValidatPiletOptions {
  entry?: string;
  logLevel?: 1 | 2 | 3;
  app?: string;
}

export const validatePiletDefaults = {
  entry: './src/index',
  logLevel: 3 as const,
};

export async function validatePilet(baseDir = process.cwd(), options: ValidatPiletOptions = {}) {
  const { entry = validatePiletDefaults.entry, logLevel = validatePiletDefaults.logLevel, app } = options;
  const rules = await getPiletRules();
  const entryFile = join(baseDir, entry);
  const target = dirname(entryFile);
  const { dependencies, peerDependencies, devDependencies, root, ...data } = await retrievePiletData(target, app);
  const errors: Array<string> = [];
  const warnings: Array<string> = [];

  await runRules(rules, {
    error(message) {
      errors.push(message);
    },
    warning(message) {
      warnings.push(message);
    },
    logLevel,
    entry: entryFile,
    dependencies,
    devDependencies,
    peerDependencies,
    root,
    data,
  });

  ruleSummary(errors, warnings);
}
