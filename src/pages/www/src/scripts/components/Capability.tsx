import * as React from 'react';

export interface CapabilityProps {
  image: string;
  title: string;
  children: React.ReactNode;
}

export const Capability: React.FC<CapabilityProps> = ({ image, title, children }) => (
  <div className="cell">
    <img src={image} alt={title} />
    <h4>{title}</h4>
    <p>{children}</p>
  </div>
);
