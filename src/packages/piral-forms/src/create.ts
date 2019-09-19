import * as actions from './actions';
import { PiletApi, PiletMetadata, GlobalStateContext } from 'piral-core';
import { withForm } from './withForm';
import { PiletFormsApi } from './types';

export function createFormsApi(_api: PiletApi, _target: PiletMetadata, context: GlobalStateContext): PiletFormsApi {
  context.withActions(actions);

  return {
    createForm(options) {
      return component => withForm(component, options);
    },
  };
}
