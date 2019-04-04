import * as actions from './actions';
import { Atom } from '@dbeining/react-atom';
import { GlobalState, StateActions } from '../types';

export type Actions = ReturnType<typeof createActions>;

export function createActions(globalState: Atom<GlobalState>): StateActions {
  const newActions = {
    ...actions,
  };
  Object.keys(newActions).forEach(actionName => {
    newActions[actionName] = newActions[actionName].bind(globalState);
  });
  return newActions;
}
