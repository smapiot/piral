import * as actions from './actions';
import { swap } from '@dbeining/react-atom';
import { Extend } from 'piral-core';
import { withForm } from './withForm';
import { PiletFormsApi } from './types';

/**
 * Available configuration options for the forms plugin.
 */
export interface FormsConfig {}

/**
 * Creates new Pilet API extensions for enhancing forms.
 */
export function createFormsApi(config: FormsConfig = {}): Extend<PiletFormsApi> {
  return context => {
    context.defineActions(actions);

    swap(context.state, state => ({
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
