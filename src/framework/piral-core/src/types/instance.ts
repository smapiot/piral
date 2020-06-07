import { PiletApi, PiletApiCreator, LoadPiletsOptions, EventEmitter } from 'piral-base';
import { GlobalStateContext } from './state';
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
  createApi: PiletApiCreator;
  options: LoadPiletsOptions;
  root: PiletApi;
}
