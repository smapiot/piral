import { log } from './log';
import { config } from './config';
import { open } from '../external';

export async function openBrowserAt(address: string) {
  try {
    await open(address, undefined);
  } catch (err) {
    log('failedToOpenBrowser_0170', err);
  }
}

export async function openBrowser(shouldOpen: boolean, port: number, path: string, https?: boolean) {
  if (shouldOpen) {
    const scheme = https ? 'https' : 'http';
    const address = `${scheme}://${config.host}:${port}${path}`;
    await openBrowserAt(address);
  }
}
