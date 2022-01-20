import { log } from './log';
import { open } from '../external';
import { config } from './config';

export async function openBrowser(shouldOpen: boolean, port: number, path: string, https?: boolean) {
  if (shouldOpen) {
    try {
      const scheme = https ? 'https' : 'http';
      const address = `${scheme}://${config.host}:${port}${path}`;
      await open(address, undefined);
    } catch (err) {
      log('failedToOpenBrowser_0170', err);
    }
  }
}
