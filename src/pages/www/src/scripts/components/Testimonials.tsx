import * as React from 'react';
import { Testimonial } from './Testimonial';

const testimonials = require('../../codegen/testimonials.codegen');

function randomize() {
  return Math.random() - 0.5;
}

function shuffle(ids: Array<string>) {
  return ids.sort(randomize).slice(0, 3);
}

export const Testimonials: React.FC = () => {
  const [selectedIds] = React.useState(() => shuffle(testimonials.map(t => t.id)));

  return (
    <div className="container container-section">
      {/*
      <h2>Testimonials</h2>
      <p>Our aim is to build the best microfrontend framework. We always try to get the best user experience.</p>
    */}
      <div className="testimonials">
        {testimonials
          .filter(t => selectedIds.indexOf(t.id) !== -1)
          .map(t => (
            <Testimonial key={t.id} firstName={t.firstName} lastName={t.lastName} phrase={t.phrase} face={t.face} />
          ))}
      </div>
    </div>
  );
};
