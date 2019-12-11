import * as React from 'react';

const PluginsList = require('../codegen/extensions-list.codegen');

export default () => (
  <section className="container">
    <h1>Official Plugins</h1>
    <p>These plugins are officially developed by us to help you get things done quickly.</p>
    <PluginsList />
  </section>
);
