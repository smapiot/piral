import { getPiralRules } from '../rules';
import { LogLevels } from '../types';
import {
  retrievePiralRoot,
  retrievePiletsInfo,
  ruleSummary,
  runRules,
  checkCliCompatibility,
  setLogLevel,
  progress,
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
  progress('Reading configuration ...');
  const rules = await getPiralRules();
  const entryFiles = await retrievePiralRoot(baseDir, entry);
  const { root, dependencies, ignored: _, ...info } = await retrievePiletsInfo(entryFiles);
  const errors: Array<string> = [];
  const warnings: Array<string> = [];

  await checkCliCompatibility(root);

  await runRules(rules, {
    error(message) {
      //TODO
      errors.push(message);
    },
    warning(message) {
      //TODO
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
