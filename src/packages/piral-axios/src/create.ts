import Axios from 'axios';
import { AxiosRequestConfig } from 'axios';
import { Extend } from 'piral-core';
import { PiletAxiosApi } from './types';

export type AxiosConfig = AxiosRequestConfig;

/**
 * Creates a new Piral axios API extension.
 * @param config The custom axios configuration, if any.
 */
export function createAxiosApi(config: AxiosConfig = {}): Extend<PiletAxiosApi> {
  return context => {
    const axios = Axios.create(config);

    axios.interceptors.request.use(config => {
      const headerPromises: Array<Promise<any>> = [];

      context.emit('before-fetch', {
        headers: config.headers,
        agent: config.httpAgent,
        method: config.method,
        target: config.url,
        setHeaders(headers: Promise<any> | any) {
          if (headers) {
            headerPromises.push(headers);
          }
        },
      });

      return Promise.all(headerPromises).then(newHeaders => {
        const headers = newHeaders.reduce((obj, header) => {
          if (typeof header === 'object' && header) {
            return {
              ...obj,
              ...header,
            };
          }

          return obj;
        }, config.headers);

        return {
          ...config,
          headers,
        };
      });
    });

    return {
      axios,
    };
  };
}
