import getPort = require('get-port');

export async function getFreePort(preferred?: number) {
  const port = await getPort(preferred && { port: preferred });
  return port;
}
