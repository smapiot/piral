import { registerDependencyUrls, loadSystemPilet, createEvaluatedPilet } from '../../utils';
import type { DefaultLoaderConfig, PiletV3Entry, Pilet } from '../../types';

function attachStylesToDocument(pilet: Pilet, url: string) {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.setAttribute('data-origin', pilet.name);
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
  }
}

/**
 * Loads the provided SystemJS-powered pilet.
 * @param entry The pilet's entry.
 * @param options The loader configuration.
 * @returns The evaluated pilet that can now be integrated.
 */
export default function loader(entry: PiletV3Entry, options: DefaultLoaderConfig): Promise<Pilet> {
  const { dependencies = {}, config = {}, link, ...rest } = entry;
  const attachStyles = typeof options.attachStyles === 'function' ? options.attachStyles : attachStylesToDocument;
  const meta = {
    dependencies,
    config,
    link,
    ...rest,
  };

  registerDependencyUrls(dependencies);

  return loadSystemPilet(link).then((app) => {
    const pilet = createEvaluatedPilet(meta, app);

    if (Array.isArray(app.styles)) {
      for (const style of app.styles) {
        attachStyles(pilet, `${pilet.basePath}/${style}`);
      }
    }

    return pilet;
  });
}
