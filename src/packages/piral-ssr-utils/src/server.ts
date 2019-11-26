import { renderToString } from 'react-dom/server';
import { loadPilets } from './utils';
import { PiralSsrOptions } from './types';

/**
 * Performs the server-side rendering of an already prepared app.
 * @param app The React element representing the rendered app.
 * @param options The required options for performing the SSR.
 * @returns A string that should be returned to the request caller.
 */
export async function renderFromServer(app: React.ReactElement, options: PiralSsrOptions) {
  const { getPilet, getPiletsMetadata, fillTemplate } = options;
  const metadata = await getPiletsMetadata();
  const pilets = await loadPilets(metadata, getPilet);
  const embedded = `<script>window.__pilets__ = ${JSON.stringify(pilets)};</script>`;
  const body = renderToString(app);
  return await fillTemplate(body, embedded);
}
