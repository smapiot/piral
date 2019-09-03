import { ApiCreator } from 'react-arbiter';
import { EventEmitter } from './utils';
import { PiralActions } from './state';
import { PiletApi } from './api';

export interface PortalProps {
  children(content: React.ReactNode): React.ReactElement<any>;
}

/**
 * The PiralInstance component, which is an event emitter containing the React
 * functional component as well as some other utilities and helpers.
 */
export interface PiralInstance extends EventEmitter {
  App: React.FC<PortalProps>;
  actions: PiralActions;
  createApi: ApiCreator<PiletApi>;
  root: PiletApi;
}
