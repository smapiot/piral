import * as React from 'react';

export interface SectionProps {
  id?: string;
  title?: string;
}

export const Section: React.SFC<SectionProps> = ({ id, title, children }) => (
  <section id={id} className="doc-section">
    {title && <h2 className="section-title">{title}</h2>}
    <div className="section-block">{children}</div>
  </section>
);
