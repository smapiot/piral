import { registerDependencyUrls, loadSystemPilet, createEvaluatedPilet } from '../../utils';
import type { DefaultLoaderConfig, PiletV3Entry, Pilet } from '../../types';

/**
 * Loads the provided SystemJS-powered pilet.
 * @param entry The pilet's entry.
 * @param _config The loader configuration.
 * @returns The evaluated pilet that can now be integrated.
 */
export default function loader(entry: PiletV3Entry, _config: DefaultLoaderConfig): Promise<Pilet> {
  const { dependencies = {}, config = {}, link, ...rest } = entry;
  const meta = {
    dependencies,
    config,
    link,
    ...rest,
  };

  registerDependencyUrls(dependencies);

  return loadSystemPilet(link).then((app) => {
    const pilet = createEvaluatedPilet(meta, app);

    if (Array.isArray(app.styles) && typeof document !== 'undefined') {
      for (const style of app.styles) {
        const link = document.createElement('link');
        link.setAttribute('data-origin', pilet.name);
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = `${pilet.basePath}/${style}`;
        document.head.appendChild(link);
      }
    }

    return pilet;
  });
}
