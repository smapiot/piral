import { FC } from 'react';
import { AvailableDependencies, Pilet, PiletApiCreator, PiletLoader, PiletRequester } from 'piral-base';

export interface EmulatorConnectorOptions {
  createApi: PiletApiCreator;
  loadPilet: PiletLoader;
  injectPilet?(pilet: Pilet): void;
  piletApiFallback?: string;
}

export interface DebuggerOptions {
  createApi: PiletApiCreator;
  loadPilet: PiletLoader;
  injectPilet(pilet: Pilet): void;
  fireEvent(name: string, arg: any): void;
  getDependencies(): AvailableDependencies;
  onChange?(cb: (previous: any, current: any) => void): void;
  getGlobalState(): any;
  getPilets(): Array<Pilet>;
  getRoutes(): Array<string>;
  setPilets(pilets: Array<Pilet>): void;
  integrate(debug: FC, wrapper: FC): void;
}
