import { logFail } from './log';

export async function openBrowserAt(address: string) {
  try {
    const name = 'open';
    const open = await import(name).then((c) => c.default);
    await open(address, undefined);
  } catch (err) {
    logFail('Failed to open the browser: %s', err);
  }
}
