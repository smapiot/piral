import { withForm } from './withForm';
import { PiletFormsApi } from './types';

export function createFormsApi(): PiletFormsApi {
  return {
    createForm(options) {
      return component => withForm(component, options);
    },
  };
}
