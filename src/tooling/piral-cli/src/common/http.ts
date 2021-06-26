import { join } from 'path';
import { Agent } from 'https';
import { Stream } from 'stream';
import { platform, tmpdir } from 'os';
import { createWriteStream } from 'fs';
import { log } from './log';
import { axios, FormData } from '../external';

const os = platform();

function getMessage(body: string | { message?: string }) {
  if (typeof body === 'string') {
    try {
      const content = JSON.parse(body);
      return content.message;
    } catch (ex) {
      return body;
    }
  } else if (body && typeof body === 'object') {
    if ('message' in body) {
      return body.message;
    } else {
      return JSON.stringify(body);
    }
  }

  return '';
}

function streamToFile(source: Stream, target: string) {
  const dest = createWriteStream(target);
  return new Promise<Array<string>>((resolve, reject) => {
    source.pipe(dest);
    source.on('error', (err) => reject(err));
    dest.on('finish', () => resolve([target]));
  });
}

export function downloadFile(target: string, ca?: Buffer): Promise<Array<string>> {
  const httpsAgent = ca ? new Agent({ ca }) : undefined;
  return axios.default
    .get<Stream>(target, {
      responseType: 'stream',
      headers: {
        'user-agent': `piral-cli/http.node-${os}`,
      },
      httpsAgent,
    })
    .then((res) => {
      const rid = Math.random().toString(36).split('.').pop();
      const target = join(tmpdir(), `pilet_${rid}.tgz`);
      log('generalDebug_0003', `Writing the downloaded file to "${target}".`);
      return streamToFile(res.data, target);
    })
    .catch((error) => {
      log('failedHttpGet_0068', error.message);
      return [];
    });
}

export interface PostFileResult {
  status: number;
  success: boolean;
  response?: object;
}

export function postFile(
  target: string,
  key: string,
  file: Buffer,
  fields: Record<string, string> = {},
  ca?: Buffer,
): Promise<PostFileResult> {
  const form = new FormData();
  const httpsAgent = ca ? new Agent({ ca }) : undefined;

  Object.keys(fields).forEach((key) => form.append(key, fields[key]));

  form.append('file', file, 'pilet.tgz');

  const headers: Record<string, string> = {
    ...form.getHeaders(),
    'user-agent': `piral-cli/http.node-${os}`,
  };

  if (key) {
    headers.authorization = `Basic ${key}`;
  }

  return axios.default
    .post(target, form, {
      headers,
      httpsAgent,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    })
    .then(
      (res) => ({
        status: res.status,
        success: true,
        response: res.data,
      }),
      (error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const { data, statusText, status } = error.response;
          const message = getMessage(data) || '';
          log('unsuccessfulHttpPost_0066', statusText, status, message);
          return {
            status,
            success: false,
            response: message,
          };
        } else if (error.isAxiosError) {
          // axios initiated error: try to parse message from error object
          let errorMessage: string = error.errno || 'Unknown Axios Error';

          if (typeof error.toJSON === 'function') {
            const errorObj: { message?: string } = error.toJSON();
            errorMessage = errorObj?.message ?? errorMessage;
          }

          log('failedHttpPost_0065', errorMessage);
          return {
            status: 500,
            success: false,
            response: errorMessage,
          };
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          log('failedHttpPost_0065', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          log('failedHttpPost_0065', error.message);
        }

        return {
          status: 500,
          success: false,
          response: undefined,
        };
      },
    );
}
