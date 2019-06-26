import * as React from 'react';
import { Button } from '../components';

export const Content: React.FC = () => (
  <section className="cards-section text-center">
    <div className="container">
      <h2 className="title">Oops - what are you looking for?</h2>
      <div className="intro">
        <p>The requested page has not been found. Please return to the documentation homepage.</p>
        <div className="cta-container">
          <Button icon="home" to="/">
            Documentation Homepage
          </Button>
        </div>
      </div>
    </div>
  </section>
);
