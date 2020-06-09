import { log } from './log';

export async function openBrowser(shouldOpen: boolean, port: number) {
  if (shouldOpen) {
    try {
      const open = require('opn');
      await open(`http://localhost:${port}`, undefined);
    } catch (err) {
      log('failedToOpenBrowser_0070', err);
    }
  }
}
