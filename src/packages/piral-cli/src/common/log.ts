import chalk from 'chalk';

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
  console.warn(chalk.red(message), ...args.map(arg => chalk.bold(arg.toString())));
}

export function logFail(message: string, ...args: Array<string | number | boolean>) {
  console.error(chalk.red(message), ...args.map(arg => chalk.bold(arg.toString())));
}
