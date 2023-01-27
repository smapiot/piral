import open from 'open';
import { logFail } from './log';

export async function openBrowserAt(address: string) {
  try {
    await open(address, undefined);
  } catch (err) {
    logFail('Failed to open the browser: %s', err);
  }
}
