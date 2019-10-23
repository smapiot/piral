import * as React from 'react';

export interface FeatureProps {
  title: string;
  image: string;
  reverse?: boolean;
}

export const Feature: React.FC<FeatureProps> = ({ title, image, children, reverse }) => (
  <div className={`container container-${reverse ? 'right' : 'left'}`}>
    <div className="child">
      <h2>{title}</h2>
      {children}
    </div>
    <div className="child">
      <img src={image} alt={title} className="mx-auto d-block" />
    </div>
  </div>
);
