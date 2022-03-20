import type { ComponentContext } from 'piral-core';
import type { NgOptions } from './types';
import { enableProdMode, NgModuleRef, NgZone } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { getNgVersion } from './utils';

function getVersionHandler(versions: Record<string, () => void>) {
  const major = getNgVersion();
  const version = `v${major}`;
  return versions[version];
}

const runningModules: Array<[any, NgModuleInt]> = [];

export type NgModuleInt = NgModuleRef<any> & { _destroyed: boolean };

export function startup(
  BootstrapModule: any,
  context: ComponentContext,
  ngOptions?: NgOptions,
): Promise<void | NgModuleInt> {
  const runningModule = runningModules.find(([ref]) => ref === BootstrapModule);

  if (runningModule) {
    const [, instance] = runningModule;
    return Promise.resolve(instance);
  } else {
    const path = context.readState?.((s) => s.app.publicPath) || '/';
    const platform = platformBrowserDynamic([
      { provide: 'Context', useValue: context },
      { provide: APP_BASE_HREF, useValue: path },
    ]);
    const id = Math.random().toString(36);
    const zoneIdentifier = `piral-ng:${id}`;

    // This is a hack, since NgZone doesn't allow you to configure the property that identifies your zone.
    // See:
    // - https://github.com/PlaceMe-SAS/single-spa-angular-cli/issues/33
    // - https://github.com/angular/angular/blob/a14dc2d7a4821a19f20a9547053a5734798f541e/packages/core/src/zone/ng_zone.ts#L144
    // - https://github.com/angular/angular/blob/a14dc2d7a4821a19f20a9547053a5734798f541e/packages/core/src/zone/ng_zone.ts#L257
    // @ts-ignore
    NgZone.isInAngularZone = () => window.Zone.current._properties[zoneIdentifier] === true;

    return platform
      .bootstrapModule(BootstrapModule, ngOptions)
      .catch((err) => console.log(err))
      .then((instance: NgModuleInt) => {
        if (instance) {
          const zone = instance.injector.get(NgZone);
          // @ts-ignore
          const z = zone?._inner ?? zone?.inner;

          if (z && '_properties' in z) {
            z._properties[zoneIdentifier] = true;
          }

          runningModules.push([BootstrapModule, instance]);
        }

        return instance;
      });
  }
}

if (process.env.NODE_ENV === 'development') {
  // May be used later for something useful. Right now only debugging output.
  const versionHandlers = {
    legacy() {
      console.log('Running in legacy mode (Angular 2, Angular 4)');
    },
    outdated() {
      console.log('Running in outdated mode (Angular 5-8)');
    },
    current() {
      console.log('Running in current mode (Angular 9-13)');
    },
    next() {
      console.log('Running in next mode (Angular 14)');
    },
    unknown() {
      console.log('Running with an unknown version of Angular');
    },
  };
  const versions = {
    v2: versionHandlers.legacy,
    v4: versionHandlers.legacy,
    v5: versionHandlers.outdated,
    v6: versionHandlers.outdated,
    v7: versionHandlers.outdated,
    v8: versionHandlers.outdated,
    v9: versionHandlers.current,
    v10: versionHandlers.current,
    v11: versionHandlers.current,
    v12: versionHandlers.current,
    v13: versionHandlers.current,
    v14: versionHandlers.next,
  };

  const handler = getVersionHandler(versions) || versionHandlers.unknown;
  handler();
}

if (process.env.NODE_ENV === 'production') {
  enableProdMode();
}
