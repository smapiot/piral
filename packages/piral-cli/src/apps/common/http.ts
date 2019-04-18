import * as http from 'http';
import * as https from 'https';
import { platform } from 'os';

const os = platform();

export function postFile(target: string, key: string, file: Buffer) {
  const headers = {
    authorization: `Basic ${key}`,
    'user-agent': `pilet-cli/http.node-${os}`,
  };
  return new Promise<boolean>(resolve => {
    const client =
      http.request({
        method: 'POST',
        href: target,
        headers,
      }) ||
      https.request({
        method: 'POST',
        href: target,
        headers,
      });
    client.write(file);
    client.on('error', () => resolve(false));
    client.on('finish', () => resolve(true));
  });
}
