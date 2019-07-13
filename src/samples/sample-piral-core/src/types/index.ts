import { PiralApi } from 'piral-core';
import { PiralNgApi } from 'piral-ng';
import { PiralVueApi } from 'piral-vue';
import { PiralHyperappApi } from 'piral-hyperapp';

export type SampleApi = PiralApi<PiralVueApi & PiralNgApi & PiralHyperappApi>;
