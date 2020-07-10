import * as React from 'react';
import { Link, NavLink, Route } from 'react-router-dom';
import { Search, ContentPage } from '../components';
import { Footer } from '../../../../common/components/Footer';
import { Loader } from '../../../../common/components/Loader';
import { ScrollToTop } from '../../../../common/components/ScrollToTop';

const updated = process.env.BUILD_TIME;
const version = process.env.BUILD_PCKG_VERSION;

export const Layout: React.FC = ({ children }) => {
  const [active, setActive] = React.useState(false);

  return (
    <>
      <Route component={ScrollToTop} />
      <header>
        <div className="layout-container header">
          <div className="logo">
            <Link to="/">
              <img src={require('../../../../../../docs/assets/logo-simple.png')} alt="Piral Logo" />
            </Link>
            <span className="brand-name">Piral</span>
            <span className="brand-suffix">Docs</span>
          </div>
          <Search />
          <div className="hamburger">
            <a href="#" onClick={() => setActive(!active)}>
              <i className="fas fa-bars" />
            </a>
          </div>
          <div className="version-info">
            {version && (
              <>
                <i className="fas fa-code-branch" /> v{version}{' '}
              </>
            )}
            {updated && (
              <>
                <i className="far fa-clock" /> Updated {updated}
              </>
            )}
          </div>
        </div>
        <nav className="layout-container">
          <ul className={active ? 'menu active' : 'menu'}>
            <li>
              <NavLink to="/guidelines">Guidelines</NavLink>
            </li>
            <li>
              <NavLink to="/reference">Reference</NavLink>
            </li>
            <li>
              <NavLink to="/plugins">Plugins</NavLink>
            </li>
            <li>
              <NavLink to="/tooling">Tooling</NavLink>
            </li>
            <li>
              <NavLink to="/types">Types</NavLink>
            </li>
          </ul>
        </nav>
      </header>
      <div className="layout-container content">
        <ContentPage>
          <React.Suspense fallback={<Loader />}>{children}</React.Suspense>
        </ContentPage>
      </div>
      <Footer />
    </>
  );
};
