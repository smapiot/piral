import { isfunc, Pilet, PiletApiCreator, PiletLoader, PiletRequester, setupPilet } from 'piral-base';

export interface EmulatorConnectorOptions {
  createApi: PiletApiCreator;
  loadPilet: PiletLoader;
  inject?(pilet: Pilet): void;
  piletApiFallback?: string;
}

export function withEmulatorPilets(requestPilets: PiletRequester, options: EmulatorConnectorOptions): PiletRequester {
  const { loadPilet, createApi, inject, piletApiFallback = '/$pilet-api' } = options;
  // check if pilets should be loaded
  const loadPilets = sessionStorage.getItem('dbg:load-pilets') === 'on';
  const noPilets: PiletRequester = () => Promise.resolve([]);
  const requester = loadPilets ? requestPilets : noPilets;

  return () => {
    const promise = requester();

    // the window['dbg:pilet-api'] should point to an API address used as a proxy, fall back to '/$pilet-api' if unavailable
    const piletApi = window['dbg:pilet-api'] || piletApiFallback;

    // either take a full URI or make it an absolute path relative to the current origin
    const initialTarget = /^https?:/.test(piletApi)
      ? piletApi
      : `${location.origin}${piletApi[0] === '/' ? '' : '/'}${piletApi}`;
    const updateTarget = initialTarget.replace('http', 'ws');
    const ws = new WebSocket(updateTarget);

    const appendix = fetch(initialTarget)
      .then((res) => res.json())
      .then((item) => (Array.isArray(item) ? item : [item]));

    ws.onmessage = ({ data }) => {
      const hardRefresh = sessionStorage.getItem('dbg:hard-refresh') === 'on';

      if (!hardRefresh) {
        // standard setting is to just perform an inject
        const meta = JSON.parse(data);
        loadPilet(meta).then((pilet) => {
          try {
            if (isfunc(inject)) {
              inject(pilet);
            }

            setupPilet(pilet, createApi);
          } catch (error) {
            console.error(error);
          }
        });
      } else {
        location.reload();
      }
    };

    return promise
      .catch((err) => {
        console.error(`Requesting the pilets failed. We'll continue loading without pilets (DEBUG only).`, err);
        return [];
      })
      .then((pilets) => appendix.then((debugPilets) => [...pilets, ...debugPilets]));
  };
}
