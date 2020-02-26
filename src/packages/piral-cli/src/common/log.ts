import * as logger from '@parcel/logger';
import * as messages from '../messages';
import { format } from 'util';
import { LogLevels } from './types';

type Messages = typeof messages;
type MessageTypes = keyof Messages;

export function setLogLevel(logLevel: LogLevels) {
  logger.setOptions({ logLevel });
}

export function logInfo(message: string, ...args: Array<string | number | boolean>) {
  logger.log(format(message, ...args));
}

export function logDebug(message: string, ...args: Array<string | number | boolean>) {
  logger.verbose(format(message, ...args));
}

export function logVerbose(message: string, ...args: Array<string | number | boolean>) {
  logger.verbose(format(message, ...args));
}

export function logDone(message: string, ...args: Array<string | number | boolean>) {
  logger.success(format(message, ...args));
}

export function logWarn(message: string, ...args: Array<string | number | boolean>) {
  logger.warn(format(message, ...args));
}

export function logFail(message: string, ...args: Array<string | number | boolean>) {
  logger.error(format(message, ...args));
}

export function logProgress(message: string, ...args: Array<string | number | boolean>) {
  logger.progress(format(message, ...args));
}

export function logReset() {
  logger.lines = 0;
  logger.stopSpinner();
}

export function logMessage<T extends MessageTypes>(level: LogLevels, type: T, ...args: Parameters<Messages[T]>) {
  const [code, message] = messages[type].apply(this, args);

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
