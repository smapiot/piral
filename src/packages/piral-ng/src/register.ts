import {
  PiletApi,
  TilePreferences,
  PageComponentProps,
  TileComponentProps,
  MenuComponentProps,
  ExtensionComponentProps,
  ModalComponentProps,
  MenuSettings,
} from 'piral-core';
import { enqueue } from './queue';
import { bootstrap } from './bootstrap';

function getPlatformProps(piral: any, context: any, propsName: string, propsValue: any) {
  return [
    { provide: 'Piral', useValue: piral },
    { provide: propsName, useValue: propsValue },
    { provide: 'Context', useValue: context },
  ];
}

export function ngTile(api: PiletApi, id: string, component: any, options?: TilePreferences) {
  api.registerTileX(
    id,
    (node: HTMLElement, props: TileComponentProps, ctx: any) => {
      enqueue(() => bootstrap(getPlatformProps(api, ctx, 'TileProps', props), component, node, id));
    },
    options,
  );
}

export function ngPage(api: PiletApi, route: string, component: any) {
  api.registerPageX(route, (node: HTMLElement, props: PageComponentProps, ctx: any) => {
    enqueue(() => bootstrap(getPlatformProps(api, ctx, 'PageProps', props), component, node, route));
  });
}

export function ngModal<TOpts>(api: PiletApi, id: string, component: any, defaults?: TOpts) {
  api.registerModalX(
    id,
    (node: HTMLElement, props: ModalComponentProps<TOpts>, ctx: any) => {
      enqueue(() => bootstrap(getPlatformProps(api, ctx, 'ModalProps', props), component, node, id));
    },
    defaults,
  );
}

export function ngExtension<TOpts>(api: PiletApi, slot: string, component: any, defaults?: TOpts) {
  api.registerExtensionX(
    slot,
    (node: HTMLElement, props: ExtensionComponentProps<TOpts>, ctx: any) => {
      enqueue(() => bootstrap(getPlatformProps(api, ctx, 'ExtensionProps', props), component, node, slot));
    },
    defaults,
  );
}

export function ngMenu(api: PiletApi, id: string, component: any, settings?: MenuSettings) {
  api.registerMenuX(
    id,
    (node: HTMLElement, props: MenuComponentProps, ctx: any) => {
      enqueue(() => bootstrap(getPlatformProps(api, ctx, 'MenuProps', props), component, node, id));
    },
    settings,
  );
}
