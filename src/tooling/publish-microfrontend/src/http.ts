import axios from 'axios';
import FormData from 'form-data';
import { Agent } from 'https';
import { Stream } from 'stream';
import { createWriteStream } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { logWarn } from './log';
import { standardHeaders } from './common';
import { getTokenInteractively } from './interactive';

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

export interface PostFormResult {
  status: number;
  success: boolean;
  response?: object;
}

export type FormDataObj = Record<string, string | [Buffer, string]>;

function streamToFile(source: Stream, target: string) {
  const dest = createWriteStream(target);
  return new Promise<Array<string>>((resolve, reject) => {
    source.pipe(dest);
    source.on('error', (err) => reject(err));
    dest.on('finish', () => resolve([target]));
  });
}

export async function downloadFile(url: string, ca?: Buffer): Promise<Array<string>> {
  const httpsAgent = ca ? new Agent({ ca }) : undefined;

  try {
    const res = await axios.get<Stream>(url, {
      responseType: 'stream',
      headers: standardHeaders,
      httpsAgent,
    });
    const rid = Math.random().toString(36).split('.').pop();
    const target = join(tmpdir(), `microfrontend_${rid}.tgz`);
    return streamToFile(res.data, target);
  } catch (error) {
    logWarn('Failed HTTP GET requested: %s', error.message);
    return [];
  }
}

export function postForm(
  target: string,
  scheme: string,
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

  return axios
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
              return getTokenInteractively(interactiveAuth, httpsAgent).then(({ mode, token }) =>
                postForm(target, mode, token, formData, customHeaders, ca, false),
              );
            }
          }

          const message = getMessage(data) || '';
          logWarn('The HTTP Post request failed with status %s (%s): %s', status, statusText, message);
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

          logWarn('The HTTP Post request failed with error: %s', errorMessage);
          return {
            status: 500,
            success: false,
            response: errorMessage,
          };
        } else if (error.request) {
          logWarn('The HTTP Post request failed unexpectedly.');
        } else {
          logWarn('The HTTP Post request failed with error: %s', error.message);
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
  scheme: string,
  key: string,
  file: Buffer,
  customFields: Record<string, string> = {},
  customHeaders: Record<string, string> = {},
  ca?: Buffer,
  interactive = false,
): Promise<PostFormResult> {
  const data: FormDataObj = { ...customFields, file: [file, 'microfrontend.tgz'] };
  return postForm(target, scheme, key, data, customHeaders, ca, interactive);
}
