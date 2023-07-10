import * as React from 'react';
import { useLocation, useRouteMatch } from 'react-router';
import { PiralBreadcrumbsContainer, PiralBreadcrumbItem } from './components';
import { useBreadcrumbs } from './useBreadcrumbs';
import { BreadcrumbSettings } from './types';
import { Location } from 'history';

function getContent(
  title: BreadcrumbSettings['title'],
  location: Location,
  path: string,
  params: Record<string, string>,
) {
  if (typeof title === 'function') {
    return title({ location, path, params });
  }

  return title;
}

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const breadcrumbs = useBreadcrumbs(location.pathname);
  const currentIndex = breadcrumbs.length - 1;
  const current = breadcrumbs[currentIndex];
  const { params } = useRouteMatch(current?.settings.path ?? '/');


  const children = breadcrumbs.map(({ settings }, i) => {
    const { title, path, ...props } = settings;
    const key = `bc_${i}_${settings.path}`;
    const current = i === currentIndex;
    const computedPath = path.replace(/:(([A-Za-z0-9_]+)\*?)/g, (s, _, id) => {
      if (id in params) {
        return params[id] || '';
      }

      return s;
    });

    return (
      <PiralBreadcrumbItem key={key} current={current} path={computedPath} {...props}>
        {getContent(title, location, computedPath, params)}
      </PiralBreadcrumbItem>
    );
  });

  return <PiralBreadcrumbsContainer children={children} />;
};
Breadcrumbs.displayName = 'Breadcrumbs';
