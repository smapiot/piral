import ora from 'ora';
import { format } from 'util';

const instance = ora();

let currentProgress: string = undefined;

export function logInfo(message: string, ...args: Array<string | number | boolean>) {
  const msg = format(message, ...args);
  instance.info(msg);
  return msg;
}

export function logDone(message: string, ...args: Array<string | number | boolean>) {
  const msg = format(message, ...args);
  instance.succeed(msg);
  return msg;
}

export function logWarn(message: string, ...args: Array<string | number | boolean>) {
  const msg = format(message, ...args);
  instance.warn(msg);
  return msg;
}

export function logFail(message: string, ...args: Array<string | number | boolean>) {
  const msg = format(message, ...args);
  instance.fail(msg);
  return msg;
}

export function progress(message: string, ...args: Array<string | number | boolean>) {
  const msg = format(message, ...args);
  instance.start(msg);
  currentProgress = msg;
}

export function logReset() {
  instance.stop();
}

export function logSuspend() {
  logReset();

  return () => instance.start(currentProgress);
}

export function fail(message: string, ...args: Array<string | number | boolean>): never {
  logFail(message, ...args);
  process.exit(1);
}
