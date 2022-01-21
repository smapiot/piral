const { readFileSync, existsSync, readdirSync } = require('fs');
const { basename, resolve, relative } = require('path');
const { generated, generatePage, getDocsFrom } = require('@pidoc/core');

const categoryPrefix = 'plugin-';
const packagesRoot = resolve(__dirname, '../../../..');
const assetsPath = resolve(__dirname, '..', 'assets');
const pluginPackages = [...getPackages('plugins'), ...getPackages('converters')];

function getCategory(keywords) {
  return keywords
    .filter((keyword) => keyword.startsWith(categoryPrefix))
    .map((keyword) => keyword.substr(categoryPrefix.length))[0];
}

function getPluginCategory(plugin) {
  return getCategory(plugin.keywords);
}

function getPackages(dirName) {
  const dir = resolve(packagesRoot, dirName);
  return readdirSync(dir).filter((name) => existsSync(resolve(dir, name, 'package.json')));
}

function isPluginType(fileName) {
  return pluginPackages.some((name) => fileName.endsWith(`${name}.json`));
}

function getPluginTypes(docsFolder) {
  const types = resolve(docsFolder, 'types');
  return getDocsFrom(types, /\.json$/).filter((file) => !file.endsWith('piral-ext.json') && isPluginType(file));
}

function getPluginImage(name) {
  const rest = name.replace('piral-', '');
  const hasImage = existsSync(resolve(assetsPath, 'extensions', `${rest}.png`));
  return hasImage ? `extensions/${rest}.png` : 'top-extensions.png';
}

exports.find = function (basePath, docsFolder, options) {
  const pluginName = 'overview';
  const displayName = 'All Plugins';
  const route = `${basePath}/overview`;
  const dependencies = [];

  const children = getPluginTypes(docsFolder).map((file) => {
    const name = basename(file).replace('.json', '');
    const image = getPluginImage(name);
    let data = null;
    let pluginCategory = '';

    try {
      const dest = resolve(packagesRoot, 'plugins', name, 'package.json');
      data = JSON.parse(readFileSync(dest, 'utf8'));
      dependencies.push(dest);
    } catch (e) {
      const dest = resolve(packagesRoot, 'converters', name, 'package.json');
      data = JSON.parse(readFileSync(dest, 'utf8'));
      dependencies.push(dest);
    }

    pluginCategory = getPluginCategory(data);

    return {
      category: pluginCategory.charAt(0).toUpperCase() + pluginCategory.slice(1),
      content: `
        <ImageCard
          link="/plugins/${name}"
          image={require('${relative(generated, assetsPath)}/${image}')}
          description="${data.description}"
          title="${data.name}"
        />`,
    };
  });

  return [{
    route,
    pluginName,
    displayName,
    dependencies,
    children,
  }];
};

exports.build = function (entry, options) {
  const { pluginName, displayName, route, children } = entry;
  const categories = [];
  const fragments = [];

  for (const child of children) {
    const index = categories.indexOf(child.category);

    if (index === -1) {
      categories.push(child.category);
      fragments.push({
        category: child.category,
        children: [child.content],
      });
    } else {
      fragments[index].children.push(child.content);
    }
  }

  fragments.sort((a, b) => (a.category > b.category ? 1 : -1));

  const head = `
    import { ImageCard, PageContent } from '@pidoc/components';
  `;

  const body = `
      <PageContent>
        <div className="plugin-info markdown-body">
          <h1>Plugins Overview</h1>
        </div>
      ${fragments
        .map(
          (fragment) => `
          <h2 id="${fragment.category.toLowerCase()}" className="plugin">${fragment.category} Plugins</h2>
          <div className="boxes title-cards">${fragment.children.join('')}</div>
        `,
        )
        .join('')}
    </PageContent>
  `;

  return generatePage(pluginName, { link: route }, pluginName, head, body, route, displayName);
};
