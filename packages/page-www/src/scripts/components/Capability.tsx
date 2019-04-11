import * as React from 'react';

export interface CapabilityProps {
  image: string;
  title: string;
}

export const Capability: React.SFC<CapabilityProps> = ({ image, title, children }) => (
  <div className="col-md-4 text-center">
    <img src={image} alt={title} className="mx-auto" />
    <h4>{title}</h4>
    <p>{children}</p>
  </div>
);
