import * as React from 'react';
import { Route, Redirect, matchPath } from 'react-router-dom';

const tutorials = require('../codegen/tutorials.codegen');
const samples = require('../codegen/samples.codegen');
const plugins = require('../codegen/extensions.codegen');
const codes = require('../codegen/codes.codegen');
const types = require('../codegen/types.codegen');

const guidelines = [];
const extensions = [];

tutorials.forEach(tutorial => {
  const [guideline] = guidelines.filter(m => m.title === tutorial.section);

  if (guideline) {
    guideline.links.push(tutorial);
  } else {
    guidelines.push({
      title: tutorial.section,
      links: [tutorial],
    });
  }
});

plugins.forEach(plugin => {
  const [extension] = extensions.filter(m => m.title === plugin.category);

  if (extension) {
    extension.links.push(plugin);
  } else {
    extensions.push({
      title: plugin.category,
      links: [plugin],
    });
  }
});

export interface SectionInfo {
  title: string;
  links: Array<{
    id: string;
    route: string;
    page: React.FC;
  }>;
}

export const sitemap: Record<string, Array<SectionInfo>> = {
  guidelines: [
    ...guidelines,
    {
      title: 'Example',
      links: samples,
    },
  ],
  reference: [],
  tooling: [],
  plugins: [...extensions],
  types: [
    {
      title: 'Framework',
      links: types,
    },
  ],
  codes: [
    {
      title: 'Codes',
      links: codes,
    },
  ],
};

function getRoutes() {
  const categories = Object.keys(sitemap);
  const resolvers: Record<string, Array<SectionInfo>> = {};
  const routes: Array<React.ReactElement> = [];

  for (const category of categories) {
    const sections = sitemap[category];
    const defaultRoute = sections[0]?.links[0]?.route;

    if (defaultRoute) {
      routes.push(<Redirect key={category} exact from={`/${category}`} to={defaultRoute} />);
    }

    for (const section of sections) {
      for (const entry of section.links) {
        routes.push(<Route key={entry.id} exact path={entry.route} component={entry.page} />);
        resolvers[entry.route] = sections;
      }
    }
  }

  return [routes, resolvers];
}

export const [routes, resolvers] = getRoutes();

export function resolveSections(pathname: string) {
  return Object.keys(resolvers)
    .filter(path =>
      matchPath(pathname, {
        exact: true,
        path,
      }),
    )
    .map(m => resolvers[m])
    .shift();
}
