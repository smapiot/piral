import * as React from 'react';
import { Card, Button } from '../components';

export const Content: React.SFC = () => (
  <section className="cards-section text-center">
    <div className="container">
      <h2 className="title">Welcome to the Piral documentation!</h2>
      <div className="intro">
        <p>
          We are glad to have you here. The Piral documentation should help you find what you need. If you spot any
          outdated or misleading information please use the link at the bottom to help us fix the issue.
        </p>
        <div className="cta-container">
          <Button icon="cloud-download-alt" href="https://www.npmjs.com/package/piral" target="_blank">
            Install from NPM
          </Button>
        </div>
      </div>
      <div id="cards-wrapper" className="cards-wrapper row">
        <Card title="Documentation" icon="book" to="/documentation" kind="primary">
          The full documentation for using and developing Piral.
        </Card>
        <Card title="Specifications" icon="puzzle-piece" to="/specifications" kind="primary">
          The specifications for Piral, Pilets, and the service infrastructure.
        </Card>
        <Card title="Tooling" icon="paper-plane" to="/tooling" kind="primary">
          The full documentation for using the Piral CLI.
        </Card>
        <Card title="Types" icon="binoculars" to="/types" kind="primary">
          Extensive type reference for all Piral libraries.
        </Card>
        <Card title="FAQ" icon="life-ring" to="/questions" kind="primary">
          Answers to frequently asked questions regarding Piral.
        </Card>
      </div>
    </div>
  </section>
);
