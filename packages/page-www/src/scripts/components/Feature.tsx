import * as React from 'react';

export const Feature: React.SFC = ({ children }) => (
  <article className="jumbotron jumbotron-fluid feature">
    <div className="container my-5">
      <div className="row justify-content-between text-center text-md-left">
        {children}
      </div>
    </div>
  </article>
);
