import { GlobalStateContext } from 'piral-core';
import { AvailableDependencies, PiletApiCreator, PiletLoader, PiletRequester } from 'piral-base';

export interface DebuggerOptions {
  createApi: PiletApiCreator;
  loadPilet: PiletLoader;
  context?: GlobalStateContext;
  requestPilets: PiletRequester;
  getDependencies(): AvailableDependencies;
  onChange?(cb: (previous: any, current: any) => void): void;
}

export interface PiralDebugState {
  $debug: {
    visualize: {
      force: boolean;
      active: boolean;
    };
    route: string;
  };
}

declare module 'piral-core/lib/types/custom' {
  interface PiralCustomState extends PiralDebugState {}
}
