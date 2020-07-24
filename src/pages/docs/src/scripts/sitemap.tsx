import * as React from 'react';
import { Route, Redirect, matchPath } from 'react-router-dom';

const sitemap = require('../codegen/sitemap.codegen');

export interface SectionLink {
  id: string;
  route: string;
  link?: string;
  title?: string;
  page: React.FC;
}

export interface SectionInfo {
  title: string;
  links: Array<SectionLink>;
}

function lastLink(sectionInfo: SectionInfo) {
  if (sectionInfo) {
    const last = sectionInfo.links.length - 1;
    return sectionInfo.links[last];
  }

  return undefined;
}

function nextLink(sectionInfo: SectionInfo) {
  if (sectionInfo) {
    return sectionInfo.links[0];
  }

  return undefined;
}

function getRoutes(): [
  Array<React.ReactElement>,
  Record<string, Array<SectionInfo>>,
  Record<string, [SectionLink | undefined, SectionLink | undefined]>,
] {
  const categories = Object.keys(sitemap);
  const resolvers: Record<string, Array<SectionInfo>> = {};
  const navLinks: Record<string, [SectionLink | undefined, SectionLink | undefined]> = {};
  const routes: Array<React.ReactElement> = [];

  for (const category of categories) {
    const sections = sitemap[category];
    const defaultRoute = sections[0]?.links[0]?.route;

    if (defaultRoute) {
      routes.push(<Redirect key={category} exact from={`/${category}`} to={defaultRoute} />);
    }

    for (let j = 0; j < sections.length; j++) {
      const section = sections[j];

      for (let i = 0; i < section.links.length; i++) {
        const prev = section.links[i - 1] || lastLink(sections[j - 1]);
        const curr = section.links[i];
        const next = section.links[i + 1] || nextLink(sections[j + 1]);
        routes.push(<Route key={curr.id} exact path={curr.route} component={curr.page} />);
        resolvers[curr.route] = sections;
        navLinks[curr.route] = [prev, next];
      }
    }
  }

  return [routes, resolvers, navLinks];
}

export function resolveSections(pathname: string) {
  return (
    Object.keys(resolvers)
      .filter(path =>
        matchPath(pathname, {
          exact: true,
          path,
        }),
      )
      .map(m => resolvers[m])
      .shift() || []
  );
}

export function resolveNavigation(pathname: string) {
  return (
    Object.keys(navLinks)
      .filter(path =>
        matchPath(pathname, {
          exact: true,
          path,
        }),
      )
      .map(m => navLinks[m])
      .shift() || []
  );
}

export const [routes, resolvers, navLinks] = getRoutes();
