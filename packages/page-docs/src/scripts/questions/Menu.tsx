import * as React from 'react';
import { Sidebar } from '../components';

export const Menu: React.SFC = () => (
  <Sidebar>
    <a className="nav-link scrollto" href="#general">General</a>
    <a className="nav-link scrollto" href="#features">Features</a>
    <a className="nav-link scrollto" href="#pricing">Pricing</a>
    <a className="nav-link scrollto" href="#support">Support</a>
  </Sidebar>
);
