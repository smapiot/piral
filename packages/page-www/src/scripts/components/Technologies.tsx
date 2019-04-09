import * as React from 'react';
import { Capability } from './Capability';

export const Technologies: React.SFC = () => (
  <div className="container my-5 py-2">
    <h2 className="text-center font-weight-bold my-5">Providing a Robust Fundament!</h2>
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
