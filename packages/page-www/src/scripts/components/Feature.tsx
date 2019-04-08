import * as React from 'react';

export interface FeatureProps {
  title: string;
  image: string;
}

export const Feature: React.SFC<FeatureProps> = ({ title, image, children }) => (
  <div className="container my-5">
    <div className="row justify-content-between text-center text-md-left">
      <div className="col-md-6 flex-md-last">
        <h2 className="font-weight-bold">{title}</h2>
        {children}
      </div>
      <div className="col-md-6 align-self-center flex-md-first">
        <img src={image} alt={title} className="mx-auto d-block" />
      </div>
    </div>
  </div>
);
