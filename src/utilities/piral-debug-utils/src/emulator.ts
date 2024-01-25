import { freezeRouteRefresh } from './routeRefresh';
import type { PiletRequester } from 'piral-base';
import type { EmulatorConnectorOptions } from './types';

export function installPiletEmulator(requestPilets: PiletRequester, options: EmulatorConnectorOptions) {
  const {
    addPilet,
    removePilet,
    integrate,
    defaultFeedUrl = 'https://feed.piral.cloud/api/v1/pilet/emulator-website',
  } = options;

  integrate(() => {
    // check if pilets should be loaded
    const dbgPiletApiKey = 'dbg:pilet-api';
    const loadPilets = sessionStorage.getItem('dbg:load-pilets') === 'on';
    const noPilets: PiletRequester = () => Promise.resolve([]);
    const requester = loadPilets ? requestPilets : noPilets;
    const promise = requester();

    // the window['dbg:pilet-api'] should point to an API address used as a proxy, fall back to '/$pilet-api' if unavailable
    const feedUrl = window[dbgPiletApiKey] || sessionStorage.getItem(dbgPiletApiKey) || defaultFeedUrl;

    // either take a full URI or make it an absolute path relative to the current origin
    const initialTarget = /^https?:/.test(feedUrl)
      ? feedUrl
      : `${location.origin}${feedUrl[0] === '/' ? '' : '/'}${feedUrl}`;
    const updateTarget = initialTarget.replace('http', 'ws');
    const ws = new WebSocket(updateTarget);
    const timeoutCache = {};
    const timeout = 150;

    const appendix = fetch(initialTarget)
      .then((res) => res.json())
      .then((item) =>
        Array.isArray(item)
          ? item
          : item && typeof item === 'object'
          ? Array.isArray(item.items)
            ? item.items
            : [item]
          : [],
      );

    ws.onmessage = ({ data }) => {
      const hardRefresh = sessionStorage.getItem('dbg:hard-refresh') === 'on';

      if (!hardRefresh) {
        // standard setting is to just perform an inject
        const meta = JSON.parse(data);
        const name = meta.name;

        // like a debounce; only one change of the current pilet should be actively processed
        clearTimeout(timeoutCache[name]);

        // some bundlers may have fired before writing to the disk
        // so we give them a bit of time before actually loading the pilet
        timeoutCache[name] = setTimeout(() => {
          // we should make sure to only refresh the page / router if pilets have been loaded
          const unfreeze = freezeRouteRefresh();

          // tear down pilet
          removePilet(meta.name)
            .then(() => {
              const clearConsole = sessionStorage.getItem('dbg:clear-console') === 'on';

              if (clearConsole) {
                console.clear();
              }

              console.log('Updating pilet %c%s ...', 'color: green; background: white; font-weight: bold', name);
            })
            // load and evaluate pilet
            .then(() => addPilet(meta))
            // then disable route cache, should be zero again and lead to route refresh
            .then(unfreeze, unfreeze);
        }, timeout);
      } else {
        location.reload();
      }
    };

    return promise
      .catch((err) => {
        console.error(`Requesting the pilets failed. We'll continue loading without pilets (DEBUG only).`, err);
        return [];
      })
      .then((pilets) =>
        appendix.then((debugPilets) => {
          const debugPiletNames = debugPilets.map((m) => m.name);
          const feedPilets = pilets.filter((m) => !debugPiletNames.includes(m.name));
          return [...feedPilets, ...debugPilets];
        }),
      );
  });
}
