import { ApiCreator, ArbiterOptions } from 'react-arbiter';
import { EventEmitter } from './utils';
import { GlobalStateContext } from './state';
import { PiletApi } from './api';
import { LayoutBreakpoints } from './layout';

export interface PortalProps {
  instance?: PiralInstance;
  breakpoints?: LayoutBreakpoints;
}

/**
 * The PiralInstance component, which is an event emitter containing the React
 * functional component as well as some other utilities and helpers.
 */
export interface PiralInstance extends EventEmitter {
  context: GlobalStateContext;
  createApi: ApiCreator<PiletApi>;
  options: ArbiterOptions<PiletApi>;
  root: PiletApi;
}
