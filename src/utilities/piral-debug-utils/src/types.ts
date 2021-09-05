import { FC } from 'react';
import { AvailableDependencies, Pilet, PiletApiCreator, PiletLoader, PiletMetadata } from 'piral-base';

export interface EmulatorConnectorOptions {
  createApi: PiletApiCreator;
  loadPilet: PiletLoader;
  injectPilet?(pilet: Pilet): void;
  piletApiFallback?: string;
}

export interface ChangeSet {
  pilets: boolean;
  extensions: boolean;
  pages: boolean;
}

export interface DebugComponents {
  wrappers: Record<string, FC>;
  components: Record<string, FC>;
  routes: Record<string, FC>;
  onChange(previous: any, current: any, changed: ChangeSet): void;
}

export interface DebuggerOptions {
  dependencies: AvailableDependencies;
  createApi: PiletApiCreator;
  loadPilet: PiletLoader;
  injectPilet(pilet: Pilet): void;
  fireEvent(name: string, arg: any): void;
  getGlobalState(): any;
  getPilets(): Array<PiletMetadata>;
  getExtensions(): Array<string>;
  getRoutes(): Array<string>;
  setPilets(pilets: Array<PiletMetadata>): void;
  integrate(components: DebugComponents): void;
}
