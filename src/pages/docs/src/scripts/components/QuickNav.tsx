import * as React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { resolveNavigation } from '../sitemap';

const ArrowLeft: React.FC = () => (
  <div className="nav-button">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M20 11v2H8l5.5 5.5-1.42 1.42L4.16 12l7.92-7.92L13.5 5.5 8 11h12z" />
    </svg>
  </div>
);

const ArrowRight: React.FC = () => (
  <div className="nav-button">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M4 11v2h12l-5.5 5.5 1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5 16 11H4z" />
    </svg>
  </div>
);

export const QuickNav: React.FC = () => {
  const { pathname } = useLocation();
  const [prev, next] = React.useMemo(() => resolveNavigation(pathname), [pathname]);

  return (
    <div className="quick-nav">
      <nav className="layout-container">
        {prev && (
          <Link to={prev.link || prev.route} title={prev.title || prev.id} className="quick-nav-prev" rel="prev">
            <ArrowLeft />
            <div className="nav-title">
              <div className="nav-title-ellipsis">
                <span className="nav-direction">Previous</span>
                {prev.title || prev.id}
              </div>
            </div>
          </Link>
        )}
        {next && (
          <Link to={next.link || next.route} title={next.title || next.id} className="quick-nav-next" rel="next">
            <div className="nav-title">
              <div className="nav-title-ellipsis">
                <span className="nav-direction">Next</span>
                {next.title || next.id}
              </div>
            </div>
            <ArrowRight />
          </Link>
        )}
      </nav>
    </div>
  );
};
