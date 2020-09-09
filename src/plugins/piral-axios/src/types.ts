import type {} from 'piral-core';
import { AxiosInstance } from 'axios';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletAxiosApi {}
}

export interface PiletAxiosApi {
  /**
   * Gets the associated axios instance.
   */
  axios: AxiosInstance;
}
