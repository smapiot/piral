import * as React from 'react';
import { Card } from '../components';

const Overview: React.FC = () => (
  <section className="cards-section text-center">
    <div className="container">
      <h2 className="title">Piral Specifications</h2>
      <div id="cards-wrapper" className="cards-wrapper row">
        {/* start:auto-generated */}
        <Card title="Gateway Specification" icon="puzzle-piece" to="/specifications/gateway-specification" kind="green">
          The Gateway Specification.
        </Card>
        <Card title="Pilet Specification" icon="puzzle-piece" to="/specifications/pilet-specification" kind="green">
          The Pilet Specification.
        </Card>
        <Card title="Piral API Specification" icon="puzzle-piece" to="/specifications/piral-api-specification" kind="green">
          The Piral API Specification.
        </Card>
        {/* end:auto-generated */}
      </div>
    </div>
  </section>
);

export default Overview;
