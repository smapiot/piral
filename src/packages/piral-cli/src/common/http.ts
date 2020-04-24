import axios from 'axios';
import * as FormData from 'form-data';
import { Agent } from 'https';
import { platform } from 'os';
import { log } from './log';

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

export function postFile(target: string, key: string, file: Buffer, ca?: Buffer) {
  const form = new FormData();
  const httpsAgent = ca ? new Agent({ ca }) : undefined;
  form.append('file', file, 'pilet.tgz');
  return axios
    .post(target, form, {
      headers: {
        ...form.getHeaders(),
        authorization: `Basic ${key}`,
        'user-agent': `piral-cli/http.node-${os}`,
      },
      httpsAgent,
    })
    .then(
      () => true,
      error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const { data, statusText, status } = error.response;
          const message = getMessage(data);
          log('unsuccessfulHttpPost_0066', statusText, status, message || '');
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          log('failedHttpPost_0065', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          log('failedHttpPost_0065', error.message);
        }

        return false;
      },
    );
}
