import {
  PiralApi,
  PageComponentProps,
  TileComponentProps,
  MenuComponentProps,
  ExtensionComponentProps,
} from 'piral-core';
import { PiralFetchApi, PiralGqlApi } from 'piral-ext';

export type PiExtApi = PiralFetchApi & PiralGqlApi;
export type PiletApi = PiralApi<PiExtApi>;
export type PiPageComponentProps = PageComponentProps<PiletApi>;
export type PiTileComponentProps = TileComponentProps<PiletApi>;
export type PiMenuComponentProps = MenuComponentProps<PiletApi>;
export type PiExtensionComponentProps<T = Record<string, any>> = ExtensionComponentProps<PiletApi, T>;

export interface PiralAttachment {
  (api: PiletApi): void;
}
