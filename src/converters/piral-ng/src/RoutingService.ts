import type { Subscription } from 'rxjs';
import type { ComponentContext, Disposable } from 'piral-core';
import { Inject, Injectable, NgZone, OnDestroy, Optional } from '@angular/core';
import { NavigationError, Router, Scroll } from '@angular/router';

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

      const nav = this.context.navigation;

      this.dispose = nav.listen(({ location }) => {
        const path = location.pathname;

        if (!this.invalidRoutes.includes(path)) {
          const url = path + location.search + location.hash;
          this.zone.run(() => this.router.navigateByUrl(url));
        }
      });

      this.subscription = this.router.events.subscribe((e: NavigationError | Scroll) => {
        if (e instanceof NavigationError) {
          const path = e.url;

          if (!this.invalidRoutes.includes(path)) {
            this.invalidRoutes.push(path);
          }

          nav.push(path);
        } else if (e.type === 15) {
          // consistency check to avoid #535 and other Angular-specific issues
          const locationUrl = nav.path;
          const routerUrl = e.routerEvent.url;

          if (routerUrl !== locationUrl) {
            nav.push(routerUrl);
          }
        }
      });
    }
  }

  ngOnDestroy() {
    this.dispose?.();
    this.subscription?.unsubscribe();
  }
}
