import * as React from 'react';
import { Route, Redirect, matchPath } from 'react-router-dom';

function populate<T extends SectionLink = any>(source: Array<T>, select: (item: T) => string) {
  const results: Array<SectionInfo> = [];

  source.forEach(item => {
    const title = select(item);
    const [result] = results.filter(m => m.title === title);

    if (result) {
      result.links.push(item);
    } else {
      results.push({
        title,
        links: [item],
      });
    }
  });

  return results;
}

const tutorials = populate(require('../codegen/tutorials.codegen'), t => t.section);
const plugins = populate(require('../codegen/extensions.codegen'), p => p.category);
const commands = populate(require('../codegen/tooling.codegen'), c => c.tool);
const specification = require('../codegen/specification.codegen');
const documentation = require('../codegen/documentation.codegen');
const samples = require('../codegen/samples.codegen');
const questions = require('../codegen/faq.codegen');
const codes = require('../codegen/codes.codegen');
const types = require('../codegen/types.codegen');

export interface SectionLink {
  id: string;
  route: string;
  page: React.FC;
}

export interface SectionInfo {
  title: string;
  links: Array<SectionLink>;
}

export const sitemap: Record<string, Array<SectionInfo>> = {
  guidelines: [
    ...tutorials,
    {
      title: 'Example',
      links: samples,
    },
  ],
  reference: [
    {
      title: 'Documentation',
      links: documentation,
    },
    {
      title: 'Specification',
      links: specification,
    },
    {
      title: 'FAQ',
      links: questions,
    },
    {
      title: 'Codes',
      links: codes,
    },
  ],
  tooling: [...commands],
  plugins: [...plugins],
  types: [
    {
      title: 'Framework',
      links: types.filter(m => !m.id.endsWith('-utils')),
    },
    {
      title: 'Utilities',
      links: types.filter(m => m.id.endsWith('-utils')),
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
