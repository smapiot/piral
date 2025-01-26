import { join, dirname, resolve } from 'path';
import { ruleSummary, runRules, retrievePiletData, getPiletsInfo, setLogLevel, progress, log, ensure } from '../common';
import { getPiletRules } from '../rules';
import { PiletRuleContext, LogLevels } from '../types';

export interface ValidatPiletOptions {
  /**
   * Sets the root module of the pilet.
   */
  entry?: string;

  /**
   * Sets the log level to use (1-5).
   */
  logLevel?: LogLevels;

  /**
   * Overrides the Piral instance used as validation blueprint for the pilet.
   */
  app?: string;
}

export const validatePiletDefaults: ValidatPiletOptions = {
  entry: './src/index',
  logLevel: LogLevels.info,
  app: undefined,
};

export async function validatePilet(baseDir = process.cwd(), options: ValidatPiletOptions = {}) {
  const {
    entry = validatePiletDefaults.entry,
    logLevel = validatePiletDefaults.logLevel,
    app = validatePiletDefaults.app,
  } = options;

  ensure('baseDir', baseDir, 'string');
  ensure('entry', entry, 'string');

  const fullBase = resolve(process.cwd(), baseDir);
  setLogLevel(logLevel);
  progress('Reading configuration ...');

  const rules = await getPiletRules();
  const entryFile = join(fullBase, entry);
  const target = dirname(entryFile);
  const {
    dependencies,
    peerDependencies,
    devDependencies,
    peerModules,
    root,
    importmap,
    apps,
    piletPackage,
    ignored: _0,
  } = await retrievePiletData(target, app);

  const errors: Array<string> = [];
  const warnings: Array<string> = [];

  for (const { appPackage } of apps) {
    const { validators } = getPiletsInfo(appPackage);
    const context: PiletRuleContext = {
      error(message) {
        errors.push(log('generalError_0002', message));
      },
      warning(message) {
        warnings.push(log('generalWarning_0001', message));
      },
      logLevel,
      entry: entryFile,
      dependencies,
      devDependencies,
      peerDependencies,
      importmap,
      peerModules,
      root,
      apps,
      piletPackage,
    };

    await runRules(rules, context, validators);
  }

  ruleSummary(errors, warnings);
}
