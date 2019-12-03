import * as React from 'react';
import { Link } from 'react-router-dom';

const TutorialsList = require('../codegen/tutorials-list.codegen');

export default () => (
  <section className="container">
    <h1>Tutorials</h1>
    <p>
      These tutorials provide a guideline for developing an application based on Piral. They are also helpful for
      creating pilets even though we recommend that the Piral instance owners should provide the main information.
    </p>
    <p>
      The tutorials are ordered such that prerequisites do not have to be covered. Skip tutorials only if you are sure
      that you know the content.
    </p>
    <TutorialsList />
    <p>
      If you look for more information the <Link to="/reference">references</Link> should be helpful.
    </p>
  </section>
);
