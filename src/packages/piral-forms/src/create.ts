import { PiletApi } from 'piral-core';
import { withForm } from './withForm';
import { PiletFormsApi } from './types';

export function createFormsApi(api: PiletApi): PiletFormsApi {
  return {
    createForm(options) {
      return component => withForm(component, options);
    },
  };
}
