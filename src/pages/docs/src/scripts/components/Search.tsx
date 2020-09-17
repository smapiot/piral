import * as React from 'react';
import { Link } from 'react-router-dom';
import FlexSearch from 'flexsearch';

const index: any = FlexSearch.create({
  doc: {
    id: 'id',
    field: ['content', 'keywords', 'title'],
  },
});

function useSearch(open: boolean): [string, (value: string) => void, Array<any>] {
  const [input, setInput] = React.useState('');
  const [items, setItems] = React.useState([]);
  const loading = React.useRef<Promise<void>>();

  React.useEffect(() => {
    if (open) {
      document.querySelector<HTMLInputElement>('#searchInput').focus();

      if (!loading.current) {
        loading.current = import('../../codegen/search.codegen').then((docs) =>
          index.import(docs, { serialize: false }),
        );
      }
    }
  }, [open, input]);

  React.useEffect(() => {
    const id = setTimeout(() => {
      if (input) {
        loading.current.then(() => setItems(index.search(input)));
      } else if (!items || items.length !== 0) {
        setItems([]);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [input]);

  return [input, setInput, items];
}

export const Search: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [input, setInput, items] = useSearch(open);
  const closeSearch = () => setOpen(false);
  const openSearch = React.useCallback((e: React.SyntheticEvent) => {
    e.preventDefault();
    setOpen(true);
  }, []);

  return (
    <div className="search-dialog" data-active={open}>
      <div className="search-overlay" onClick={closeSearch} />
      <div className="search-details">
        <form className="search-form">
          <input
            value={input}
            id="searchInput"
            onChange={(evt) => setInput(evt.currentTarget.value)}
            onFocus={openSearch}
            aria-label="Search"
            placeholder="Search"
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            spellCheck="false"
          />
          <label className="icon search-icon" onClick={openSearch}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="search-magnify-icon">
              <path d="M9.5 3A6.5 6.5 0 0116 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 019.5 16 6.5 6.5 0 013 9.5 6.5 6.5 0 019.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="search-back-icon">
              <path d="M20 11v2H8l5.5 5.5-1.42 1.42L4.16 12l7.92-7.92L13.5 5.5 8 11h12z" />
            </svg>
          </label>
          <button
            type="reset"
            className="icon reset-icon"
            aria-label="Clear"
            tabIndex={-1}
            data-active={items.length > 0}
            onClick={() => setInput('')}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
            </svg>
          </button>
        </form>
        <div className="search-results">
          <div className="search-scroll scroller">
            <div className="search-result">
              <div className="search-result-meta">
                {!input.length ? 'Type to start searching' : `${items.length} matching documents`}
              </div>
              <ol className="search-result-list">
                {items.map((item) => (
                  <li key={item.id} className="search-result-list-item">
                    <Link to={item.link} onClick={closeSearch}>
                      <div>
                        <span className="title">{item.title}</span>
                        <span className="url">{item.link}</span>
                        <span className="keywords">{item.keywords.join(', ')}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
