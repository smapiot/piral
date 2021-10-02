import type { Subscription } from 'rxjs';
import type { ComponentContext, Disposable } from 'piral-core';
import { Inject, Injectable, NgZone, OnDestroy, Optional } from '@angular/core';
import { NavigationError, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable()
export class RoutingService implements OnDestroy {
  private dispose: Disposable;
  private subscription: Subscription;
  private invalidRoutes = [];

  constructor(
    @Inject('Context') public context: ComponentContext,
    @Optional() private router: Router,
    @Optional() private zone: NgZone,
  ) {
    if (this.router) {
      this.dispose = this.context.router.history.listen((e) => {
        const path = e.pathname;

        if (!this.invalidRoutes.includes(path)) {
          this.zone.run(() => this.router.navigateByUrl(path));
        }
      });

      this.subscription = this.router.events
        .pipe(filter((e) => e instanceof NavigationError))
        .subscribe((e: NavigationError) => {
          const path = e.url;

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
}
