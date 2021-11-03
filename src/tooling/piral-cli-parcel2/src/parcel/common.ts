import type { LogLevels } from 'piral-cli';

export function getLevel(logLevel: LogLevels) {
  switch (logLevel) {
    case 0:
      return 'none';
    case 1:
      return 'error';
    case 2:
      return 'warn';
    case 3:
      return 'info';
    case 4:
    case 5:
      return 'verbose';
  }
}
