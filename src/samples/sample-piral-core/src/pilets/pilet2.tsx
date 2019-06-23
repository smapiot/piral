import * as React from 'react';
import { Link } from 'react-router-dom';
import { ArbiterModule } from 'react-arbiter';
import { SampleApi } from '../types';

/**
 * Shows the usage of another module, here with a
 * feed connector.
 */
export const Pilet2: ArbiterModule<SampleApi> = {
  content: '',
  dependencies: {},
  name: 'Sample Module',
  version: '1.0.0',
  hash: '2',
  setup(piral) {
    console.log(piral);

    const connect = piral.createConnector<Array<string>, string>({
      initialize() {
        return new Promise((resolve, reject) => setTimeout(() => resolve(['one', 'two', 'three']), 2000));
      },
      connect(cb) {
        let i = 0;
        const id = setInterval(() => {
          cb(`${i++}`);
        }, 1000);
        return () => clearInterval(id);
      },
      update(data, item) {
        return [...data, item];
      },
    });

    piral.registerTile('example', () => <div className="tile">Rendered tile from another module.</div>);

    piral.registerMenu('example', () => <Link to="/example3">Example 3</Link>, { type: 'general' });

    piral.registerPage(
      '/example3',
      connect(({ data }) => (
        <div>
          <b>This is the example page from module 2 (sample module)!</b>
          <p>Loaded the following data:</p>
          <ul>
            {data.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )),
    );
  },
};
