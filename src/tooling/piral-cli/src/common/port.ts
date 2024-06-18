import { log, fail } from './log';
import { getPort } from '../external';

export async function getAvailablePort(defaultPort: number, strict: boolean) {
  const selectedPort = await getFreePort(defaultPort);

  if (selectedPort !== defaultPort) {
    if (strict) {
      // exit
      fail('portNotFree_0048', defaultPort);
    } else {
      // just print warning
      log('portChanged_0047', selectedPort, defaultPort);
    }
  }

  return selectedPort;
}

export async function getFreePort(preferred?: number) {
  log('generalDebug_0003', `Looking for a free port. Preferred port: ${preferred}`);
  const port = await getPort(preferred && { port: preferred });
  log('generalDebug_0003', `Found port ${port} free for usage.`);
  return port;
}
