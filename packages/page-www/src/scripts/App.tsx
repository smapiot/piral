import * as React from 'react';
import { Banner, Capabilities, Feature, Footer, Companies, Status, GitHubCat } from './components';

export const App: React.SFC = () => (
  <>
    <GitHubCat url="https://github.com/smapiot/piral" />
    <Banner />
    <Status />
    <Capabilities />
    <Feature>
      <div className="col-md-6">
        <h2 className="font-weight-bold">Take a look inside</h2>
        <p className="my-4">
          Keen to see how Piral looks in practice? Watch our introductory video.
          <br /> The video shows what Piral can give you out of the box already.
        </p>
        <a href="#" className="btn my-4 font-weight-bold atlas-cta cta-blue">
          Watch Video
        </a>
      </div>
      <div className="col-md-6 align-self-center">
        <img src={require('../assets/feature-1.png')} alt="Take a look inside" className="mx-auto d-block" />
      </div>
    </Feature>
    <Feature>
      <div className="col-md-6 flex-md-last">
        <h2 className="font-weight-bold">Business ready</h2>
        <p className="my-4">
          Like what you see and want to take it to the next level?
          <br /> We have different support options and plans to offer if you need help.
        </p>
        <a href="#" className="btn my-4 font-weight-bold atlas-cta cta-blue">
          Options
        </a>
      </div>
      <div className="col-md-6 align-self-center flex-md-first">
        <img src={require('../assets/feature-2.png')} alt="Safe and reliable" className="mx-auto d-block" />
      </div>
    </Feature>
    <Companies />
    <Footer />
  </>
);
