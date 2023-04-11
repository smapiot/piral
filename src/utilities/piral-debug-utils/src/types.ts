import type { FC } from 'react';
import type { Pilet, PiletEntry, PiletRequester } from 'piral-base';

export interface RouteHandler {
  (paths: Array<RouteRegistration>): Array<RouteRegistration>;
}

export interface DefaultDebugSettings {
  viewState?: boolean;
  loadPilets?: boolean;
  hardRefresh?: boolean;
  viewOrigins?: boolean;
  extensionCatalogue?: boolean;
  clearConsole?: boolean;
}

export interface EmulatorConnectorOptions {
  addPilet(pilet: PiletEntry): Promise<void>;
  removePilet(name: string): Promise<void>;
  piletApiFallback?: string;
  integrate(requester: PiletRequester): void;
}

export interface RouteRegistration {
  path: string;
  Component: React.ComponentType;
}

export interface ChangeSet {
  state?: boolean;
  pages?: boolean;
  pilets?: boolean;
  extensions?: boolean;
  dependencies?: boolean;
}

export interface EmulatorComponents {
  routeFilter: RouteHandler;
  requester: PiletRequester;
}

export interface DebugComponents {
  wrappers: Record<string, FC>;
  components: Record<string, FC>;
  routes: Record<string, FC>;
  onChange(previous: any, current: any, changed: ChangeSet): void;
}

export interface DebugCustomBooleanSetting {
  value: boolean;
  type: 'boolean';
  onChange(newValue: boolean, prevValue: boolean): void;
}

export interface DebugCustomNumberSetting {
  value: number;
  type: 'number';
  onChange(newValue: number, prevValue: number): void;
}

export interface DebugCustomStringSetting {
  value: string;
  type: 'string';
  onChange(newValue: string, prevValue: string): void;
}

export type DebugCustomSetting = (DebugCustomBooleanSetting | DebugCustomNumberSetting | DebugCustomStringSetting) & {
  label: string;
};

export interface DebuggerExtensionOptions {
  customSettings?: Record<string, DebugCustomSetting>;
  defaultSettings?: DefaultDebugSettings;
}

export interface DebuggerOptions extends DebuggerExtensionOptions {
  getDependencies(): Array<string>;
  fireEvent(name: string, arg: any): void;
  getGlobalState(): any;
  getPilets(): Array<Pilet>;
  getExtensions(): Array<string>;
  getRoutes(): Array<string>;
  integrate(components: DebugComponents): void;
  addPilet(pilet: PiletEntry): void;
  removePilet(name: string): void;
  updatePilet(data: any): void;
  navigate(path: string, state?: any): void;
}
