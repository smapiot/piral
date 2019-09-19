import { PiletApi, PiletMetadata, GlobalStateContext } from 'piral-core';
import { ngTile, ngPage, ngExtension, ngMenu, ngModal } from './register';
import { PiletNgApi } from './types';

/**
 * Creates a new set of Piral Angular API extensions.
 * @param api The API to extend.
 */
export function createNgApi(api: PiletApi, target: PiletMetadata, context: GlobalStateContext): PiletNgApi {
  let next = ~~(Math.random() * 10000);

  context.converters.ng = component => component;

  return {};
}
