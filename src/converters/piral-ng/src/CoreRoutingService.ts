import type { Subscription } from 'rxjs';
import type { ComponentContext, Disposable } from 'piral-core';
import { Inject, Injectable, NgZone, OnDestroy, Optional } from '@angular/core';
import { NavigationEnd, NavigationError, NavigationStart, Router, Scroll } from '@angular/router';
import { BrowserPlatformLocation as ɵBrowserPlatformLocation } from '@angular/common';

const noop = function () {};

// deactivates the usual platform behavior; all these operations are performed via the RoutingService
// to avoid any conflict, e.g., double-booking URL changes in React and Angular
ɵBrowserPlatformLocation.prototype.pushState = noop;
ɵBrowserPlatformLocation.prototype.replaceState = noop;
ɵBrowserPlatformLocation.prototype.forward = noop;
ɵBrowserPlatformLocation.prototype.back = noop;
ɵBrowserPlatformLocation.prototype.historyGo = noop;

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
export class CoreRoutingService implements OnDestroy {
  private dispose: Disposable | undefined;
  private subscription: Subscription | undefined;

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

      const nav = this.context.navigation;

      const queueNavigation = (url: string) => {
        window.requestAnimationFrame(() => nav.push(url));
      };

      this.dispose = nav.listen(({ location }) => {
        const path = location.pathname;
        const url = `${path}${location.search}${location.hash}`;
        this.zone.run(() => this.router.navigateByUrl(url));
      });

      this.subscription = this.router.events.subscribe(
        (e: NavigationError | NavigationStart | NavigationEnd | Scroll) => {
          if (e.type === 1) {
            const routerUrl = normalize(e.urlAfterRedirects);
            const locationUrl = nav.url;

            if (routerUrl !== locationUrl) {
              queueNavigation(routerUrl);
            }
          }
        },
      );
    }
  }

  ngOnDestroy() {
    this.dispose?.();
    this.subscription?.unsubscribe();
  }
}
