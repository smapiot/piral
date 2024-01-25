import * as React from 'react';

export interface CapabilityProps {
  image?: string;
  title: string;
  children: React.ReactNode;
  cta?: React.ReactNode;
}

export const Capability: React.FC<CapabilityProps> = ({ image, title, cta, children }) => (
  <div className="cell">
    {image && <img src={image} alt={title} />}
    <h4>{title}</h4>
    <p>{children}</p>
    {cta}
  </div>
);
