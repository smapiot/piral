import type { FC } from 'react';
import type { Pilet, PiletApiCreator, PiletLoader, PiletMetadata } from 'piral-base';

export interface EmulatorConnectorOptions {
  createApi: PiletApiCreator;
  loadPilet: PiletLoader;
  injectPilet?(pilet: Pilet): void;
  piletApiFallback?: string;
  integrate?(components: EmulatorComponents): void;
}

export interface ChangeSet {
  state?: boolean;
  pages?: boolean;
  pilets?: boolean;
  extensions?: boolean;
  dependencies?: boolean;
}

export interface EmulatorComponents {
  components: Record<string, FC>;
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
}

export interface DebuggerOptions extends DebuggerExtensionOptions {
  getDependencies(): Array<string>;
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
