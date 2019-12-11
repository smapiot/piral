import { GenericPiletApiCreator, LoadPiletsOptions } from 'piral-base';
import { PiletApi } from './api';
import { EventEmitter } from './utils';
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
  createApi: GenericPiletApiCreator<PiletApi>;
  options: LoadPiletsOptions<PiletApi>;
  root: PiletApi;
}
