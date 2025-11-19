import type { ComponentContext } from 'piral-core';
import type { NgModuleRef, PlatformRef } from '@angular/core';
import * as angularBrowserDynamic from '@angular/platform-browser-dynamic';
import * as angularCore from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';

import { contextName } from './constants';
import { CONTEXT } from './injection';
import { getNgVersion } from './utils';
import type { NgModuleFlags, NgOptions } from './types';

function getVersionHandler(versions: Record<string, () => void>) {
  const major = getNgVersion();
  const version = `v${major}`;
  return versions[version];
}

const runningModules: Array<[any, NgModuleInt, PlatformRef]> = [];

function startNew(BootstrapModule: any, context: ComponentContext, ngOptions?: NgOptions, ngFlags?: NgModuleFlags) {
  const normalCall = 'platformBrowserDynamic';
  const legacyCall = 'ɵplatformCoreDynamic';
  const multiplePlatforms = 'ɵALLOW_MULTIPLE_PLATFORMS';
  const platformCoreDynamic =
    normalCall in angularBrowserDynamic ? angularBrowserDynamic[normalCall] : angularBrowserDynamic[legacyCall];
  const path = context.publicPath || '/';
  const extraDefinitions =
    multiplePlatforms in angularCore ? [{ provide: angularCore[multiplePlatforms], useValue: true }] : [];
  const platform = platformCoreDynamic([
    ...extraDefinitions,
    { provide: contextName, useValue: context },
    { provide: CONTEXT, useValue: context },
    { provide: APP_BASE_HREF, useValue: path },
    { provide: 'NgFlags', useValue: ngFlags },
  ]);

  let zoneIdentifier = '';

  if ('NgZone' in angularCore) {
    const zone = angularCore.NgZone;
    const version = angularCore.VERSION.full;

    // We need to bind the version-specific NgZone to its ID
    // this will not be MF-dependent, but Angular dependent
    // i.e., to allow using Zone.js with multiple versions of Angular
    zoneIdentifier = `piral-ng:${version}`;

    // This is a hack, since NgZone doesn't allow you to configure the property that identifies your zone.
    // See:
    // - https://github.com/PlaceMe-SAS/single-spa-angular-cli/issues/33
    // - https://github.com/angular/angular/blob/a14dc2d7a4821a19f20a9547053a5734798f541e/packages/core/src/zone/ng_zone.ts#L144
    // - https://github.com/angular/angular/blob/a14dc2d7a4821a19f20a9547053a5734798f541e/packages/core/src/zone/ng_zone.ts#L257
    // @ts-ignore
    zone.isInAngularZone = () => window.Zone.current._properties[zoneIdentifier] === true;

    // We disable those checks as they are misleading and might cause trouble
    zone.assertInAngularZone = () => {};
    zone.assertNotInAngularZone = () => {};
  }

  return platform
    .bootstrapModule(BootstrapModule, ngOptions)
    .catch((err) => console.error(err))
    .then((instance: NgModuleInt) => {
      if (instance) {
        if (zoneIdentifier) {
          const zone = instance.injector.get(angularCore.NgZone);
          // @ts-ignore
          const z = zone?._inner ?? zone?.inner;

          if (z && '_properties' in z) {
            z._properties[zoneIdentifier] = true;
          }
        }

        runningModules.push([BootstrapModule, instance, platform]);
      }

      return instance;
    });
}

export type NgModuleInt = NgModuleRef<any> & { _destroyed: boolean };

export function teardown(BootstrapModule: any) {
  const runningModuleIndex = runningModules.findIndex(([ref]) => ref === BootstrapModule);

  if (runningModuleIndex !== -1) {
    const [, instance] = runningModules[runningModuleIndex];
    try {
      instance.destroy();
      runningModules.splice(runningModuleIndex, 1);
    } catch (ex) {
      console.warn('Could not destroy the running Angular module', ex);
    }
  }
}

export function startup(
  BootstrapModule: any,
  context: ComponentContext,
  ngOptions?: NgOptions,
  ngFlags?: NgModuleFlags,
): Promise<void | NgModuleInt> {
  const runningModule = runningModules.find(([ref]) => ref === BootstrapModule);

  if (runningModule) {
    const [, instance, platform] = runningModule;

    if (platform.destroyed) {
      teardown(BootstrapModule);
    } else {
      return Promise.resolve(instance);
    }
  }

  return startNew(BootstrapModule, context, ngOptions, ngFlags);
}

if (process.env.NODE_ENV === 'development') {
  // May be used later for something useful. Right now only debugging output.
  const versionHandlers = {
    legacy() {
      console.log('Running in legacy mode (Angular 2-8)');
    },
    outdated() {
      console.log('Running in outdated mode (Angular 9-15)');
    },
    current() {
      console.log('Running in current mode (Angular 16-20)');
    },
    next() {
      console.log('Running in next mode (Angular 21)');
    },
    unknown() {
      console.log('Running with an unknown version of Angular');
    },
  };
  const versions = {
    v2: versionHandlers.legacy,
    v4: versionHandlers.legacy,
    v5: versionHandlers.legacy,
    v6: versionHandlers.legacy,
    v7: versionHandlers.legacy,
    v8: versionHandlers.legacy,
    v9: versionHandlers.outdated,
    v10: versionHandlers.outdated,
    v11: versionHandlers.outdated,
    v12: versionHandlers.outdated,
    v13: versionHandlers.outdated,
    v14: versionHandlers.outdated,
    v15: versionHandlers.outdated,
    v16: versionHandlers.current,
    v17: versionHandlers.current,
    v18: versionHandlers.current,
    v19: versionHandlers.current,
    v20: versionHandlers.current,
    v21: versionHandlers.next,
  };

  const handler = getVersionHandler(versions) || versionHandlers.unknown;
  handler();
}

if (process.env.NODE_ENV === 'production') {
  if ('enableProdMode' in angularCore) {
    angularCore.enableProdMode();
  }
}
