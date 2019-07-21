import * as React from 'react';
import { Banner, Capabilities, Features, Footer, GitHubCat, Technologies } from './components';

export const App: React.FC = () => (
  <>
    <GitHubCat url="https://github.com/smapiot/piral" />
    <Banner />
    <Capabilities />
    <Features />
    <Technologies />
    {/*<Companies />*/}
    <Footer />
  </>
);
