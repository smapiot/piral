import * as request from 'request';
import { platform } from 'os';
import { logWarn } from './log';

const os = platform();

function getMessage(body: string) {
  if (body) {
    try {
      const content = JSON.parse(body);
      return content.message;
    } catch (ex) {
      return body;
    }
  }

  return '';
}

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
      (err, res, body) => {
        if (err) {
          logWarn(err);
          resolve(false);
        } else {
          const status = res.statusCode;
          const success = status === 200;

          if (!success) {
            const message = getMessage(body);
            logWarn(`Failed to upload: ${res.statusMessage} (%s).`, status);

            if (message) {
              logWarn(message);
            }
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
