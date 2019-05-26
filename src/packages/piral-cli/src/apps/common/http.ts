import * as request from 'request';
import { platform } from 'os';

const os = platform();

export function postFile(target: string, key: string, file: Buffer) {
  return new Promise<boolean>(resolve => {
    request(
      target,
      {
        method: 'POST',
        headers: {
          authorization: `Basic ${key}`,
          'user-agent': `piral-cli/http.node-${os}`,
        },
      },
      (err, res) => {
        if (err) {
          console.warn(err);
          resolve(false);
        } else {
          const status = res.statusCode;
          const success = status === 200;

          if (!success) {
            console.warn(`Failed to upload: ${res.statusMessage}`);
          }

          resolve(success);
        }
      },
    )
      .form()
      .append('file', file, {
        filename: 'pilet.tgz',
      });
  });
}
