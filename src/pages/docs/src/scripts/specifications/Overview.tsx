import * as React from 'react';
import { Card } from '../components';

const Overview: React.FC = () => (
  <section className="cards-section text-center">
    <div className="container">
      <h2 className="title">Piral Specifications</h2>
      <div id="cards-wrapper" className="cards-wrapper row">
        {/* start:auto-generated */}
        <Card title="Gateway" icon="puzzle-piece" to="/specifications/gateway" kind="green">
          The Gateway specification.
        </Card>
        <Card title="Piral API" icon="puzzle-piece" to="/specifications/piral-api" kind="green">
          The Piral API specification.
        </Card>
        <Card title="Pilet" icon="puzzle-piece" to="/specifications/pilet" kind="green">
          The Pilet specification.
        </Card>
        {/* end:auto-generated */}
      </div>
    </div>
  </section>
);

export default Overview;
