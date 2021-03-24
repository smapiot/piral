import * as React from 'react';
import { useLocation, useRouteMatch } from 'react-router';
import { PiralBreadcrumbsContainer, PiralBreadcrumbItem } from './components';
import { useBreadcrumbs } from './useBreadcrumbs';

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
    const computedPath = path.replace(/:([A-Za-z0-9_]+)/g, (s, id) => params[id] ?? s);

    return (
      <PiralBreadcrumbItem key={key} current={current} path={computedPath} {...props}>
        {title}
      </PiralBreadcrumbItem>
    );
  });

  return <PiralBreadcrumbsContainer children={children} />;
};
Breadcrumbs.displayName = 'Breadcrumbs';
