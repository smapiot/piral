import * as React from 'react';

export default () => (
  <section className="container">
    <img className="not-found-teaser" src={require('../assets/not_found.svg')} alt="Not Found" />
    <h1>Page Not Found</h1>
    <p>The page you are looking for has not been found here. Maybe start a search?</p>
    <p>The search is located on the top right corner. You can just click on the magnifier symbol.</p>
  </section>
);
