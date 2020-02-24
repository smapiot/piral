import chalk from 'chalk';
import * as messages from '../messages';
import { ContextLogger, LogLevels } from './types';

type Messages = typeof messages;
type MessageTypes = keyof Messages;

let maxLevel: LogLevels = LogLevels.info;

function normEntry(prefix: string, message: string, maxLength = 30) {
  const input = `${prefix}: ${message}`;

  if (input.length > maxLength) {
    return `${input.substring(0, maxLength)}...`;
  }

  return input;
}

function logMessage(level: LogLevels, code: string, message: string) {
  switch (level) {
    case LogLevels.error:
      return logFail(`[%s] ${message}`, code);
    case LogLevels.warning:
      return logWarn(`[%s] ${message}`, code);
    case LogLevels.info:
      return logInfo(`[%s] ${message}`, code);
    case LogLevels.debug:
      return logDebug(`[%s] ${message}`, code);
    case LogLevels.verbose:
      return logVerbose(`[%s] ${message}`, code);
  }
}

export function setLogLevel(level: LogLevels) {
  maxLevel = level;
}

export function logDebug(message: string, ...args: Array<string | number | boolean>) {
  if (maxLevel >= LogLevels.debug) {
    console.log(`[debug] ${message}`, ...args.map(arg => chalk.bold(arg.toString())));
  }
}

export function logVerbose(message: string, ...args: Array<string | number | boolean>) {
  if (maxLevel >= LogLevels.verbose) {
    console.log(chalk.gray(message), ...args.map(arg => chalk.bold(arg.toString())));
  }
}

export function logInfo(message: string, ...args: Array<string | number | boolean>) {
  if (maxLevel >= LogLevels.info) {
    console.log(message, ...args.map(arg => chalk.bold(arg.toString())));
  }
}

export function logDone(message: string, ...args: Array<string | number | boolean>) {
  if (maxLevel !== LogLevels.disabled) {
    console.log(chalk.greenBright(message), ...args.map(arg => chalk.bold(arg.toString())));
  }
}

export function logWarn(message: string, ...args: Array<string | number | boolean>) {
  if (maxLevel >= LogLevels.warning) {
    console.warn(chalk.yellow(message), ...args.map(arg => chalk.bold(arg.toString())));
  }
}

export function logFail(message: string, ...args: Array<string | number | boolean>) {
  if (maxLevel >= LogLevels.error) {
    console.error(chalk.red(message), ...args.map(arg => chalk.bold(arg.toString())));
  }
}

export function log<T extends MessageTypes>(level: LogLevels, type: T, ...args: Parameters<Messages[T]>) {
  const [code, message] = messages[type].apply(this, args);
  logMessage(level, code, message);
}

export function createContextLogger(): ContextLogger {
  const errors: Array<string> = [];
  const warnings: Array<string> = [];
  return {
    success() {
      return errors.length === 0;
    },
    summary() {
      const el = errors.length;
      const wl = warnings.length;

      if (el > 0) {
        logFail(`Finished with ${el} error(s) and ${wl} warning(s).`);
      } else if (wl > 0) {
        logWarn(`Finished with ${el} error(s) and ${wl} warning(s).`);
      } else {
        logDone('Finished without any errors or warnings.');
      }

      errors.forEach(m => logVerbose(m));
      warnings.forEach(m => logVerbose(m));
    },
    throwIfError() {
      if (errors.length) {
        throw new Error('Finished with errors.');
      }
    },
    notify(kind, message) {
      switch (kind) {
        case 'error':
          logFail(message);
          return errors.push(normEntry('ERR', message));
        case 'warning':
          logWarn(message);
          return warnings.push(normEntry('WARN', message));
      }
    },
  };
}
