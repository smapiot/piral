import * as React from 'react';
import { Pilet } from 'piral-core';
import { Link } from 'react-router-dom';

/**
 * Shows an API extension using React components.
 */
export const ReactPilet: Pilet = {
  content: '',
  name: 'React Module',
  version: '1.0.0',
  hash: '1',
  setup(piral) {
    piral.registerPage('/demo', () => (
      <div>
        <h1>Empty Page</h1>
        <p>This page is empty.</p>
        <p>
          <Link to="/">Just go back to the homepage</Link>
        </p>
      </div>
    ));

    piral.registerTile(() => (
      <div className="tile">
        <Link to="/demo">Another page</Link>
      </div>
    ));

    piral.registerExtension('smiley', () => <b>:-D</b>);
  },
};
