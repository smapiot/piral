import * as React from 'react';
import { ImageCard } from '../scripts/components';

export default () => (
  <section className="container">
    <div className="boxes">
      <ImageCard
        link="/reference/documentation"
        image={require('../assets/top-docs.png')}
        description="Full documentation of Piral."
        title="Documentation"
      />
      <ImageCard
        link="/reference/types"
        image={require('../assets/top-types.png')}
        description="The complete type reference."
        title="Types"
      />
      <ImageCard
        link="/reference/specifications"
        image={require('../assets/top-specs.png')}
        description="Technical specifications of the service layer."
        title="Specifications"
      />
      <ImageCard
        link="/reference/tooling"
        image={require('../assets/top-tools.png')}
        description="The full command line reference."
        title="Tooling"
      />
    </div>
  </section>
);
