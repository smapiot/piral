import * as React from 'react';

export const Banner: React.FC = () => (
  <div className="banner">
    <div className="container">
      <header>
        <img src={require('../../../../../../docs/assets/logo-simple.png')} alt="logo" />
      </header>
      <h1>Piral</h1>
      <p>
        Build highly modular applications fully flexible for large scale portal solutions.
        <br /> Adjusted to your development needs, not the other way around.
      </p>

      <a href="https://docs.piral.io" className="btn atlas-cta cta-green">
        Get Started
      </a>

      <a
        href="https://codesandbox.io/s/siteless-starter-is6nx?fontsize=14&hidenavigation=1&theme=dark"
        className="btn atlas-cta cta-blue"
        target="_blank">
        Open Playground
      </a>
    </div>
  </div>
);
