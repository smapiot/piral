import Axios from 'axios';
import { Extend } from 'piral-core';
import { PiletAxiosApi, AxiosConfig } from './types';

/**
 * Creates a new Piral axios API extension.
 * @param config The custom axios configuration, if any.
 */
export function createAxiosApi(config: AxiosConfig = {}): Extend<PiletAxiosApi> {
  return () => ({
    axios: Axios.create(config),
  });
}
