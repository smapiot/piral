import * as React from 'react';
import { useGlobalStateContext } from 'piral-core';
import { PiralBreadcrumbsContainer, PiralBreadcrumbItem } from './components';
import { useBreadcrumbs } from './useBreadcrumbs';
import { BreadcrumbRegistration, BreadcrumbSettings } from './types';

const getKey = /:(([A-Za-z0-9_]+)\*?)/g;

function getContent(title: BreadcrumbSettings['title'], path: string, params: Record<string, string>) {
  if (typeof title === 'function') {
    return title({ path, params });
  }

  return title;
}

function useNavigationPath() {
  const { navigation } = useGlobalStateContext();
  const [path, setPath] = React.useState(navigation.path);

  React.useEffect(() => {
    return navigation.listen(() => {
      setPath(navigation.path);
    });
  }, []);

  return path;
}

function getKeys(template: string) {
  const keys: Array<string> = [];
  let result: RegExpExecArray;

  while (result = getKey.exec(template)) {
    keys.push(result[2]);
  }

  return keys;
}

function getParams(current: BreadcrumbRegistration, path: string) {
  const params: Record<string, string> = {};

  if (current) {
    const matcher = current.matcher;
    const data = matcher.exec(path);

    if (data) {
      const keys = getKeys(current.settings.path);

      for (let i = 0; i < keys.length; i++) {
        params[keys[i]] = data[i + 1];
      }
    }
    
  }

  return params;
}

function useParams(current: BreadcrumbRegistration, path: string) {
  return React.useMemo(() => getParams(current, path), [current, path]);
}

export const Breadcrumbs: React.FC = () => {
  const path = useNavigationPath();
  const breadcrumbs = useBreadcrumbs(path);
  const currentIndex = breadcrumbs.length - 1;
  const params = useParams(breadcrumbs[currentIndex], path);

  const children = breadcrumbs.map(({ settings }, i) => {
    const { title, path, ...props } = settings;
    const key = `bc_${i}_${settings.path}`;
    const current = i === currentIndex;
    const computedPath = path.replace(getKey, (s, _, id) => {
      if (id in params) {
        return params[id] || '';
      }

      return s;
    });

    return (
      <PiralBreadcrumbItem key={key} current={current} path={computedPath} {...props}>
        {getContent(title, computedPath, params)}
      </PiralBreadcrumbItem>
    );
  });

  return <PiralBreadcrumbsContainer children={children} />;
};
Breadcrumbs.displayName = 'Breadcrumbs';
