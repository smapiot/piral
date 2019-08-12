import * as React from 'react';
import { Link } from 'react-router-dom';

export interface TutorialProps {
  next?: string;
  previous?: string;
  meta?: any;
}

export const Tutorial: React.FC<TutorialProps> = ({ previous, next, children }) => (
  <section className="container">
    {children}
    <div className="tutorial-nav">
      {previous ? <Link to={previous}>Previous</Link> : <a />}
      {next ? <Link to={next}>Next</Link> : <a />}
    </div>
  </section>
);
