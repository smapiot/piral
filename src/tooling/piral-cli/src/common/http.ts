import { basename, dirname, join } from 'path';
import { Agent } from 'https';
import { Stream } from 'stream';
import { tmpdir } from 'os';
import { createWriteStream } from 'fs';
import { log } from './log';
import { config } from './config';
import { standardHeaders } from './info';
import { checkExists, readBinary } from './io';
import { getTokenInteractively } from './interactive';
import { axios, FormData } from '../external';
import { PublishScheme } from '../types';

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

export function getAxiosOptions(url: string) {
  const auth = config.auth?.[url];

  switch (auth?.mode) {
    case 'header':
      return {
        headers: {
          [auth.key]: auth.value,
        },
      };
    case 'http':
      return {
        auth: {
          username: auth.username,
          password: auth.password,
        },
      };
    default:
      return {};
  }
}

export async function getCertificate(cert = config.cert): Promise<Buffer> {
  log('generalDebug_0003', 'Checking if certificate exists.');

  if (await checkExists(cert)) {
    const dir = dirname(cert);
    const file = basename(cert);
    log('generalDebug_0003', `Reading certificate file "${file}" from "${dir}".`);
    return await readBinary(dir, file);
  }

  return undefined;
}

export function getAuthorizationHeaders(scheme: PublishScheme, key: string) {
  if (key) {
    switch (scheme) {
      case 'basic':
        return {
          authorization: `Basic ${key}`,
        };
      case 'bearer':
        return {
          authorization: `Bearer ${key}`,
        };
      case 'digest':
        return {
          authorization: `Digest ${key}`,
        };
      case 'none':
      default:
        return {
          authorization: key,
        };
    }
  }

  return {};
}

export interface AgentOptions {
  ca?: Buffer;
  allowSelfSigned?: boolean;
}

export async function getDefaultAgent() {
  const ca = await getCertificate();
  const allowSelfSigned = config.allowSelfSigned;
  return getAgent({ ca, allowSelfSigned });
}

export function getAgent({ allowSelfSigned, ca }: AgentOptions) {
  if (ca) {
    return new Agent({ ca });
  } else if (allowSelfSigned) {
    return new Agent({ rejectUnauthorized: false });
  } else {
    return undefined;
  }
}

export function downloadFile(target: string, httpsAgent: Agent): Promise<Array<string>> {
  return axios
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

export type FormDataObj = Record<string, string | number | boolean | [Buffer, string]>;

export function createAxiosForm(formData: FormDataObj) {
  const form = new FormData();

  Object.keys(formData).forEach((key) => {
    const value = formData[key];

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      form.append(key, value);
    } else if (Array.isArray(value)) {
      form.append(key, value[0], value[1]);
    } else {
      // unknown value - skip for now
    }
  });

  return form;
}

export function handleAxiosError(
  error: any,
  interactive: boolean,
  httpsAgent: Agent,
  refetch: (mode: PublishScheme, key: string) => Promise<any>,
  onfail?: (status: number, statusText: string, response: string) => any,
) {
  if (!onfail) {
    onfail = () => {
      throw error;
    };
  }

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

        return getTokenInteractively(interactiveAuth, httpsAgent).then(({ mode, token }) => refetch(mode, token));
      }
    }

    const message = getMessage(data) || '';
    return onfail(status, statusText, message);
  } else if (error.isAxiosError) {
    // axios initiated error: try to parse message from error object
    let errorMessage: string = error.errno || 'Unknown Axios Error';

    if (typeof error.toJSON === 'function') {
      const errorObj: { message?: string } = error.toJSON();
      errorMessage = errorObj?.message ?? errorMessage;
    }

    return onfail(500, undefined, errorMessage);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    return onfail(500, undefined, error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    return onfail(500, undefined, error.message);
  }
}

export interface PostFormResult {
  status: number;
  success: boolean;
  response?: object;
}

function createPayload(
  data: any,
  scheme: PublishScheme,
  key: string,
  customHeaders: Record<string, string>,
  isForm: boolean,
): [any, Record<string, string>] {
  if (isForm) {
    const form = createAxiosForm(data);
    const extraHeaders = form.getHeaders();
    const headers: Record<string, string> = {
      ...standardHeaders,
      ...customHeaders,
      ...getAuthorizationHeaders(scheme, key),
      ...extraHeaders,
    };
    return [form, headers];
  } else {
    const headers: Record<string, string> = {
      ...standardHeaders,
      ...customHeaders,
      ...getAuthorizationHeaders(scheme, key),
    };
    return [data, headers];
  }
}

export async function postData(
  target: string,
  scheme: PublishScheme,
  key: string,
  data: any,
  customHeaders: Record<string, string> = {},
  httpsAgent: Agent = undefined,
  isForm = false,
  interactive = false,
): Promise<PostFormResult> {
  try {
    const [body, headers] = createPayload(data, scheme, key, customHeaders, isForm);
    const res = await axios.post(target, body, {
      headers,
      httpsAgent,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    return {
      status: res.status,
      success: true,
      response: res.data,
    };
  } catch (error) {
    return await handleAxiosError(
      error,
      interactive,
      httpsAgent,
      (mode, token) => postData(target, mode, token, data, customHeaders, httpsAgent, isForm, false),
      (status, statusText, response) => {
        if (status === 500) {
          log('failedHttpPost_0065', response);
          return {
            status: 500,
            success: false,
            response: undefined,
          };
        } else {
          log('unsuccessfulHttpPost_0066', statusText, status, response);
          return {
            status,
            success: false,
            response,
          };
        }
      },
    );
  }
}

export function postForm(
  target: string,
  scheme: PublishScheme,
  key: string,
  formData: FormDataObj,
  customHeaders: Record<string, string> = {},
  httpsAgent: Agent = undefined,
  interactive = false,
): Promise<PostFormResult> {
  return postData(target, scheme, key, formData, customHeaders, httpsAgent, true, interactive);
}

export function postFile(
  target: string,
  scheme: PublishScheme,
  key: string,
  file: Buffer,
  customFields: Record<string, string> = {},
  customHeaders: Record<string, string> = {},
  agent: Agent = undefined,
  interactive = false,
): Promise<PostFormResult> {
  const data: FormDataObj = { ...customFields, file: [file, 'pilet.tgz'] };
  return postForm(target, scheme, key, data, customHeaders, agent, interactive);
}
