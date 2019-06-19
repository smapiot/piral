import { PiralApi } from 'piral-core';
import { PiralNgApi } from 'piral-ng';
import { PiralVueApi } from 'piral-vue';

export type SampleApi = PiralApi<PiralVueApi & PiralNgApi>;
