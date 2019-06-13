import * as React from 'react';
import { ArbiterModule } from 'react-arbiter';
import { PiralApi } from 'piral-core';

/**
 * Shows a custom search registration.
 */
export const SearchPilet: ArbiterModule<PiralApi> = {
  content: '',
  dependencies: {},
  name: 'Search Module',
  version: '1.0.0',
  hash: '428',
  setup(piral) {
    const htmlResult = document.createElement('div');
    htmlResult.innerHTML = '<span style="color: red;">I AM HTML</span>';

    piral.registerSearchProvider(
      'example1',
      q =>
        new Promise(resolve =>
          setTimeout(
            () =>
              resolve([
                <b>Sample result 1 for {q.query}</b>,
                <i>Sample result 2 for {q.query}</i>,
                <span>Third result</span>,
                <div>4th result</div>,
                <div>{q.immediate ? 'IMMEDIATE' : 'chill'}</div>,
                htmlResult,
              ]),
            1000,
          ),
        ),
    );

    piral.registerSearchProvider(
      'example2',
      q => new Promise(resolve => setTimeout(() => resolve([<div>Another result ({q.query})</div>]), 3500)),
      {
        onClear() {
          console.log('Cleared...');
        },
      },
    );

    piral.registerSearchProvider(
      'example3',
      q => new Promise(resolve => setTimeout(() => resolve([<div>ONLY WHEN ENTER: ({q.query})</div>]), 100)),
      {
        onlyImmediate: true,
      },
    );
  },
};
