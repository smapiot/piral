import * as React from 'react';
import { Link, NavLink, Route } from 'react-router-dom';
import { Search } from '../components';
import { Footer } from '../../../../common/components/Footer';
import { Loader } from '../../../../common/components/Loader';
import { ScrollToTop } from '../../../../common/components/ScrollToTop';

const updated = process.env.BUILD_TIME;
const version = process.env.BUILD_PCKG_VERSION;

export const Layout: React.FC = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const closeSearch = () => setOpen(false);
  const openSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setOpen(true);
  };

  return (
    <>
      <Route component={ScrollToTop} />
      <header>
        <div className="container header">
          <div className="logo">
            <Link to="/">
              <img src={require('../../../../../../docs/assets/logo-simple.png')} alt="Piral Logo" />
            </Link>
            <span className="brand-name">Piral</span>
            <span className="brand-suffix">Docs</span>
          </div>
          <div className="hamburger">
            <a href="#" onClick={() => setActive(!active)}>
              <i className="fas fa-bars" />
            </a>
          </div>
          <ul className={active ? 'menu active' : 'menu'}>
            <li>
              <NavLink to="/tutorials">Guideline</NavLink>
            </li>
            <li>
              <NavLink to="/reference">Reference</NavLink>
            </li>
            <li>
              <NavLink to="/samples">Samples</NavLink>
            </li>
            <li>
              <a href="https://dev.to/t/piral" target="_blank">
                Blog
              </a>
            </li>
            <li>
              <NavLink to="/faq">FAQ</NavLink>
            </li>
            <li>
              <a href="#" onClick={openSearch}>
                <i className="fas fa-search" />
              </a>
            </li>
          </ul>
        </div>
      </header>
      <div className="container version-info">
        {version && (
          <>
            <i className="fas fa-code-branch" /> v{version}{' '}
          </>
        )}
        {updated && (
          <>
            <i className="far fa-clock" /> Last updated: {updated}
          </>
        )}
      </div>
      <div className="content">
        <React.Suspense fallback={<Loader />}>{children}</React.Suspense>
      </div>
      <Footer />
      <Search open={open} close={closeSearch} />
    </>
  );
};
