import * as React from 'react';
import { Testimonial } from './Testimonial';
import testimonials from '../../codegen/testimonials.codegen';


export const Testimonials: React.FC = () => {
  return (
    <div className="container container-section text-center">
      <h2>Testimonials</h2>
      <p className="larger">
        Our aim is to build the best microfrontend framework. We always try to provide an optimal experience by
        listening to our users. Any feedback appreciated!
      </p>
      <div className="testimonials">
        {testimonials
          .map((t) => (
            <Testimonial key={t.id} firstName={t.firstName} lastName={t.lastName} phrase={t.phrase} face={t.face} />
          ))}
      </div>
    </div>
  );
};
