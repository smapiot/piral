import * as React from 'react';
import { Tabs } from '../scripts/components';

const Introduction = require('../codegen/documentation.codegen');
const Reference = require('../codegen/reference.codegen');

export default ({}) => (
  <section className="container">
    <Tabs titles={['Introduction', 'Reference']}>
      <Introduction />
      <Reference />
    </Tabs>
  </section>
);
