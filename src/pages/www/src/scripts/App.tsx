import * as React from 'react';
import { Banner, Capabilities, Features, GitHubCat, Technologies, Testimonials, Companies } from './components';
import { Footer } from '../../../common/components/Footer';

export const App: React.FC = () => (
  <>
    <GitHubCat url="https://github.com/smapiot/piral" />
    <Banner />
    <Capabilities />
    <Features />
    <Testimonials />
    <Companies />
    <Technologies />
    <Footer />
  </>
);
