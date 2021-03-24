import { useGlobalState } from 'piral-core';
import { BreadcrumbRegistration } from './types';

function getExact(breadcrumbs: Array<BreadcrumbRegistration>, path: string): BreadcrumbRegistration {
  const [bc] = breadcrumbs.filter((m) => m.matcher.test(path));
  return bc;
}

function getClosest(breadcrumbs: Array<BreadcrumbRegistration>, path: string): BreadcrumbRegistration {
  const segments = path.split('/');

  while (segments.length > 1) {
    segments.pop();
    const newPath = segments.join('/');
    const next = getNext(breadcrumbs, newPath);

    if (next) {
      return next;
    }
  }

  return undefined;
}

function getNext(breadcrumbs: Array<BreadcrumbRegistration>, path: string) {
  if (path) {
    return getExact(breadcrumbs, path) || getClosest(breadcrumbs, path);
  }

  return undefined;
}

export function useBreadcrumbs(path: string) {
  const breadcrumbs = useGlobalState((s) => s.registry.breadcrumbs);
  const list = Object.keys(breadcrumbs).map((id) => breadcrumbs[id]);

  if (list.length > 0) {
    const current = getNext(list, path);

    if (current) {
      const links = [current];
      let previous = getNext(list, current.settings.parent);

      while (previous !== undefined) {
        links.push(previous);
        previous = getNext(list, previous.settings.parent);
      }

      return links.reverse();
    }
  }

  return [];
}
