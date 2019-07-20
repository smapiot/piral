import { PiralCoreApi } from 'piral-core';
import { PiralNgApi } from 'piral-ng';
import { PiralVueApi } from 'piral-vue';
import { PiralHyperappApi } from 'piral-hyperapp';

export type PiExtApi = PiralVueApi<PiralCoreApi> & PiralNgApi & PiralHyperappApi<PiralCoreApi>;
export type PiralApi = PiralCoreApi & PiExtApi;
export type SampleApi = PiralCoreApi<PiralApi> & PiExtApi;
