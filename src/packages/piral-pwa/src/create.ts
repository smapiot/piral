import { Extend } from 'piral-core';
import { mount } from './mount';
import { PiletPwaApi } from './types';

/**
 * Available configuration options for the PWA extension.
 */
export interface PwaConfig {}

/**
 * Creates a new set of Piral API extensions for PWA support.
 */
export function createPwaApi(config: PwaConfig = {}): Extend<PiletPwaApi> {
  mount();

  return context => {
    return {};
  };
}
