import 'whatwg-fetch';
import 'url-polyfill';
import './elements';

import { PiralApi } from 'piral-core';
import { PiralFetchApi, PiralGqlApi } from 'piral-ext';

export * from 'piral-core';
export * from 'piral-ext';

export type PiletApi = PiralApi<PiralFetchApi & PiralGqlApi>;
