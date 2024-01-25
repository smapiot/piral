import * as React from 'react';
import { GitHubCat } from './components';
import { Footer } from '../../../common/components/Footer';

const Home = React.lazy(() => import('./pages/Home'));
const OssFriends = React.lazy(() => import('./pages/OssFriends'));
const Page = location.pathname === '/oss-friends' ? OssFriends : Home;

export const App: React.FC = () => (
  <>
    <GitHubCat url="https://github.com/smapiot/piral" />
    <React.Suspense fallback={<div className='loader' />}>
      <Page />
    </React.Suspense>
    <Footer />
  </>
);
