import { getPiralRules } from '../rules';
import { LogLevels } from '../types';
import {
  retrievePiralRoot,
  retrievePiletsInfo,
  ruleSummary,
  runRules,
  checkCliCompatibility,
  setLogLevel,
} from '../common';

export interface ValidatPiralOptions {
  entry?: string;
  logLevel?: LogLevels;
}

export const validatePiralDefaults: ValidatPiralOptions = {
  entry: './',
  logLevel: LogLevels.info,
};

export async function validatePiral(baseDir = process.cwd(), options: ValidatPiralOptions = {}) {
  const { entry = validatePiralDefaults.entry, logLevel = validatePiralDefaults.logLevel } = options;
  setLogLevel(logLevel);
  const rules = await getPiralRules();
  const entryFiles = await retrievePiralRoot(baseDir, entry);
  const { root, dependencies, ignored: _, ...info } = await retrievePiletsInfo(entryFiles);
  await checkCliCompatibility(root);
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
    entry: entryFiles,
    dependencies: dependencies.std,
    devDependencies: dependencies.dev,
    peerDependencies: dependencies.peer,
    root,
    info,
  });

  ruleSummary(errors, warnings);
}
