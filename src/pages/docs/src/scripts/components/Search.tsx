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
    if (open) {
      document.querySelector<HTMLInputElement>('input[type=search]').focus();
    }
  }, [open]);

  React.useEffect(() => {
    const id = setTimeout(() => {
      if (input) {
        const tokens = input.toLowerCase().split(/[\s]+/);
        import('../../codegen/search.codegen').then(pages => {
          console.log(pages);
          const maxResults = 5;
          const results = pages
            .map(page => {
              const found = page.keywords.filter(k => tokens.indexOf(k.keyword) !== -1);
              return {
                ...page,
                keywords: found.map(m => m.keyword),
                rating: found.reduce((sum, k) => sum + k.count, 0) + Math.pow(10, found.length),
              };
            })
            .sort((a, b) => b.rating - a.rating)
            .filter((page, i) => page.rating > 1 && i < maxResults)
            .map(page => ({
              url: page.route,
              title: page.title,
              keywords: page.keywords,
              rating: page.rating,
            }));

          setItems(results);
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
        <div className="search">
          <div className="search-input" onClick={e => e.stopPropagation()}>
            <input type="search" onChange={e => setInput(e.target.value)} value={input} />
            <i className="fas fa-search" />
          </div>
          <ul className="search-results">
            {items.map(item => (
              <li key={item.url}>
                <Link to={item.url}>
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
