import { useGlobalState } from 'piral-core';
import { BreadcrumbRegistration } from './types';

function getNext(breadcrumbs: Array<BreadcrumbRegistration>, path: string) {
  if (path) {
    const [bc] = breadcrumbs.filter(m => m.matcher.test(path));
    return bc;
  }

  return undefined;
}

export function useBreadcrumbs(path: string) {
  const breadcrumbs = useGlobalState((s) => s.registry.breadcrumbs);
  const list = Object.keys(breadcrumbs).map(id => breadcrumbs[id]);

  if (list.length > 0) {
    const current = getNext(list, path) || breadcrumbs[0];
    const links = [current];
    let previous = getNext(list, current.settings.parent);

    while (previous !== undefined) {
      links.push(previous);
      previous = getNext(list, previous.settings.parent);
    }

    return links.reverse();
  }

  return [];
}
