import * as http from 'http';
import * as https from 'https';
import { platform } from 'os';

const os = platform();

export function postFile(target: string, key: string, file: Buffer) {
  const crlf = '\r\n';
  const boundary = `--${ Math.random().toString(16)}`;

  const body = Buffer.concat([
    Buffer.from(`${crlf}--${boundary}${crlf}form-data; name="file"; filename="pilet.tgz"${crlf}${crlf}`),
    file,
    Buffer.from(`${crlf}--${boundary}--`),
  ]);

  const headers = {
    authorization: `Basic ${key}`,
    'user-agent': `pilet-cli/http.node-${os}`,
    'content-type': `multipart/form-data; boundary=${boundary}`,
    'content-length': body.length,
  };

  return new Promise<boolean>(resolve => {
    const client =
      target.startsWith('http:') ?
      http.request(target, {
        method: 'POST',
        headers,
      }) :
      https.request(target, {
        method: 'POST',
        headers,
      });
    client.write(body);
    client.on('error', err => {
      console.warn(err);
      resolve(false);
    });
    client.on('response', res => {
      const status = res.statusCode;
      const failed = status > 204;

      if (failed) {
        console.warn(`Failed to upload: ${res.statusMessage}`);
      }

      res.on('error', () => resolve(false));

      res.on('end', () => resolve(!failed));
    });
    client.end();
  });
}
