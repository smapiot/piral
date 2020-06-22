import { renderToString } from 'react-dom/server';
import { loadPilets, createExternalScript } from './utils';
import { PiralSsrOptions } from './types';

/**
 * Performs the server-side rendering of an already prepared app.
 * @param app The React element representing the rendered app.
 * @param options The required options for performing the SSR.
 * @returns A string that should be returned to the request caller.
 */
export async function renderFromServer(app: React.ReactElement, options: PiralSsrOptions) {
  const { getPilet, getPiletsMetadata, fillTemplate, asExternal } = options;
  const metadata = await getPiletsMetadata();
  const pilets = await loadPilets(metadata, getPilet);
  const embedded = `window.__pilets__ = ${JSON.stringify(pilets)};`;
  const external = createExternalScript(embedded, asExternal);
  const body = renderToString(app);
  return await fillTemplate(body, external);
}
