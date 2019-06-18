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

export function ngTile<T>(api: PiralCoreApi<T>, id: string, Module: any, options?: TilePreferences) {
  api.registerTileX(
    id,
    (node: HTMLElement, props: TileComponentProps<PiralApi<T>>, ctx: any) => {
      enqueue(() => {
        node.id = id;
        return bootstrap(getPlatformProps(api, ctx, 'TileProps', props), Module, node);
      });
    },
    options,
  );
}

export function ngPage<T>(api: PiralCoreApi<T>, id: string, Module: any, route: string) {
  api.registerPageX(route, (node: HTMLElement, props: PageComponentProps<PiralApi<T>>, ctx: any) => {
    enqueue(() => {
      node.id = id;
      return bootstrap(getPlatformProps(api, ctx, 'PageProps', props), Module, node);
    });
  });
}

export function ngModal<T, TOpts>(api: PiralCoreApi<T>, id: string, Module: any, defaults?: TOpts) {
  api.registerModalX(
    id,
    (node: HTMLElement, props: ModalComponentProps<PiralApi<T>, TOpts>, ctx: any) => {
      enqueue(() => {
        node.id = id;
        return bootstrap(getPlatformProps(api, ctx, 'ModalProps', props), Module, node);
      });
    },
    defaults,
  );
}

export function ngExtension<T, TOpts>(api: PiralCoreApi<T>, id: string, Module: any, slot: string, defaults?: TOpts) {
  api.registerExtensionX(
    slot,
    (node: HTMLElement, props: ExtensionComponentProps<PiralApi<T>, TOpts>, ctx: any) => {
      enqueue(() => {
        node.id = id;
        return bootstrap(getPlatformProps(api, ctx, 'ExtensionProps', props), Module, node);
      });
    },
    defaults,
  );
}

export function ngMenu<T>(api: PiralCoreApi<T>, id: string, Module: any, settings?: MenuSettings) {
  api.registerMenuX(
    id,
    (node: HTMLElement, props: MenuComponentProps<PiralApi<T>>, ctx: any) => {
      enqueue(() => {
        node.id = id;
        return bootstrap(getPlatformProps(api, ctx, 'MenuProps', props), Module, node);
      });
    },
    settings,
  );
}
