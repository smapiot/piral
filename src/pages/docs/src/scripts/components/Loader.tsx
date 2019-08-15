import * as React from 'react';

export interface LoaderProps {}

export const Loader: React.FC<LoaderProps> = () => (
  <div className="app-center">
    <div className="spinner circles">Loading ...</div>
  </div>
);
