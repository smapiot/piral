import * as React from 'react';
import { Pilet, PiralStoreDataEvent } from 'piral-core';
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
    const n = 'value';

    const tileStyle: React.CSSProperties = {
      fontWeight: 'bold',
      fontSize: '0.8em',
      textAlign: 'center',
      color: 'blue',
      marginTop: '1em',
    };

    piral.registerPage('/demo', () => (
      <div>
        <h1>Empty Page</h1>
        <p>This page is empty.</p>
        <p>
          <Link to="/">Just go back to the homepage</Link>
        </p>
      </div>
    ));

    piral.setData(n, 0);

    piral.registerTile(() => (
      <div className="tile">
        <Link to="/demo">Another page</Link>
        <p>
          <b>Global Fun?</b>
        </p>
        <button onClick={() => piral.setData(n, piral.getData(n) + 1)}>Higher</button>
        <button onClick={() => piral.setData(n, piral.getData(n) - 1)}>Lower</button>
      </div>
    ));

    piral.registerExtension('smiley', () => {
      const [count, setCount] = React.useState(() => piral.getData(n));
      React.useEffect(() => {
        const listener = (e: PiralStoreDataEvent) => {
          if (e.name === n) {
            setCount(e.value);
          }
        };
        piral.on('store-data', listener);
        return () => piral.off('store-data', listener);
      }, []);
      return <div style={tileStyle}>From React: {count}</div>;
    });
  },
};
