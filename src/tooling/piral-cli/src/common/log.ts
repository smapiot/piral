import * as messages from '../messages';
import { join } from 'path';
import { format } from 'util';
import { createWriteStream } from 'fs';
import { isWindows } from './info';
import { stripAnsi } from '../external';
import { LogLevels, QuickMessage } from '../types';

type Messages = typeof messages;
type MessageTypes = keyof Messages;

const logger = (() => {
  try {
    const logger = require('@parcel/logger');

    // check to see if this is really right
    if (typeof logger.verbose === 'function') {
      return logger;
    }
  } catch {}

  return require('../external').logger;
})();

// unfortunately, Parcel's support for verbose logging on Windows is broken
if (isWindows) {
  logger.verbose = function (message: string) {
    if (this.logLevel < 4) {
      return;
    }

    const currDate = new Date();
    message = `[${currDate.toLocaleTimeString()}]: ${message}`;

    if (this.logLevel > 4) {
      if (!this.logFile) {
        // the critical line is the filename; it must not contain colons!
        const timestamp = currDate.toISOString().replace(/:/g, '');
        const fileName = `parcel-debug-${timestamp}.log`;
        this.logFile = createWriteStream(join(process.cwd(), fileName));
      }

      this.logFile.write(stripAnsi.default(message) + '\n');
    }

    this._log(message);
  };
}

export function setLogLevel(logLevel: LogLevels) {
  logger.setOptions({ logLevel });
}

export function logInfo(message: string, ...args: Array<string | number | boolean>) {
  const msg = format(message, ...args);
  logger.log(msg);
  return msg;
}

export function logDebug(message: string, ...args: Array<string | number | boolean>) {
  const msg = format(message, ...args);
  logger.verbose(msg);
  return msg;
}

export function logVerbose(message: string, ...args: Array<string | number | boolean>) {
  const msg = format(message, ...args);
  logger.logLevel > 3 && logger.log(msg);
  return msg;
}

export function logDone(message: string, ...args: Array<string | number | boolean>) {
  const msg = format(message, ...args);
  logger.success(msg);
  return msg;
}

export function logWarn(message: string, ...args: Array<string | number | boolean>) {
  const msg = format(message, ...args);
  logger.warn(msg);
  return msg;
}

export function logFail(message: string, ...args: Array<string | number | boolean>) {
  const msg = format(message, ...args);
  logger.error(msg);
  return msg;
}

export function progress(message: string, ...args: Array<string | number | boolean>) {
  logger.progress(format(message, ...args));
}

export function logReset() {
  logger.lines = 0;
  logger.stopSpinner();
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
