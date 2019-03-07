import * as React from 'react';
import { Card, Button } from '../components';

export const Content: React.SFC = () => (
  <section className="cards-section text-center">
    <div className="container">
      <h2 className="title">Getting started is easy!</h2>
      <div className="intro">
        <p>
          Welcome to prettyDocs. This landing page is an example of how you can use a card view to present segments of
          your documentation. You can customise the icon fonts based on your needs.
        </p>
        <div className="cta-container">
          <Button
            icon="cloud-download-alt"
            href="https://themes.3rdwavemedia.com/bootstrap-templates/startup/prettydocs-free-bootstrap-theme-for-developers-and-startups/"
            target="_blank">
            Download Now
          </Button>
        </div>
      </div>
      <div id="cards-wrapper" className="cards-wrapper row">
        <Card title="Quick Start" icon="paper-plane" to="/documentation" kind="green">
          Demo example, consectetuer adipiscing elit
        </Card>
        <Card title="Components" icon="puzzle-piece" to="/questions" kind="pink">
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit
        </Card>
        <Card title="Charts" icon="book" to="/documentation" kind="blue">
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit
        </Card>
        <Card title="FAQ" icon="life-ring" to="/questions" kind="purple">
          Layout for FAQ page. Lorem ipsum dolor sit amet, consectetuer adipiscing elit
        </Card>
        <Card title="Showcase" icon="gift" to="/" kind="primary">
          Layout for showcase page. Lorem ipsum dolor sit amet, consectetuer adipiscing elit
        </Card>
        <Card title="License & Credits" icon="gavel" to="/documentation" kind="orange">
          Layout for license &amp; credits page. Consectetuer adipiscing elit.
        </Card>
      </div>
    </div>
  </section>
);
