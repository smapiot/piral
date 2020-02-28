export const enum LogLevels {
  /**
   * Logging disabled
   */
  disabled = 0,
  /**
   * Only log errors
   */
  error = 1,
  /**
   * Log errors and warnings
   */
  warning = 2,
  /**
   * Log errors, warnings and info
   */
  info = 3,
  /**
   * Verbose logging, which keeps everything in log with timestamps
   * and also log http requests to dev server.
   */
  verbose = 4,
  /**
   * Debug logging active, which saves everything to a file with
   * timestamps.
   */
  debug = 5,
}

export interface TemplateFileLocation {
  from: string;
  to: string;
  deep?: boolean;
}

export interface PiletsInfo {
  files: Array<string | TemplateFileLocation>;
  externals: Array<string>;
  devDependencies: Record<string, string | true>;
  scripts: Record<string, string>;
  validators: Record<string, any>;
  preScaffold: string;
  postScaffold: string;
  preUpgrade: string;
  postUpgrade: string;
}

export interface RuleContext {
  error(message: string): void;
  warning(message: string): void;
  logLevel?: LogLevels;
  root: string;
  entry: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
}

export interface RuleRunner<T extends RuleContext> {
  (context: T, options: any): void | Promise<void>;
}

export interface Rule<T extends RuleContext> {
  run: RuleRunner<T>;
  name: string;
}

export interface PiralRuleContext extends RuleContext {
  info: PiletsInfo;
}

export interface PiletRuleContext extends RuleContext {
  data: PiralData;
}

export interface PiralData {
  appFile: string;
  appPackage: any;
}
