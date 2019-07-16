import * as React from 'react';
import { Card } from '../components';

const Overview: React.FC = () => (
  <section className="cards-section text-center">
    <div className="container">
      <h2 className="title">Piral Guidelines</h2>
      <div id="cards-wrapper" className="cards-wrapper row">
        {/* start:auto-generated */}
        <Card title="First Pilet" icon="monument" to="/guidelines/first-pilet" kind="primary">
          How to do "First Pilet".
        </Card>
        <Card title="Server Side Rendering" icon="monument" to="/guidelines/server-side-rendering" kind="primary">
          How to do "Server Side Rendering".
        </Card>
        <Card title="Static Piral Instance" icon="monument" to="/guidelines/static-piral-instance" kind="primary">
          How to do "Static Piral Instance".
        </Card>
        {/* end:auto-generated */}
      </div>
    </div>
  </section>
);

export default Overview;
