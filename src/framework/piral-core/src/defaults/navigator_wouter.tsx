import * as React from 'react';
//@ts-ignore
import { Redirect, useLocation } from 'wouter';
//@ts-ignore
import { navigate } from 'wouter/use-browser-location';
import { NavigationApi } from '../types';

const _noop = () => {};

export function useCurrentNavigation() {
  const [location] = useLocation();

  React.useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('piral-navigate', {
        detail: {
          location,
        },
      }),
    );
  }, [location]);
}

export function createRedirect(to: string) {
  return () => <Redirect to={to} />;
}

export function createNavigation(publicPath: string): NavigationApi {
  const enhance = (location: string): any => ({
    action: 'PUSH',
    location: {
      get href() {
        return location;
      },
    },
  });

  return {
    get path() {
      return location.pathname;
    },
    get url() {
      const loc = location;
      return `${loc.pathname}${loc.search}${loc.hash}`;
    },
    push(target, state) {
      navigate(target, { replace: false, state });
    },
    replace(target, state) {
      navigate(target, { replace: true, state });
    },
    go() {
      //Not supported in Wouter
    },
    block() {
      //Not supported in Wouter
      return _noop;
    },
    listen(listener) {
      const handler = (e: CustomEvent) => listener(enhance(e.detail.location));

      window.addEventListener('piral-navigate', handler);

      return () => {
        window.removeEventListener('piral-navigate', handler);
      };
    },
    router: {},
    publicPath,
  };
}
