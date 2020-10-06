const { resolve } = require('path');
const { readFileSync } = require('fs');
const { getPluginTypes, getName, generated, getPluginImage, getPackageRoot, getPluginCategory } = require('./paths');
const { render } = require('./markdown');
const { docRef } = require('./utils');
const { generatePage } = require('./pages');

function getRoute(name) {
  return (name && `/plugins/${name}/:tab?`) || '';
}

module.exports = function () {
  const files = getPluginTypes();
  const standardPeerDeps = ['piral-core', 'react', 'react-dom', 'react-router', 'react-router-dom'];

  const imports = files
    .map((file) => {
      const type = readFileSync(file, 'utf8');
      const name = getName(file);
      const route = getRoute(name);
      const link = route.replace('/:tab?', '');
      const image = getPluginImage(name);
      const pluginRoot = getPackageRoot(name);
      const readme = resolve(pluginRoot, 'README.md');
      const packageJson = resolve(pluginRoot, 'package.json');
      const plugin = require(packageJson);
      const category = getPluginCategory(plugin);
      const peerDepNames = Object.keys(plugin.peerDependencies || {}).filter((m) => !standardPeerDeps.includes(m));
      const peerDependencies =
        peerDepNames.length > 0
          ? `
            <h3>Peer Dependencies</h3>
            <p>The plugin has some peer dependencies that need to be installed.</p>
            <p>Install the following packages to resolve the peer dependencies correctly - if not yet available on your project.</p>
            ${peerDepNames
              .map((peerDep) => `<p>Install ${peerDep}:</p><pre><code>npm i ${peerDep}</code></pre>`)
              .join('')}
          `
          : '';
      const { mdValue } = render(readme, generated);
      const content = [
        '`',
        '<h2 id="installation">Installation</h2>',
        '<p>Add the plugin to your Piral instance by running:</p>',
        `<pre><code>npm i ${name}</code></pre>`,
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
        import { PageContent, TypeInfo, Tabs, Markdown, PluginMeta } from '../../scripts/components';

        const link = "${docRef(readme)}";
        const meta = ${JSON.stringify(plugin)};
        const html = ${content};
      `;
      const body = `
        <PageContent>
          <div className="plugin-info">
            <img src={require('../../assets/${image}')} />
            <h1>${name}</h1>
          </div>
          <Tabs titles={["Overview", "Types", "Info"]}>
            <Markdown content={html} link={link} />
            <TypeInfo>{${type}}</TypeInfo>
            <PluginMeta {...meta} />
          </Tabs>
        </PageContent>
      `;
      const page = generatePage(name, pageMeta, `plugin-${name}`, head, body, route, name, category, link);

      this.addDependency(readme, { includedInParent: true });
      return [name, category, page];
    })
    .sort((a, b) => a[1].localeCompare(b[1]) || a[0].localeCompare(b[0]))
    .map(([, , page]) => page);

  return imports;
};
