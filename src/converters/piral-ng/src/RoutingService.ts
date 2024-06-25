import type { Subscription } from 'rxjs';
import type { ComponentContext, Disposable } from 'piral-core';
import { Inject, Injectable, NgZone, OnDestroy, Optional } from '@angular/core';
import { NavigationError, NavigationStart, Router, Scroll } from '@angular/router';
import { BrowserPlatformLocation as ɵBrowserPlatformLocation } from '@angular/common';

let skipNavigation = false;
const noop = function () {};
const navigateByUrl = Router.prototype.navigateByUrl;

// deactivates the usual platform behavior; all these operations are performed via the RoutingService
// to avoid any conflict, e.g., double-booking URL changes in React and Angular
ɵBrowserPlatformLocation.prototype.pushState = noop;
ɵBrowserPlatformLocation.prototype.replaceState = noop;
ɵBrowserPlatformLocation.prototype.forward = noop;
ɵBrowserPlatformLocation.prototype.back = noop;
ɵBrowserPlatformLocation.prototype.historyGo = noop;

// required to detect / react to hidden URL change (see #554 for details)
Router.prototype.navigateByUrl = function (url, extras) {
  skipNavigation = extras?.skipLocationChange ?? false;
  const result = navigateByUrl.call(this, url, extras);
  skipNavigation = false;
  return result;
};

function normalize(url: string) {
  const search = url.indexOf('?');
  const hash = url.indexOf('#');

  if (search !== -1 || hash !== -1) {
    if (search === -1) {
      return url.substring(0, hash);
    } else if (hash === -1) {
      return url.substring(0, search);
    } else {
      return url.substring(0, Math.min(search, hash));
    }
  }

  return url;
}

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
        // Match in development and production
        if (error.message.match('Cannot match any routes') || error.message.match('NG04002')) {
          // ignore this special error
          return undefined;
        }
        throw error;
      };

      const skipIds: Array<number> = [];
      const nav = this.context.navigation;
      let queueId: number;

      const queueNavigation = (url: string) => {
        window.cancelAnimationFrame(queueId);
        queueId = window.requestAnimationFrame(() => nav.push(url));
      };

      this.dispose = nav.listen(({ location }) => {
        const path = location.pathname;

        if (!this.invalidRoutes.includes(path)) {
          const url = `${path}${location.search}${location.hash}`;
          this.zone.run(() => navigateByUrl.call(this.router, url));
        }
      });

      this.subscription = this.router.events.subscribe((e: NavigationError | NavigationStart | Scroll) => {
        if (e instanceof NavigationError) {
          const routerUrl = e.url;
          const path = normalize(routerUrl);
          const locationUrl = nav.url;

          if (!this.invalidRoutes.includes(path)) {
            this.invalidRoutes.push(path);
          }

          if (routerUrl !== locationUrl) {
            queueNavigation(routerUrl);
          }
        } else if (e.type === 0 && skipNavigation) {
          skipIds.push(e.id);
        } else if (e.type === 15) {
          const index = skipIds.indexOf(e.routerEvent.id);

          if (index === -1) {
            // consistency check to avoid #535 and other Angular-specific issues
            const locationUrl = nav.url;
            const routerUrl = e.routerEvent.url;

            if (routerUrl !== locationUrl) {
              queueNavigation(routerUrl);
            }
          } else {
            skipIds.splice(index, 1);
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
