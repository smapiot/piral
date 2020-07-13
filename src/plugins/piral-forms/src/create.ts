import * as actions from './actions';
import { PiralPlugin } from 'piral-core';
import { withForm } from './withForm';
import { PiletFormsApi } from './types';

/**
 * Available configuration options for the forms plugin.
 */
export interface FormsConfig {}

/**
 * Creates new Pilet API extensions for enhancing forms.
 */
export function createFormsApi(config: FormsConfig = {}): PiralPlugin<PiletFormsApi> {
  return context => {
    context.defineActions(actions);

    context.dispatch(state => ({
      ...state,
      forms: {},
    }));

    return {
      createForm(options) {
        return component => withForm(component, options);
      },
    };
  };
}
