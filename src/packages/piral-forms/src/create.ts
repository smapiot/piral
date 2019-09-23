import * as actions from './actions';
import { swap } from '@dbeining/react-atom';
import { Extend } from 'piral-core';
import { withForm } from './withForm';
import { PiletFormsApi } from './types';

/**
 * Creates a new set of Piral API extensions for enhancing forms.
 */
export function createFormsApi(): Extend<PiletFormsApi> {
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
