import * as React from 'react';
import { Capability } from './Capability';

export const Technologies: React.FC = () => (
  <div className="container container-section">
    <h2 className="text-center font-weight-bold my-5">Providing a Robust Fundament!</h2>
    <div className="text-center">
      We know that stability is one of your top requirements for choosing the right basis. We also know that you care
      about developer experience and efficiency. Piral ships with everything to make your life simpler - so that you can
      focus on what's important for <i>your app</i>.
    </div>
    <div className="row">
      <Capability image={require('../../assets/tech-guides.png')} title="Great Documentation">
        Our goal is to have an <b>outstanding documentation</b> experience.
      </Capability>
      <Capability image={require('../../assets/tech-coverage.png')} title="Extensively Tested">
        We aim for a very <b>high test coverage</b> and test everything extensively.
      </Capability>
      <Capability image={require('../../assets/tech-declarations.png')} title="Fully Typed">
        Everything is created with <b>TypeScript</b>. We ship all the declarations.
      </Capability>
    </div>
  </div>
);
