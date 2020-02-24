import * as React from 'react';

const List = require('../codegen/codes-list.codegen');

export default () => (
  <section className="container">
    <h1>Message Codes</h1>
    <p>These codes are used in the Piral CLI to explain available warnings, errors, and more in depth.</p>
    <List />
  </section>
);
