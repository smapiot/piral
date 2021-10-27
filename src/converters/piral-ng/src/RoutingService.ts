import type { Subscription } from 'rxjs';
import type { ComponentContext, Disposable } from 'piral-core';
import * as ngCore from '@angular/core';
import { Inject, Injectable, NgZone, OnDestroy, Optional } from '@angular/core';
import { NavigationError, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { getMinVersion } from './utils';

const ngc = ngCore as any;
const version = getMinVersion();

@Injectable()
export class RoutingService implements OnDestroy {
  private dispose: Disposable | undefined;
  private subscription: Subscription | undefined;
  private invalidRoutes: Array<string> = [];

  constructor(
    @Inject('Context') public context: ComponentContext,
    @Optional() private router: Router,
    @Optional() private zone: NgZone,
  ) {
    if (this.router) {
      this.router.errorHandler = (error: Error) => {
        if (error.message.match('Cannot match any routes')) {
          // ignore this special error
          return undefined;
        }
        throw error;
      };

      this.dispose = this.context.router.history.listen((e) => {
        const path = e.pathname;

        if (!this.invalidRoutes.includes(path)) {
          this.zone.run(() => this.router.navigateByUrl(path));
        }
      });

      this.subscription = this.router.events.pipe(filter((e) => e instanceof NavigationError)).subscribe((e) => {
        const path = (e as NavigationError).url;

        if (!this.invalidRoutes.includes(path)) {
          this.invalidRoutes.push(path);
        }

        this.context.router.history.push(path);
      });
    }
  }

  ngOnDestroy() {
    this.dispose?.();
    this.subscription?.unsubscribe();
  }

  static ɵfac = undefined;
  static ɵprov = undefined;
}

if ('ɵɵngDeclareFactory' in ngc) {
  RoutingService.ɵfac = ngc.ɵɵngDeclareFactory({
    minVersion: version,
    version,
    ngImport: ngc,
    type: RoutingService,
    deps: [{ token: 'Context' }, { token: Router, optional: true }, { token: NgZone, optional: true }],
    target: ngc.ɵɵFactoryTarget.Injectable,
  });
}

if ('ɵɵngDeclareInjectable' in ngc) {
  RoutingService.ɵprov = ngc.ɵɵngDeclareInjectable({
    minVersion: version,
    version,
    ngImport: ngc,
    type: RoutingService,
  });
}

if ('ɵɵngDeclareClassMetadata' in ngc) {
  ngc.ɵɵngDeclareClassMetadata({
    minVersion: version,
    version,
    ngImport: ngc,
    type: RoutingService,
    decorators: [
      {
        type: Injectable,
      },
    ],
    ctorParameters() {
      return [
        {
          type: undefined,
          decorators: [
            {
              type: Inject,
              args: ['Context'],
            },
          ],
        },
        {
          type: Router,
          decorators: [
            {
              type: Optional,
            },
          ],
        },
        {
          type: NgZone,
          decorators: [
            {
              type: Optional,
            },
          ],
        },
      ];
    },
  });
}
