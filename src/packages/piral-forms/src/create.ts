import * as actions from './actions';
import { GlobalStateContext } from 'piral-core';
import { withForm } from './withForm';
import { PiletFormsApi } from './types';

export function createFormsApi(context: GlobalStateContext): PiletFormsApi {
  context.defineActions(actions);

  return {
    createForm(options) {
      return component => withForm(component, options);
    },
  };
}
