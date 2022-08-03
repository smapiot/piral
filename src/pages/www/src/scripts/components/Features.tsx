import * as React from 'react';
import { Feature } from './Feature';

export const Features: React.FC = () => (
  <>
    <div className="features intro">
      <Feature title="Take a Look Inside" image={require('../../assets/feature-1.png')}>
        <p className="larger">
          Keen to see how Piral looks in practice? Watch our introductory video.
          <br /> The video shows what Piral can give you out of the box already.
        </p>
        <a href="https://youtu.be/SkKvpBHy_5I" className="btn atlas-cta cta-blue" target="_blank">
          Watch Video
        </a>
      </Feature>
      <Feature title="Business Ready" image={require('../../assets/feature-2.png')} reverse>
        <p className="larger">
          Like what you see and want to take it to the next level?
          <br /> We have different support options and plans. Just contact us for an offer.
        </p>
        <a href="https://www.piral.cloud" className="btn atlas-cta cta-blue" target="_blank">
          See Options
        </a>
      </Feature>
    </div>
    <div className="features outro">
      <Feature title="Easy to Reach" image={require('../../assets/feature-3.png')}>
        <p className="larger">
          Do you have a question? Do you need support or more guidance?
          <br /> We are always easy to reach and open for discussions. Our community is here to help!
        </p>
        <a href="https://gitter.im/piral-io/community" className="btn atlas-cta cta-blue" target="_blank">
          Contact Us
        </a>
      </Feature>
      <Feature title="Batteries Included" image={require('../../assets/feature-4.png')} reverse>
        <p className="larger">
          Extensibility is built-in to give you the freedom to choose what you need.
          <br /> We provide already a rich set of plugins to help you get your work done quickly.
        </p>
        <a href="https://docs.piral.io/plugins" className="btn atlas-cta cta-blue" target="_blank">
          Available Plugins
        </a>
      </Feature>
    </div>
  </>
);
