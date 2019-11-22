import { Extend } from 'piral-core';
import { FetchConfig } from './config';
import { httpFetch } from './fetch';
import { PiletFetchApi } from './types';

/**
 * Creates a new Piral Fetch API extension.
 * @param config The custom fetch configuration, if any.
 */
export function createFetchApi(config: FetchConfig = {}): Extend<PiletFetchApi> {
  return context => {
    return {
      fetch<T>(path, options: any = {}) {
        const originalHeaders = options.headers || {};
        const headerPromises: Array<Promise<any>> = [];
        context.emit('before-fetch', {
          headers: originalHeaders,
          method: options.method || 'GET',
          target: path,
          setHeaders(headers: Promise<any> | any) {
            if (headers) {
              headerPromises.push(headers);
            }
          },
        });

        return Promise.all(headerPromises)
          .then(newHeaders => {
            const headers = newHeaders.reduce((obj, header) => {
              if (typeof header === 'object' && header) {
                return {
                  ...obj,
                  ...header,
                };
              }

              return obj;
            }, originalHeaders);

            return {
              ...options,
              headers,
            };
          })
          .then(options => httpFetch<T>(config, path, options));
      },
    };
  };
}
