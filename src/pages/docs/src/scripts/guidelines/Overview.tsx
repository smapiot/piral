import * as React from 'react';
import { Card } from '../components';

const Overview: React.FC = () => (
  <section className="cards-section text-center">
    <div className="container">
      <h2 className="title">Piral Guidelines</h2>
      <div id="cards-wrapper" className="cards-wrapper row">
        {/* start:auto-generated */}
        <Card title="First Pilet" icon="puzzle-piece" to="/guidelines/first-pilet" kind="green">
          How to do "First Pilet".
        </Card>
        <Card title="Server Side Rendering" icon="puzzle-piece" to="/guidelines/server-side-rendering" kind="green">
          How to do "Server Side Rendering".
        </Card>
        <Card title="Static Piral Instance" icon="puzzle-piece" to="/guidelines/static-piral-instance" kind="green">
          How to do "Static Piral Instance".
        </Card>
        {/* end:auto-generated */}
      </div>
    </div>
  </section>
);

export default Overview;
