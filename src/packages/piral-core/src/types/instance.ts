import { ApiCreator } from 'react-arbiter';
import { EventEmitter } from './utils';
import { StateActions } from './state';

export interface PortalProps {
  children(content: React.ReactNode): React.ReactElement<any>;
}

/**
 * The PiralInstance component, which is an event emitter containing the React
 * functional component as well as some other utilities and helpers.
 */
export interface PiralInstance<TApi, TActions> extends EventEmitter {
  App: React.FC<PortalProps>;
  actions: StateActions & TActions;
  createApi: ApiCreator<TApi>;
  root: TApi;
}
