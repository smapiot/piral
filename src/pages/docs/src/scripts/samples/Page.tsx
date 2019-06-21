import * as React from 'react';
import { Standard } from '../layout';
import { FullDemo } from './full';
import { CoreDemo } from './core';

export const Page: React.SFC = () => {
  return (
    <Standard title="Samples" icon="desktop" kind="pink">
      <div className="intro text-center">
        <p>
          The following samples are available to see what Piral can bring to the table. The main focus of the samples is
          to teach the different concepts and introduce some common practices.
        </p>
        <p>
          The provided examples are not properly designed (as in styled). Styling can be fully customized for your needs
          anyway. The whole UX can be adjusted as desired. Nevertheless, the shown UX can be achieved with little to no
          effort.
        </p>
      </div>
      <CoreDemo />
      <FullDemo />
    </Standard>
  );
};
