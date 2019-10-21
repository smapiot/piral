import * as React from 'react';
import { Status } from './Status';

export const Banner: React.FC = () => (
  <div className="banner">
    <div className="container">
      <header>
        <img src={require('../../../../../../docs/assets/logo-simple.png')} alt="logo" />
      </header>
      <h1>
        Piral <Status />
      </h1>
      <p>
        Build highly modular applications fully flexible for large scale portal solutions.
        <br /> Adjusted to your development needs, not the other way around.
      </p>
      <a href="https://docs.piral.io" className="btn my-4 font-weight-bold atlas-cta cta-green">
        Get Started
      </a>
    </div>
  </div>
);
