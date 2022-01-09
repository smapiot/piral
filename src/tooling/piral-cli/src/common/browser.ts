import { log } from './log';
import { open } from '../external';
import { config } from './config';

export async function openBrowser(shouldOpen: boolean, port: number, https?: boolean) {
  if (shouldOpen) {
    try {
      await open(`${https ? 'https' : 'http'}://${config.host}:${port}`, undefined);
    } catch (err) {
      log('failedToOpenBrowser_0170', err);
    }
  }
}
