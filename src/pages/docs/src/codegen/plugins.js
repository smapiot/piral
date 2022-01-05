const { resolve, relative } = require('path');
const { readFileSync, readdirSync, existsSync } = require('fs');
const { render, docRef, generated, generatePage, getName, getDocsFrom } = require('@pidoc/core');

const categoryPrefix = 'plugin-';
const packagesRoot = resolve(__dirname, '../../../..');
const assetsPath = resolve(__dirname, '..', 'assets');
const packages = {
  plugins: getPackages('plugins'),
  converters: getPackages('converters'),
  framework: getPackages('framework'),
  utilities: getPackages('utilities'),
  tooling: getPackages('tooling'),
};
const standardPeerDeps = ['piral-core', 'react', 'react-dom', 'react-router', 'react-router-dom'];
const pluginPackages = [...packages.plugins, ...packages.converters];

function getPackageRoot(packageName) {
  for (const key of Object.keys(packages)) {
    if (packages[key].includes(packageName)) {
      return resolve(packagesRoot, key, packageName);
    }
  }
}

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
  const hasImage = existsSync(resolve(__dirname, '..', 'assets', 'extensions', `${rest}.png`));
  return hasImage ? `extensions/${rest}.png` : 'top-extensions.png';
}

function getRoute(basePath, name) {
  return (name && `${basePath}/${name}/:tab?`) || '';
}

exports.find = function (basePath, docsFolder, options) {
  const files = getPluginTypes(docsFolder);
  return files
    .map((file) => {
      const name = getName(file);
      const pluginRoot = getPackageRoot(name);
      const readme = resolve(pluginRoot, 'README.md');
      const packageJson = resolve(pluginRoot, 'package.json');
      const plugin = require(packageJson);
      const category = getPluginCategory(plugin);
      const route = getRoute(basePath, name);
      return {
        name,
        route,
        file,
        readme,
        category,
        plugin,
      };
    })
    .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
};

exports.build = function (entry, options) {
  const { name, file, route, readme, plugin, category } = entry;
  const type = readFileSync(file, 'utf8');
  const link = route.replace('/:tab?', '');
  const image = getPluginImage(name);
  const peerDepNames = Object.keys(plugin.peerDependencies || {}).filter((m) => !standardPeerDeps.includes(m));
  const peerDependencies =
    peerDepNames.length > 0
      ? `
        <h3>Peer Dependencies</h3>
        <p>The plugin has some peer dependencies that need to be installed.</p>
        <p>Install the following packages to resolve the peer dependencies correctly - if not yet available on your project.</p>
        ${peerDepNames.map((peerDep) => `<p>Install ${peerDep}:</p><pre><code>npm i ${peerDep}</code></pre>`).join('')}
      `
      : '';
  const { mdValue } = render(readme, generated);
  const content = [
    '`',
    '<h2 id="installation">Installation</h2>',
    '<p>Add the plugin to your Piral instance by running:</p>',
    `<pre><code>npm i ${plugin.name}</code></pre>`,
    peerDependencies,
    '<h2 id="description">Description</h2>',
    mdValue.substr(mdValue.indexOf('</h1>') + 5),
  ].join('');
  const pageMeta = {
    link: route,
    source: file,
    category,
    title: name,
  };
  const head = `
    import { PageContent, TypeInfo, Tabs, Markdown, PluginMeta } from '@pidoc/components';

    const link = "${docRef(readme)}";
    const meta = ${JSON.stringify(plugin)};
    const html = ${content};
  `;
  const body = `
    <PageContent>
      <div className="plugin-info">
        <img src={require('${relative(generated, assetsPath)}/${image}')} />
        <h1>${name}</h1>
      </div>
      <Tabs titles={["Overview", "Types", "Info"]}>
        <Markdown content={html} link={link} />
        <TypeInfo>{${type}}</TypeInfo>
        <PluginMeta {...meta} />
      </Tabs>
    </PageContent>
  `;

  return generatePage(name, pageMeta, `plugin-${name}`, head, body, route, name, category, link);
};
