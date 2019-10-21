import * as React from 'react';
import { Capability } from './Capability';

export const Capabilities: React.FC = () => (
  <div className="container container-section">
    <h2>Breaking the Frontend Monolith!</h2>
    <div className="text-center">
      Piral is a framework for next generation portal applications. It allows you to build web apps that follow the
      microfrontends architecture in basically no time. Piral lets you use your standard tooling to be as efficient as
      possible.
    </div>
    <div className="row">
      <Capability image={require('../../assets/capability-cloud.png')} title="Cloud Ready">
        Perfect for distributed systems running in the cloud.
      </Capability>
      <Capability image={require('../../assets/capability-license.png')} title="MIT Licensed">
        No proprietary software hijacking the security of your app.
      </Capability>
      <Capability image={require('../../assets/capability-tooling.png')} title="Tooling First">
        Every feature plays well with custom and standard tooling.
      </Capability>
    </div>
    <div className="row">
      <Capability image={require('../../assets/capability-convenient.png')} title="High Convenience">
        The base layer gives you high convenience without sacrifices.
      </Capability>
      <Capability image={require('../../assets/capability-performance.png')} title="Great Performance">
        Performance is considered important and valued as a feature.
      </Capability>
      <Capability image={require('../../assets/capability-smart.png')} title="Data-Driven">
        You can build fully dynamic and scalable applications in no time.
      </Capability>
    </div>
  </div>
);
