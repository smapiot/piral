import {
  PiralApi,
  PageComponentProps,
  TileComponentProps,
  MenuComponentProps,
  ExtensionComponentProps,
  ModalComponentProps,
} from 'piral-core';
import { PiralFetchApi, PiralGqlApi, PiralLocaleApi } from 'piral-ext';

export type PiExtApi = PiralFetchApi & PiralGqlApi & PiralLocaleApi;
export type PiletApi = PiralApi<PiExtApi>;
export type PiPageComponentProps = PageComponentProps<PiletApi>;
export type PiTileComponentProps = TileComponentProps<PiletApi>;
export type PiModalComponentProps<TOpts> = ModalComponentProps<PiletApi, TOpts>;
export type PiMenuComponentProps = MenuComponentProps<PiletApi>;
export type PiExtensionComponentProps<T = Record<string, any>> = ExtensionComponentProps<PiletApi, T>;
