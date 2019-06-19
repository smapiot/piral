import {
  PiralApi,
  PiralCoreApi,
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

export function ngTile<T>(api: PiralCoreApi<T>, id: string, component: any, options?: TilePreferences) {
  api.registerTileX(
    id,
    (node: HTMLElement, props: TileComponentProps<PiralApi<T>>, ctx: any) => {
      enqueue(() => bootstrap(getPlatformProps(api, ctx, 'TileProps', props), component, node, id));
    },
    options,
  );
}

export function ngPage<T>(api: PiralCoreApi<T>, route: string, component: any) {
  api.registerPageX(route, (node: HTMLElement, props: PageComponentProps<PiralApi<T>>, ctx: any) => {
    enqueue(() => bootstrap(getPlatformProps(api, ctx, 'PageProps', props), component, node, route));
  });
}

export function ngModal<T, TOpts>(api: PiralCoreApi<T>, id: string, component: any, defaults?: TOpts) {
  api.registerModalX(
    id,
    (node: HTMLElement, props: ModalComponentProps<PiralApi<T>, TOpts>, ctx: any) => {
      enqueue(() => bootstrap(getPlatformProps(api, ctx, 'ModalProps', props), component, node, id));
    },
    defaults,
  );
}

export function ngExtension<T, TOpts>(api: PiralCoreApi<T>, slot: string, component: any, defaults?: TOpts) {
  api.registerExtensionX(
    slot,
    (node: HTMLElement, props: ExtensionComponentProps<PiralApi<T>, TOpts>, ctx: any) => {
      enqueue(() => bootstrap(getPlatformProps(api, ctx, 'ExtensionProps', props), component, node, slot));
    },
    defaults,
  );
}

export function ngMenu<T>(api: PiralCoreApi<T>, id: string, component: any, settings?: MenuSettings) {
  api.registerMenuX(
    id,
    (node: HTMLElement, props: MenuComponentProps<PiralApi<T>>, ctx: any) => {
      enqueue(() => bootstrap(getPlatformProps(api, ctx, 'MenuProps', props), component, node, id));
    },
    settings,
  );
}
