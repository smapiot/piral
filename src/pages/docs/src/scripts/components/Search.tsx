import * as React from 'react';
import { Link } from 'react-router-dom';

export interface SearchProps {
  open?: boolean;
  close(): void;
}

export const Search: React.FC<SearchProps> = ({ open, close }) => {
  const [input, setInput] = React.useState('');
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    const id = setTimeout(() => {
      if (input) {
        import('../../codegen/search.codegen').then(keywords => {
          setItems([
            {
              url: '/tutorials',
              title: 'Tutorials',
              keywords: ['a', 'b'],
            },
            {
              url: '/tutorials/01-introduction',
              title: 'Introduction',
              keywords: ['a'],
            },
          ]);
        });
      } else if (items.length !== 0) {
        setItems([]);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [input]);

  return (
    open && (
      <div className="overlay" onClick={close}>
        <div className="search" onClick={e => e.stopPropagation()}>
          <div className="search-input">
            <input type="search" onChange={e => setInput(e.target.value)} value={input} />
            <i className="fas fa-search" />
          </div>
          <ul className="search-results">
            {items.map(item => (
              <li key={item.url}>
                <Link to={item.url} onClick={close}>
                  <div>
                    <span className="title">{item.title}</span>
                    <span className="url">{item.url}</span>
                    <span className="keywords">{item.keywords.join(', ')}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  );
};
