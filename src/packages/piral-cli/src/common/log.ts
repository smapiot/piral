import chalk from 'chalk';

function normEntry(prefix: string, message: string, maxLength = 30) {
  const input = `${prefix}: ${message}`;

  if (input.length > maxLength) {
    return `${input.substring(0, maxLength)}...`;
  }

  return input;
}

export function logDebug(message: string, ...args: Array<string | number | boolean>) {
  console.log(`[debug] ${message}`, ...args.map(arg => chalk.bold(arg.toString())));
}

export function logVerbose(message: string, ...args: Array<string | number | boolean>) {
  console.log(chalk.gray(message), ...args.map(arg => chalk.bold(arg.toString())));
}

export function logInfo(message: string, ...args: Array<string | number | boolean>) {
  console.log(message, ...args.map(arg => chalk.bold(arg.toString())));
}

export function logDone(message: string, ...args: Array<string | number | boolean>) {
  console.log(chalk.greenBright(message), ...args.map(arg => chalk.bold(arg.toString())));
}

export function logWarn(message: string, ...args: Array<string | number | boolean>) {
  console.warn(chalk.yellow(message), ...args.map(arg => chalk.bold(arg.toString())));
}

export function logFail(message: string, ...args: Array<string | number | boolean>) {
  console.error(chalk.red(message), ...args.map(arg => chalk.bold(arg.toString())));
}

export interface ContextLogger {
  success(): boolean;
  throwIfError(): void;
  summary(): void;
  notify(kind: 'error' | 'warning', message: string): void;
}

export type NotifyContextLogger = ContextLogger['notify'];

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
