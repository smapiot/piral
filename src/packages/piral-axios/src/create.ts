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
  return () => ({
    axios: Axios.create(config),
  });
}
