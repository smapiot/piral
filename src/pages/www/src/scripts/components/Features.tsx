import * as React from 'react';
import { Feature } from './Feature';

export const Features: React.FC = () => (
  <>
    <div className="features intro">
      <Feature title="Take a look inside" image={require('../../assets/feature-1.png')}>
        <p>
          Keen to see how Piral looks in practice? Watch our introductory video.
          <br /> The video shows what Piral can give you out of the box already.
        </p>
        <a href="https://youtu.be/SkKvpBHy_5I" className="btn atlas-cta cta-blue">
          Watch Video
        </a>
      </Feature>
      <Feature title="Business ready" image={require('../../assets/feature-2.png')} reverse>
        <p>
          Like what you see and want to take it to the next level?
          <br /> We have different support options and plans to offer if you need professional help.
        </p>
        <a href="https://smapiot.com/products/piral" className="btn atlas-cta cta-blue">
          See Options
        </a>
      </Feature>
    </div>
    <div className="features outro">
      <Feature title="Easy to reach" image={require('../../assets/feature-3.png')}>
        <p>
          Do you have a question? Do you need support or more guidance?
          <br /> We are always easy to reach and open for discussions. We love our community!
        </p>
        <a href="https://gitter.im/piral-io/community" className="btn atlas-cta cta-blue">
          Contact Us
        </a>
      </Feature>
      <Feature title="Batteries included" image={require('../../assets/feature-4.png')} reverse>
        <p>
          Extensibility is built-in to give you the freedom to choose what you need.
          <br /> We provide already a rich set of plugins to help you get started.
        </p>
        <a href="https://docs.piral.io/plugins" className="btn atlas-cta cta-blue">
          Available Plugins
        </a>
      </Feature>
    </div>
  </>
);
