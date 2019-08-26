import { ApiCreator } from 'react-arbiter';
import { EventEmitter } from './utils';
import { StateActions } from './state';

export interface PortalProps {
  children(content: React.ReactNode): React.ReactElement<any>;
}

/**
 * The PiralInstance component, which is a React functional component combined with an event emitter.
 */
export type PiralInstance<TApi, TActions> = React.FC<PortalProps> &
  EventEmitter & {
    actions: StateActions & TActions;
    createApi: ApiCreator<TApi>;
    root: TApi;
  };
