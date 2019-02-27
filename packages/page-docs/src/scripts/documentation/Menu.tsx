import * as React from 'react';
import { Sidebar } from '../components';

export const Menu: React.SFC = () => (
  <Sidebar>
    <a className="nav-link scrollto" href="#download-section">
      Download
    </a>
    <a className="nav-link scrollto" href="#installation-section">
      Installation
    </a>
    <nav className="doc-sub-menu nav flex-column">
      <a className="nav-link scrollto" href="#step1">
        Step One
      </a>
      <a className="nav-link scrollto" href="#step2">
        Step Two
      </a>
      <a className="nav-link scrollto" href="#step3">
        Step Three
      </a>
    </nav>
    <a className="nav-link scrollto" href="#code-section">
      Code
    </a>
    <nav className="doc-sub-menu nav flex-column">
      <a className="nav-link scrollto" href="#html">
        HTML
      </a>
      <a className="nav-link scrollto" href="#css">
        CSS
      </a>
      <a className="nav-link scrollto" href="#sass">
        Sass
      </a>
      <a className="nav-link scrollto" href="#less">
        LESS
      </a>
      <a className="nav-link scrollto" href="#javascript">
        JavaScript
      </a>
      <a className="nav-link scrollto" href="#python">
        Python
      </a>
      <a className="nav-link scrollto" href="#php">
        PHP
      </a>
      <a className="nav-link scrollto" href="#handlebars">
        Handlebars
      </a>
    </nav>
    <a className="nav-link scrollto" href="#callouts-section">
      Callouts
    </a>
    <a className="nav-link scrollto" href="#tables-section">
      Tables
    </a>
    <a className="nav-link scrollto" href="#buttons-section">
      Buttons
    </a>
    <a className="nav-link scrollto" href="#video-section">
      Video
    </a>
    <a className="nav-link scrollto" href="#icons-section">
      Icons
    </a>
  </Sidebar>
);
