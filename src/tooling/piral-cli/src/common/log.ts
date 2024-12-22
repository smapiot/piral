import * as messages from '../messages';
import { format } from 'util';
import { ora } from '../external';
import { LogLevels, QuickMessage } from '../types';

type Messages = typeof messages;
type MessageTypes = keyof Messages;
let currentProgress: string = undefined;
let logLevel = LogLevels.info;
let instance = ora();

export function getLogLevel(): LogLevels {
  return logLevel;
}

export function setLogLevel(value: LogLevels) {
  logLevel = value;
}

export function logInfo(message: string, ...args: Array<string | number | boolean>) {
  const msg = format(message, ...args);
  instance.info(msg);
  return msg;
}

export function logDebug(message: string, ...args: Array<string | number | boolean>) {
  const msg = format(message, ...args);

  if (logLevel >= LogLevels.debug) {
    instance.info(msg);
  }

  return msg;
}

export function logVerbose(message: string, ...args: Array<string | number | boolean>) {
  const msg = format(message, ...args);

  if (logLevel >= LogLevels.verbose) {
    instance.info(msg);
  }

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

export function fail<T extends MessageTypes>(type: T, ...args: Parameters<Messages[T]>): never {
  const message = log(type, ...args);
  const error = new Error(message);
  (error as any).logged = true;
  throw error;
}

export function log<T extends MessageTypes>(type: T, ...args: Parameters<Messages[T]>) {
  const [level, code, message] = messages[type].apply(this, args) as QuickMessage;

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
