import * as React from 'react';
//@ts-ignore
import { UNSAFE_NavigationContext as RouterContext, Navigate, useLocation } from 'react-router';
import { NavigationApi } from '../types';

let _nav: any;
const _noop = () => {};

export function useRouterContext() {
  return React.useContext(RouterContext);
}

export function useCurrentNavigation() {
  const ctx: any = useRouterContext();
  const location = useLocation();

  React.useEffect(() => {
    if (_nav) {
      window.dispatchEvent(
        new CustomEvent('piral-navigate', {
          detail: {
            location,
          },
        }),
      );
    }
  }, [location]);

  React.useEffect(() => {
    _nav = ctx.navigator;

    return () => {
      _nav = undefined;
    };
  }, []);
}

export function createRedirect(to: string) {
  return () => <Navigate to={to} />;
}

export function createNavigation(publicPath: string): NavigationApi {
  const enhance = (info) => ({
    ...info,
    location: {
      get href() {
        return _nav.createHref(info.location);
      },
      ...info.location,
    },
  });

  return {
    get path() {
      const loc = _nav ? _nav.location : location;
      return loc.pathname;
    },
    get url() {
      const loc = _nav ? _nav.location : location;
      return `${loc.pathname}${loc.search}${loc.hash}`;
    },
    push(target, state) {
      if (_nav) {
        _nav.push(target, state);
      }
    },
    replace(target, state) {
      if (_nav) {
        _nav.replace(target, state);
      }
    },
    go(n) {
      if (_nav) {
        _nav.go(n);
      }
    },
    block(blocker) {
      if (!_nav) {
        return _noop;
      }
      return _nav.block((transition) => blocker(enhance(transition)));
    },
    listen(listener) {
      const handler = (e: CustomEvent) => listener(enhance(e.detail));

      window.addEventListener('piral-navigate', handler);

      return () => {
        window.removeEventListener('piral-navigate', handler);
      };
    },
    get router() {
      return _nav;
    },
    publicPath,
  };
}
