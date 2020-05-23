import { log } from './log';
import { getPort } from '../external';

export async function getFreePort(preferred?: number) {
  log('generalDebug_0003', `Looking for a free port. Preferred port: ${preferred}`);
  const port = await getPort(preferred && { port: preferred });
  log('generalDebug_0003', `Found port ${port} free for usage.`);
  return port;
}
