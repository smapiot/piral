import * as React from 'react';
import { Link } from 'react-router-dom';

export interface SearchProps {
  open?: boolean;
  close(): void;
}

const worker = new Worker('../search.ts');

export const Search: React.FC<SearchProps> = ({ open, close }) => {
  const [input, setInput] = React.useState('');
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    if (open) {
      document.querySelector<HTMLInputElement>('input[type=search]').focus();
    }
  }, [open]);

  React.useEffect(() => {
    const handler = (ev: MessageEvent) => {
      switch (ev.data.type) {
        case 'load':
          return import('../../codegen/search.codegen').then(pages =>
            worker.postMessage({
              type: 'data',
              pages,
            }),
          );
        case 'results':
          return setItems(ev.data.results);
      }
    };
    worker.addEventListener('message', handler);
    return () => worker.removeEventListener('message', handler);
  }, []);

  React.useEffect(() => {
    const id = setTimeout(() => {
      if (input) {
        setItems(undefined);
        worker.postMessage({
          type: 'search',
          input,
        });
      } else if (!items || items.length !== 0) {
        setItems([]);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [input]);

  return (
    open && (
      <div className="overlay" onClick={close}>
        <div className="search">
          <div className="search-input" onClick={e => e.stopPropagation()}>
            <input type="search" onChange={e => setInput(e.target.value)} value={input} />
            <i className="fas fa-search" />
          </div>
          <ul className="search-results">
            {items !== undefined ? (
              items.map(item => (
                <li key={item.url}>
                  <Link to={item.url}>
                    <div>
                      <span className="title">{item.title}</span>
                      <span className="url">{item.url}</span>
                      <span className="keywords">{item.keywords.join(', ')}</span>
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <li>Loading ...</li>
            )}
          </ul>
        </div>
      </div>
    )
  );
};
