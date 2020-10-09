import { log } from './log';
import { open } from '../external';

export async function openBrowser(shouldOpen: boolean, port: number) {
  if (shouldOpen) {
    try {
      await open(`http://localhost:${port}`, undefined);
    } catch (err) {
      log('failedToOpenBrowser_0170', err);
    }
  }
}
