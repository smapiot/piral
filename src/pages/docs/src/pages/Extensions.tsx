import * as React from 'react';

const PluginsList = require('../codegen/extensions-list.codegen');

export default () => (
  <section className="layout-container">
    <h1>Official Plugins</h1>
    <p>These plugins are officially developed by us to help you get things done quickly.</p>
    <p>Many of these plugins just wrap an existing API and expose useful parts also via the Pilet API.</p>
    <PluginsList />
  </section>
);
