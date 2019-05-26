import * as React from 'react';
import { Status } from './Status';

export const Banner: React.SFC = () => (
  <div className="jumbotron jumbotron-fluid banner">
    <div className="container text-center text-md-left">
      <header>
        <div className="row justify-content-between">
          <div className="col-2">
            <img src={require('../../../../../../docs/assets/logo-simple.png')} alt="logo" />
          </div>
          {/*
          <div className="col-6 align-self-center text-right">
            <a href="https://docs.piral.io" className="text-white lead">
              Technical Documentation
            </a>
          </div>*/}
        </div>
      </header>
      <h1 className="display-3 text-white font-weight-bold my-5">
        Piral <Status />
      </h1>
      <p className="lead text-white my-4">
        Build highly modular applications fully flexible for large scale portal solutions.
        <br /> Adjusted to your development needs, not the other way around.
      </p>
      <a href="https://docs.piral.io" className="btn my-4 font-weight-bold atlas-cta cta-green">
        Get Started
      </a>
    </div>
  </div>
);
