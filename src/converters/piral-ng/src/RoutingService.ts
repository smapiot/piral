import type { Subscription } from 'rxjs';
import type { ComponentContext, Disposable } from 'piral-core';
import * as ngCore from '@angular/core';
import { Inject, Injectable, NgZone, OnDestroy, Optional } from '@angular/core';
import { NavigationError, Router, Scroll } from '@angular/router';

const ngc = ngCore as any;

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

      this.subscription = this.router.events.subscribe((e: NavigationError | Scroll) => {
        if (e instanceof NavigationError) {
          const path = e.url;

          if (!this.invalidRoutes.includes(path)) {
            this.invalidRoutes.push(path);
          }

          this.context.router.history.push(path);
        } else if (e.type === 15) {
          // consistency check to avoid #535 and other Angular-specific issues
          const locationUrl = this.context.router.history.location.pathname;
          const routerUrl = e.routerEvent.url;

          if (routerUrl !== locationUrl) {
            this.context.router.history.push(routerUrl);
          }
        }
      });
    }
  }

  ngOnDestroy() {
    this.dispose?.();
    this.subscription?.unsubscribe();
  }

  static ɵfac =
    'ɵɵinject' in ngc
      ? (t: any) => new (t || RoutingService)(ngc.ɵɵinject('Context'), ngc.ɵɵinject(Router, 8), ngc.ɵɵinject(NgZone, 8))
      : undefined;

  static ɵprov =
    'ɵɵngDeclareInjectable' in ngc
      ? ngc.ɵɵdefineInjectable({ token: RoutingService, factory: RoutingService.ɵfac })
      : undefined;
}

if ('ɵsetClassMetadata' in ngc) {
  ngc.ɵsetClassMetadata(
    RoutingService,
    [
      {
        type: Injectable,
        args: [{ name: 'resourceUrl' }],
      },
    ],
    () => [
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
    ],
  );
}
