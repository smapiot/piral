import * as React from 'react';
import { Pilet } from 'piral-core';

/**
 * Shows a custom search registration.
 */
export const SearchPilet: Pilet = {
  content: '',
  name: 'Search Module',
  version: '1.0.0',
  hash: '428',
  setup(piral) {
    piral.registerSearchProvider(
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
                {
                  component: {
                    mount(element) {
                      element.innerHTML = '<span style="color: red;">I AM HTML</span>';
                    },
                  },
                  type: 'html',
                },
              ]),
            1000,
          ),
        ),
    );

    piral.registerSearchProvider(
      q => new Promise(resolve => setTimeout(() => resolve([<div>Another result ({q.query})</div>]), 3500)),
      {
        onClear() {
          console.log('Cleared...');
        },
      },
    );

    piral.registerSearchProvider(
      q => new Promise(resolve => setTimeout(() => resolve([<div>ONLY WHEN ENTER: ({q.query})</div>]), 100)),
      {
        onlyImmediate: true,
      },
    );
  },
};
