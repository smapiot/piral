import * as React from 'react';

const ExtensionsList = require('../codegen/extensions-list.codegen');

export default () => (
  <section className="container">
    <h1>Official Extensions</h1>
    <p>These extensions are officially developed by us to help you get things done quickly.</p>
    <div className="boxes">
      <ExtensionsList />
    </div>
  </section>
);
