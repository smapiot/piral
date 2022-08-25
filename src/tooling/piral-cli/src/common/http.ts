import { join } from 'path';
import { Agent } from 'https';
import { Stream } from 'stream';
import { tmpdir } from 'os';
import { createWriteStream } from 'fs';
import { log } from './log';
import { standardHeaders } from './info';
import { getTokenInteractively } from './interactive';
import { axios, FormData } from '../external';
import { PiletPublishScheme } from '../types';

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
      headers: standardHeaders,
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

export interface PostFormResult {
  status: number;
  success: boolean;
  response?: object;
}

export type FormDataObj = Record<string, string | [Buffer, string]>;

export function postForm(
  target: string,
  scheme: PiletPublishScheme,
  key: string,
  formData: FormDataObj,
  customHeaders: Record<string, string> = {},
  ca?: Buffer,
  interactive = false,
): Promise<PostFormResult> {
  const httpsAgent = ca ? new Agent({ ca }) : undefined;
  const form = new FormData();

  Object.keys(formData).forEach((key) => {
    const value = formData[key];

    if (typeof value === 'string') {
      form.append(key, value);
    } else {
      form.append(key, value[0], value[1]);
    }
  });

  const headers: Record<string, string> = {
    ...form.getHeaders(),
    ...standardHeaders,
    ...customHeaders,
  };

  if (key) {
    switch (scheme) {
      case 'basic':
        headers.authorization = `Basic ${key}`;
        break;
      case 'bearer':
        headers.authorization = `Bearer ${key}`;
        break;
      case 'digest':
        headers.authorization = `Digest ${key}`;
        break;
      case 'none':
      default:
        headers.authorization = key;
        break;
    }
  }

  return axios.default
    .post(target, form, {
      headers,
      httpsAgent,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    })
    .then(
      (res) => {
        return {
          status: res.status,
          success: true,
          response: res.data,
        };
      },
      (error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const { data, statusText, status } = error.response;

          if (interactive && 'interactiveAuth' in data) {
            const { interactiveAuth } = data;

            if (typeof interactiveAuth === 'string') {
              log(
                'generalDebug_0003',
                `Received status "${status}" from HTTP - trying interactive log in to "${interactiveAuth}".`,
              );

              return getTokenInteractively(interactiveAuth, httpsAgent).then(({ mode, token }) =>
                postForm(target, mode, token, formData, customHeaders, ca, false),
              );
            }
          }

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

export function postFile(
  target: string,
  scheme: PiletPublishScheme,
  key: string,
  file: Buffer,
  customFields: Record<string, string> = {},
  customHeaders: Record<string, string> = {},
  ca?: Buffer,
  interactive = false,
): Promise<PostFormResult> {
  const data: FormDataObj = { ...customFields, file: [file, 'pilet.tgz'] };
  return postForm(target, scheme, key, data, customHeaders, ca, interactive);
}
